import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

// SES / STS には一切出ない。SESClient に渡された config（= どの credential 経路か）と
// send された内容だけを観測する。
const { sesConfigs, sendMock, fromWebTokenMock } = vi.hoisted(() => ({
  sesConfigs: [] as Array<Record<string, unknown>>,
  sendMock: vi.fn(),
  fromWebTokenMock: vi.fn(),
}));

vi.mock("@aws-sdk/client-ses", () => ({
  SESClient: class {
    constructor(config: Record<string, unknown>) {
      sesConfigs.push(config);
    }
    send = sendMock;
  },
  SendEmailCommand: class {
    constructor(public input: unknown) {}
  },
}));

vi.mock("@aws-sdk/credential-providers", () => ({
  fromWebToken: fromWebTokenMock,
}));

const ROLE_ARN = "arn:aws:iam::123456789012:role/tarophotos-ses-federation";

// sesClient はモジュールスコープでキャッシュされるため、テストごとに読み直す。
async function loadProcessFormSubmission() {
  vi.resetModules();
  return (await import("@/app/api/_lib/process-form-submission")).processFormSubmission;
}

// レート制限（IP 単位）を跨がないよう、リクエストごとに IP を変える。
let ipCounter = 0;
function fakeRequest(body: unknown): NextRequest {
  ipCounter += 1;
  return {
    headers: new Headers({ "x-forwarded-for": `10.1.0.${ipCounter}` }),
    json: async () => body,
  } as unknown as NextRequest;
}

const validBody = { fields: { name: "Taro", email: "taro@example.com" }, website: "", elapsedMs: 10_000 };

const options = {
  formKey: "contact",
  displayName: "Contact Form",
  notificationEmail: "inbox@example.com",
  successMessage: "ok",
  missingNotificationMessage: "missing",
  subject: "New contact inquiry",
  replyToField: "email",
};

describe("processFormSubmission", () => {
  beforeEach(() => {
    sesConfigs.length = 0;
    sendMock.mockReset().mockResolvedValue({ MessageId: "msg-1" });
    fromWebTokenMock.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.stubEnv("SES_FROM_EMAIL", "noreply@example.com");
    vi.stubEnv("SES_AWS_ROLE_ARN", "");
    vi.stubEnv("SES_REGION", "");
    vi.stubEnv("K_SERVICE", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("SES_AWS_ROLE_ARN があれば federation 経由で送信し、静的キーは無視する", async () => {
    vi.stubEnv("SES_AWS_ROLE_ARN", ROLE_ARN);
    vi.stubEnv("SES_AWS_ACCESS_KEY_ID", "AKIASTATIC");
    vi.stubEnv("SES_AWS_SECRET_ACCESS_KEY", "static-secret");
    const fetchMock = vi.fn().mockResolvedValue(new Response("google-id-token"));
    vi.stubGlobal("fetch", fetchMock);
    const stsCredentials = { accessKeyId: "ASIATEMP", secretAccessKey: "temp" };
    fromWebTokenMock.mockReturnValue(async () => stsCredentials);

    const processFormSubmission = await loadProcessFormSubmission();
    const res = await processFormSubmission(fakeRequest(validBody), options);

    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sesConfigs).toHaveLength(1);
    expect(sesConfigs[0].region).toBe("ap-northeast-1");

    const credentials = sesConfigs[0].credentials;
    expect(typeof credentials).toBe("function");
    await expect((credentials as () => Promise<unknown>)()).resolves.toBe(stsCredentials);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/service-accounts/default/identity?audience=sts.amazonaws.com"),
      { headers: { "Metadata-Flavor": "Google" } },
    );
    expect(fromWebTokenMock).toHaveBeenCalledWith({
      roleArn: ROLE_ARN,
      roleSessionName: "tarophotos-contact-form",
      webIdentityToken: "google-id-token",
    });
  });

  it("ローカル（ROLE_ARN 未設定・Cloud Run 外）では静的キーを配線せず SDK 既定チェーンに委ねる", async () => {
    vi.stubEnv("SES_AWS_ACCESS_KEY_ID", "AKIASTATIC");
    vi.stubEnv("SES_AWS_SECRET_ACCESS_KEY", "static-secret");
    vi.stubEnv("SES_REGION", "us-east-1");

    const processFormSubmission = await loadProcessFormSubmission();
    const res = await processFormSubmission(fakeRequest(validBody), options);

    expect(res.status).toBe(200);
    expect(sesConfigs).toEqual([{ region: "us-east-1" }]);
  });

  it("Cloud Run で ROLE_ARN が無ければ送信せず 500（fail-closed）", async () => {
    vi.stubEnv("K_SERVICE", "tarophotos");

    const processFormSubmission = await loadProcessFormSubmission();
    const res = await processFormSubmission(fakeRequest(validBody), options);

    expect(res.status).toBe(500);
    expect(sendMock).not.toHaveBeenCalled();
    expect(sesConfigs).toHaveLength(0);
  });

  it("SES_FROM_EMAIL が無ければ送信せず 500", async () => {
    vi.stubEnv("SES_FROM_EMAIL", "");
    vi.stubEnv("CONTACT_FROM_EMAIL", "");

    const processFormSubmission = await loadProcessFormSubmission();
    const res = await processFormSubmission(fakeRequest(validBody), options);

    expect(res.status).toBe(500);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("通知メールを送り、replyTo に送信者アドレスを入れる", async () => {
    const processFormSubmission = await loadProcessFormSubmission();
    const res = await processFormSubmission(fakeRequest(validBody), options);

    expect(res.status).toBe(200);
    const command = sendMock.mock.calls[0][0] as { input: Record<string, unknown> };
    expect(command.input).toMatchObject({
      Source: "noreply@example.com",
      Destination: { ToAddresses: ["inbox@example.com"] },
      ReplyToAddresses: ["taro@example.com"],
    });
  });
});
