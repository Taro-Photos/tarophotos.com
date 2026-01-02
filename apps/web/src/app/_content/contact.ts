import contactFormFields from "../../../docs/forms/contact_form_fields.json";

export type FormField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox" | "date" | "number" | "url" | "email";
  required?: boolean;
  options?: string[];
};

export type ContactField = FormField;

export const contactFields = contactFormFields as ContactField[];

export const primaryContactEmail = process.env.NEXT_PUBLIC_PRIMARY_CONTACT_EMAIL || "";
