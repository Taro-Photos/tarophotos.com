import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();
const resendConstructorMock = vi.fn();

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation((apiKey: string) => {
    resendConstructorMock(apiKey);
    return {
      emails: {
        send: sendMock,
      },
    };
  }),
}));

const originalEnv = {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  CONTACT_NOTIFICATION_EMAIL: process.env.CONTACT_NOTIFICATION_EMAIL,
};

function createRequest(body: unknown, headers?: Record<string, string>) {
  return new NextRequest("http://localhost/api/contact", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      ...headers,
    },
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.resetModules();
    sendMock.mockReset();
    resendConstructorMock.mockReset();

    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM_EMAIL;
    delete process.env.CONTACT_NOTIFICATION_EMAIL;
  });

  afterEach(() => {
    process.env.RESEND_API_KEY = originalEnv.RESEND_API_KEY;
    process.env.RESEND_FROM_EMAIL = originalEnv.RESEND_FROM_EMAIL;
    process.env.CONTACT_NOTIFICATION_EMAIL = originalEnv.CONTACT_NOTIFICATION_EMAIL;
  });

  it("returns 500 when Resend is not configured", async () => {
    const { POST } = await import("@/app/api/contact/route");

    const response = await POST(createRequest({ fields: {} }));
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({
      message: "Email delivery is not configured.",
    });
  });

  it("returns 500 when notification email is missing", async () => {
    process.env.RESEND_API_KEY = "test-api-key";
    process.env.RESEND_FROM_EMAIL = "noreply@example.com";

    const { POST } = await import("@/app/api/contact/route");

    const response = await POST(createRequest({ fields: {} }));
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({
      message: "Contact notification email is not configured.",
    });
  });

  it("sends an email with contact payload", async () => {
    process.env.RESEND_API_KEY = "test-api-key";
    process.env.RESEND_FROM_EMAIL = "noreply@example.com";
    process.env.CONTACT_NOTIFICATION_EMAIL = "inbox@example.com";

    sendMock
      .mockResolvedValueOnce({ data: { id: "email_456" }, error: null } as unknown)
      .mockResolvedValueOnce({ data: { id: "email_auto" }, error: null } as unknown);

    const { POST } = await import("@/app/api/contact/route");

    const response = await POST(
      createRequest(
        {
          fields: {
            category: "制作パートナーについて",
            name: "山田 太郎",
            email: "guest@example.com",
            message: "取材させてください",
          },
        },
        { referer: "https://taro.photos/contact", "user-agent": "Vitest" },
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      message: "Contact request received.",
    });

    expect(resendConstructorMock).toHaveBeenCalledWith("test-api-key");
    expect(sendMock).toHaveBeenCalledTimes(2);

    const [message] = sendMock.mock.calls[0] as [
      {
        from: string;
        to: string;
        subject: string;
        html: string;
        text: string;
        reply_to?: string;
      },
    ];

    expect(message.from).toBe("noreply@example.com");
    expect(message.to).toBe("inbox@example.com");
    expect(message.subject).toContain("制作パートナーについて");
    expect(message.html).toContain("制作パートナーについて");
    expect(message.html).toContain("山田 太郎");
    expect(message.text).toContain("取材させてください");
    expect(message.reply_to).toBe("guest@example.com");

    const [autoResponse] = sendMock.mock.calls[1] as [
      {
        from: string;
        to: string;
        subject: string;
        html: string;
        text: string;
      },
    ];

    expect(autoResponse.from).toBe("noreply@example.com");
    expect(autoResponse.to).toBe("guest@example.com");
    expect(autoResponse.subject).toContain("お問い合わせありがとうございます");
    expect(autoResponse.text).toContain("2日以内にご返信いたします");
    expect(autoResponse.html).toContain("2日以内");
    expect(autoResponse.html).toContain("制作パートナーについて");
  });

  it("returns 400 for malformed payloads", async () => {
    process.env.RESEND_API_KEY = "test-api-key";
    process.env.RESEND_FROM_EMAIL = "noreply@example.com";
    process.env.CONTACT_NOTIFICATION_EMAIL = "inbox@example.com";

    const { POST } = await import("@/app/api/contact/route");

    const response = await POST(createRequest({}));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ message: "Invalid payload." });
  });

  it("returns 500 when Resend send fails", async () => {
    process.env.RESEND_API_KEY = "test-api-key";
    process.env.RESEND_FROM_EMAIL = "noreply@example.com";
    process.env.CONTACT_NOTIFICATION_EMAIL = "inbox@example.com";

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    sendMock.mockRejectedValueOnce(new Error("send failed"));

    const { POST } = await import("@/app/api/contact/route");

    const response = await POST(createRequest({ fields: {} }));
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({
      message: "Failed to send email.",
    });

    errorSpy.mockRestore();
  });
});
