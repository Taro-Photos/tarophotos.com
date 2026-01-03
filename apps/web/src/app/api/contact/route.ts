import { NextRequest } from "next/server";

import { contactFields } from "@/app/_content/contact";
import { processFormSubmission } from "@/app/api/_lib/process-form-submission";

const CONTACT_NOTIFICATION_EMAIL = process.env.SES_TO_EMAIL || process.env.CONTACT_NOTIFICATION_EMAIL;

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export async function POST(request: NextRequest)
{
  return processFormSubmission(request, {
    formKey: "contact",
    displayName: "Contact Form",
    notificationEmail: CONTACT_NOTIFICATION_EMAIL,
    successMessage: "Contact request received.",
    missingNotificationMessage: "Contact notification email is not configured.",
    fieldDefinitions: contactFields,
    subject: (payload) =>
    {
      const category = payload.fields.category;
      const readableCategory = Array.isArray(category) ? category.join(", ") : category;
      const suffix = readableCategory ? `: ${readableCategory}` : "";
      return `New contact inquiry${suffix}`;
    },
    replyToField: "email",
    autoResponse: {
      emailField: "email",
      nameField: "name",
      subject: () => "[Taro Photos] Thank you for your inquiry",
      html: (_, context) =>
      {
        const greeting = context.recipientName ? `${escapeHtml(context.recipientName)}` : "Hello";
        return `<!DOCTYPE html><html><body style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;line-height:1.7;color:#0f172a;background:#f8fafc;padding:24px;">
          ${greeting ? `<p>${greeting},</p>` : ""}
          <p>Thank you for contacting us.</p>
          <p>We have received your inquiry. We will get back to you within 2 business days. If you have any additional information to share, please reply to this email.</p>
          ${context.summaryHtml}
          <p style="margin-top:24px;font-size:12px;color:#64748b;">This is an automated message. If you did not make this request, please ignore this email.</p>
        </body></html>`;
      },
      text: (_, context) =>
      {
        const greeting = context.recipientName ? `${context.recipientName},\n\n` : "Hello,\n\n";
        return `${greeting}Thank you for contacting us.

We have received your inquiry. We will get back to you within 2 business days. If you have any additional information to share, please reply to this email.

${context.summaryText}

--
This is an automated message. If you did not make this request, please ignore this email.`;
      },
    },
  });
}
