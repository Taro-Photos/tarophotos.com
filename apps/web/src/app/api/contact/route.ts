import { NextRequest } from "next/server";

import { contactFields } from "@/app/_content/contact";
import { processFormSubmission } from "@/app/api/_lib/process-form-submission";

const CONTACT_NOTIFICATION_EMAIL = process.env.CONTACT_NOTIFICATION_EMAIL;

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export async function POST(request: NextRequest) {
  return processFormSubmission(request, {
    formKey: "contact",
    displayName: "Contact フォーム",
    notificationEmail: CONTACT_NOTIFICATION_EMAIL,
    successMessage: "Contact request received.",
    missingNotificationMessage: "Contact notification email is not configured.",
    fieldDefinitions: contactFields,
    subject: (payload) => {
      const category = payload.fields.category;
      const readableCategory = Array.isArray(category) ? category.join(", ") : category;
      const suffix = readableCategory ? `: ${readableCategory}` : "";
      return `New contact inquiry${suffix}`;
    },
    replyToField: "email",
    autoResponse: {
      emailField: "email",
      nameField: "name",
      subject: () => "【Taro Photos】お問い合わせありがとうございます",
      html: (_, context) => {
        const greeting = context.recipientName ? `${escapeHtml(context.recipientName)} 様` : "";
        return `<!DOCTYPE html><html><body style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;line-height:1.7;color:#0f172a;background:#f8fafc;padding:24px;">
          ${greeting ? `<p>${greeting}</p>` : ""}
          <p>お問い合わせありがとうございます。</p>
          <p>以下の内容で受け付けました。担当者が詳細を確認のうえ、<strong>2日以内</strong>にご返信いたします。追加で共有したい事項があれば、本メールに返信してお知らせください。</p>
          ${context.summaryHtml}
          <p style="margin-top:24px;font-size:12px;color:#64748b;">本メールは自動送信です。心当たりがない場合はこのまま破棄してください。</p>
        </body></html>`;
      },
      text: (_, context) => {
        const greeting = context.recipientName ? `${context.recipientName} 様\n\n` : "";
        return `${greeting}お問い合わせありがとうございます。

以下の内容で受け付けました。担当者が詳細を確認のうえ、2日以内にご返信いたします。追加で共有したい事項があれば、本メールに返信してお知らせください。

${context.summaryText}

――
本メールは自動送信です。心当たりがない場合はこのまま破棄してください。`;
      },
    },
  });
}
