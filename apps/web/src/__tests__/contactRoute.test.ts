import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();
const sesConstructorMock = vi.fn();

vi.mock("@aws-sdk/client-ses", () =>
{
  return {
    SESClient: class
    {
      constructor(config: unknown)
      {
        sesConstructorMock(config);
      }
      send(command: unknown)
      {
        return sendMock(command);
      }
    },
    SendEmailCommand: class
    {
      constructor(input: unknown)
      {
        Object.assign(this, input);
      }
    },
  };
});

const originalEnv = {
  SES_REGION: process.env.SES_REGION,
  SES_FROM_EMAIL: process.env.SES_FROM_EMAIL,
  CONTACT_NOTIFICATION_EMAIL: process.env.CONTACT_NOTIFICATION_EMAIL,
};

function createRequest(body: unknown, headers?: Record<string, string>)
{
  return new NextRequest("http://localhost/api/contact", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      ...headers,
    },
  });
}

describe("POST /api/contact", () =>
{
  beforeEach(() =>
  {
    vi.resetModules();
    sendMock.mockReset();
    sesConstructorMock.mockReset();

    // Clear SES env vars
    delete process.env.SES_REGION;
    delete process.env.SES_FROM_EMAIL;
    delete process.env.CONTACT_NOTIFICATION_EMAIL;
  });

  afterEach(() =>
  {
    process.env.SES_REGION = originalEnv.SES_REGION;
    process.env.SES_FROM_EMAIL = originalEnv.SES_FROM_EMAIL;
    process.env.CONTACT_NOTIFICATION_EMAIL = originalEnv.CONTACT_NOTIFICATION_EMAIL;
  });

  it("returns 500 when SES is not configured", async () =>
  {
    const { POST } = await import("@/app/api/contact/route");

    const response = await POST(createRequest({ fields: {} }));
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({
      message: "Email delivery is not configured.",
    });
  });

  it("returns 500 when notification email is missing", async () =>
  {
    process.env.SES_FROM_EMAIL = "noreply@example.com";

    const { POST } = await import("@/app/api/contact/route");

    const response = await POST(createRequest({ fields: {} }));
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({
      message: "Contact notification email is not configured.",
    });
  });

  it("sends an email with contact payload via SES", async () =>
  {
    process.env.SES_FROM_EMAIL = "noreply@example.com";
    process.env.CONTACT_NOTIFICATION_EMAIL = "inbox@example.com";
    process.env.SES_REGION = "us-east-1";

    sendMock
      .mockResolvedValueOnce({ MessageId: "email_456" })
      .mockResolvedValueOnce({ MessageId: "email_auto" });

    const { POST } = await import("@/app/api/contact/route");

    const response = await POST(
      createRequest(
        {
          fields: {
            category: "General Inquiry",
            name: "Test User",
            email: "guest@example.com",
            message: "This is a test message",
            agree: "I agree to the Privacy Policy",
          },
        },
        { referer: "https://taro.photos/contact", "user-agent": "Vitest" },
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      message: "Contact request received.",
    });

    expect(sesConstructorMock).toHaveBeenCalledWith({ region: "us-east-1" });
    expect(sendMock).toHaveBeenCalledTimes(2);

    // Verify first email (notification)
    const notificationCommand = sendMock.mock.calls[0][0];
    expect(notificationCommand.Source).toBe("noreply@example.com");
    expect(notificationCommand.Destination.ToAddresses).toContain("inbox@example.com");
    expect(notificationCommand.Message.Subject.Data).toContain("General Inquiry");
    expect(notificationCommand.Message.Body.Html.Data).toContain("General Inquiry");
    expect(notificationCommand.ReplyToAddresses).toContain("guest@example.com");

    // Verify second email (auto-response)
    const autoResponseCommand = sendMock.mock.calls[1][0];
    expect(autoResponseCommand.Source).toBe("noreply@example.com");
    expect(autoResponseCommand.Destination.ToAddresses).toContain("guest@example.com");
    expect(autoResponseCommand.Message.Subject.Data).toContain("Thank you for your inquiry");
  });

  it("returns 500 when SES send fails with specific error info", async () =>
  {
    process.env.SES_FROM_EMAIL = "noreply@example.com";
    process.env.CONTACT_NOTIFICATION_EMAIL = "inbox@example.com";

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => { });

    // Test generic error
    sendMock.mockRejectedValueOnce(new Error("AWS SES Error"));
    const { POST } = await import("@/app/api/contact/route");
    const response = await POST(createRequest({ fields: { name: "Test", email: "test@example.com", message: "Hello", category: "Other", agree: "yes" } }));
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({
      message: "Failed to send email.",
      error: "AWS SES Error"
    });

    errorSpy.mockRestore();
  });

  describe("SES specific errors", () =>
  {
    beforeEach(() =>
    {
      process.env.SES_FROM_EMAIL = "noreply@example.com";
      process.env.CONTACT_NOTIFICATION_EMAIL = "inbox@example.com";
      // Reset module registry to re-import handler with env vars
      vi.resetModules();
    });

    it("handles MessageRejected error", async () =>
    {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => { });
      const error = new Error("Message rejected");
      (error as any).name = "MessageRejected";
      sendMock.mockRejectedValueOnce(error);

      const { POST } = await import("@/app/api/contact/route");
      const response = await POST(createRequest({ fields: { name: "Test", email: "test@example.com", message: "Hello", category: "Other", agree: "yes" } }));

      expect(response.status).toBe(500);
      await expect(response.json()).resolves.toMatchObject({
        message: "Email delivery failed: Address not verified or spam detected.",
        error: "Message rejected"
      });
      errorSpy.mockRestore();
    });

    it("handles AccountSendingPausedException", async () =>
    {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => { });
      const error = new Error("Sending paused");
      (error as any).name = "AccountSendingPausedException";
      sendMock.mockRejectedValueOnce(error);

      const { POST } = await import("@/app/api/contact/route");
      const response = await POST(createRequest({ fields: { name: "Test", email: "test@example.com", message: "Hello", category: "Other", agree: "yes" } }));

      expect(response.status).toBe(500);
      await expect(response.json()).resolves.toMatchObject({
        message: "Email delivery failed: Account sending paused.",
        error: "Sending paused"
      });
      errorSpy.mockRestore();
    });

    it("handles AccessDeniedException", async () =>
    {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => { });
      const error = new Error("Access denied");
      (error as any).name = "AccessDeniedException";
      sendMock.mockRejectedValueOnce(error);

      const { POST } = await import("@/app/api/contact/route");
      const response = await POST(createRequest({ fields: { name: "Test", email: "test@example.com", message: "Hello", category: "Other", agree: "yes" } }));

      expect(response.status).toBe(500);
      await expect(response.json()).resolves.toMatchObject({
        message: "Email delivery failed: Access denied. Check IAM permissions.",
        error: "Access denied"
      });
      errorSpy.mockRestore();
    });
  });

  describe("Validation", () =>
  {
    beforeEach(() =>
    {
      process.env.SES_FROM_EMAIL = "noreply@example.com";
      process.env.CONTACT_NOTIFICATION_EMAIL = "inbox@example.com";
      vi.resetModules();
    });

    it("returns 400 when required fields are missing", async () =>
    {
      const { POST } = await import("@/app/api/contact/route");
      // Missing name
      const response = await POST(createRequest({ fields: { email: "test@example.com", message: "Hello", category: "Other", agree: "yes" } }));
      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toMatchObject({
        message: expect.stringContaining("Missing required field")
      });
    });

    it("returns 400 when email is invalid", async () =>
    {
      const { POST } = await import("@/app/api/contact/route");
      const response = await POST(createRequest({ fields: { name: "Test", email: "invalid-email", message: "Hello", category: "Other", agree: "yes" } }));
      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toMatchObject({
        message: expect.stringContaining("Invalid email format")
      });
    });

    it("returns 400 when category is empty", async () =>
    {
      const { POST } = await import("@/app/api/contact/route");
      const response = await POST(createRequest({ fields: { name: "Test", email: "test@example.com", message: "Hello", category: "", agree: "yes" } }));
      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toMatchObject({
        message: expect.stringContaining("Missing required field")
      });
    });
  });
});
