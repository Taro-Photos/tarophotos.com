import { NextRequest } from "next/server";
import { Resend } from "resend";

import type { FormField } from "@/app/_content/contact";

type FieldValue = string | string[];
type FieldMap = Record<string, FieldValue>;

export type FormSubmissionPayload = {
  submittedAt: string;
  fields: FieldMap;
  metadata: {
    userAgent: string | null;
    referrer: string | null;
  };
};

type MessageContext = {
  recipientName: string | null;
  summaryHtml: string;
  summaryText: string;
  displayName: string;
};

type MessageFactory = string | ((payload: FormSubmissionPayload, context: MessageContext) => string);

type AutoResponseOptions = {
  emailField: string;
  nameField?: string;
  subject: MessageFactory;
  html: MessageFactory;
  text: MessageFactory;
};

type FormSubmissionOptions = {
  formKey: string;
  displayName: string;
  notificationEmail?: string | null;
  successMessage: string;
  missingNotificationMessage: string;
  fieldDefinitions?: FormField[];
  subject: string | ((payload: FormSubmissionPayload) => string);
  replyToField?: string;
  autoResponse?: AutoResponseOptions;
};

type EmailContent = {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!RESEND_API_KEY) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(RESEND_API_KEY);
  }

  return resendClient;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function coerceToString(value: FieldValue): string {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return value;
}

function resolveMessage(
  template: MessageFactory,
  payload: FormSubmissionPayload,
  context: MessageContext,
) {
  return typeof template === "function" ? template(payload, context) : template;
}

type FieldEntry = { key: string; label: string; value: string };

function buildFieldEntries(
  payload: FormSubmissionPayload,
  fieldDefinitions?: FormField[],
): FieldEntry[] {
  const labelMap = new Map(fieldDefinitions?.map((field) => [field.key, field.label]));

  return Object.entries(payload.fields).map(([key, rawValue]) => {
    const label = labelMap.get(key) ?? key;
    const value = coerceToString(rawValue);
    return { key, label, value };
  });
}

function buildSummaryHtml(entries: FieldEntry[]) {
  const rows = entries
    .map(
      ({ label, value }) =>
        `<tr><th style="text-align:left;padding:8px 12px;background:#f1f5f9;color:#0f172a;">${escapeHtml(
          label,
        )}</th><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${escapeHtml(
          value || "(未入力)",
        )}</td></tr>`,
    )
    .join("");

  return `
    <table style="border-collapse:collapse;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;margin-top:16px;">
      <tbody>${rows}</tbody>
    </table>
  `;
}

function buildSummaryText(entries: FieldEntry[]) {
  const lines: string[] = [];
  entries.forEach(({ label, value }) => {
    lines.push(`${label}: ${value || "(未入力)"}`);
  });
  return lines.join("\n");
}

function buildEmailContent(
  payload: FormSubmissionPayload,
  options: FormSubmissionOptions,
): EmailContent {
  const entries = buildFieldEntries(payload, options.fieldDefinitions);

  const subject =
    typeof options.subject === "function" ? options.subject(payload) : options.subject;

  const rowsHtml = entries
    .map(
      ({ label, value }) =>
        `<tr><th style="text-align:left;padding:6px 12px;background:#0f172a;color:#f8fafc;">${escapeHtml(label)}</th><td style="padding:6px 12px;border-bottom:1px solid #e2e8f0;">${escapeHtml(
          value || "(未入力)",
        )}</td></tr>`,
    )
    .join("");

  const metadataRows = [
    { label: "送信時刻", value: payload.submittedAt },
    { label: "Referrer", value: payload.metadata.referrer ?? "(不明)" },
    { label: "User Agent", value: payload.metadata.userAgent ?? "(不明)" },
  ]
    .map(
      ({ label, value }) =>
        `<tr><th style="text-align:left;padding:6px 12px;background:#f1f5f9;color:#0f172a;">${escapeHtml(label)}</th><td style="padding:6px 12px;border-bottom:1px solid #e2e8f0;">${escapeHtml(
          value,
        )}</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;background:#f8fafc;padding:24px;">
      <h1 style="margin:0 0 16px;font-size:20px;color:#0f172a;">${escapeHtml(
        options.displayName,
      )} の新しい送信</h1>
      <table style="border-collapse:collapse;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 12px 24px -16px rgba(15,23,42,0.35);">
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
      <h2 style="margin:24px 0 12px;font-size:15px;color:#334155;">メタデータ</h2>
      <table style="border-collapse:collapse;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 12px 24px -16px rgba(15,23,42,0.25);">
        <tbody>
          ${metadataRows}
        </tbody>
      </table>
    </div>
  `;

  const textLines: string[] = [
    `${options.displayName} の新しい送信`,
    `送信時刻: ${payload.submittedAt}`,
    "",
  ];

  entries.forEach(({ label, value }) => {
    textLines.push(`${label}: ${value || "(未入力)"}`);
  });

  textLines.push("", `Referrer: ${payload.metadata.referrer ?? "(不明)"}`);
  textLines.push(`User Agent: ${payload.metadata.userAgent ?? "(不明)"}`);

  const replyToField = options.replyToField;
  let replyTo: string | undefined;

  if (replyToField) {
    const candidate = payload.fields[replyToField];
    const candidateValue = candidate ? coerceToString(candidate) : "";
    if (candidateValue && candidateValue.includes("@")) {
      replyTo = candidateValue;
    }
  }

  return {
    subject,
    html,
    text: textLines.join("\n"),
    replyTo,
  };
}

export async function processFormSubmission(
  request: NextRequest,
  options: FormSubmissionOptions,
) {
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
    console.error("Resend is not fully configured");
    return Response.json({ message: "Email delivery is not configured." }, { status: 500 });
  }

  if (!options.notificationEmail) {
    console.error(`${options.formKey} notification email is not configured`);
    return Response.json({ message: options.missingNotificationMessage }, { status: 500 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    console.error(`${options.formKey} payload parse error`, error);
    return Response.json({ message: "Invalid payload." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !("fields" in body)) {
    return Response.json({ message: "Invalid payload." }, { status: 400 });
  }

  const fieldsCandidate = (body as { fields?: unknown }).fields;

  if (!fieldsCandidate || typeof fieldsCandidate !== "object" || Array.isArray(fieldsCandidate)) {
    return Response.json({ message: "Invalid payload." }, { status: 400 });
  }

  const payload: FormSubmissionPayload = {
    submittedAt: new Date().toISOString(),
    fields: fieldsCandidate as FieldMap,
    metadata: {
      userAgent: request.headers.get("user-agent"),
      referrer: request.headers.get("referer"),
    },
  };

  const emailContent = buildEmailContent(payload, options);

  try {
    const client = getResendClient();

    if (!client) {
      console.error("Resend API key is missing at send time");
      return Response.json({ message: "Email delivery is not configured." }, { status: 500 });
    }

    const { data: primaryData, error: primaryError } = await client.emails.send({
      from: RESEND_FROM_EMAIL,
      to: options.notificationEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      ...(emailContent.replyTo ? { reply_to: emailContent.replyTo } : {}),
    });

    if (primaryError) {
      throw primaryError;
    }

    console.info(`[forms:${options.formKey}] email sent to ${options.notificationEmail}`, primaryData);

    const autoResponseConfig = options.autoResponse;

    if (autoResponseConfig) {
      const recipientRaw = payload.fields[autoResponseConfig.emailField];
      const recipientEmail = recipientRaw ? coerceToString(recipientRaw).trim() : "";

      if (recipientEmail.includes("@")) {
        const nameRaw = autoResponseConfig.nameField
          ? payload.fields[autoResponseConfig.nameField]
          : undefined;
        const recipientName = nameRaw ? coerceToString(nameRaw).trim() || null : null;
        const summaryEntries = buildFieldEntries(payload, options.fieldDefinitions);
        const summaryHtml = buildSummaryHtml(summaryEntries);
        const summaryText = buildSummaryText(summaryEntries);

        const context: MessageContext = {
          recipientName,
          summaryHtml,
          summaryText,
          displayName: options.displayName,
        };

        const autoSubject = resolveMessage(autoResponseConfig.subject, payload, context);
        const autoHtml = resolveMessage(autoResponseConfig.html, payload, context);
        const autoText = resolveMessage(autoResponseConfig.text, payload, context);

        const { data: autoData, error: autoError } = await client.emails.send({
          from: RESEND_FROM_EMAIL,
          to: recipientEmail,
          subject: autoSubject,
          html: autoHtml,
          text: autoText,
        });

        if (autoError) {
          throw autoError;
        }

        console.info(
          `[forms:${options.formKey}] auto-response sent to ${recipientEmail}`,
          autoData,
        );
      }
    }

    return Response.json({ message: options.successMessage });
  } catch (error) {
    console.error(`${options.formKey} email send failed`, error);
    return Response.json({ message: "Failed to send email." }, { status: 500 });
  }
}
