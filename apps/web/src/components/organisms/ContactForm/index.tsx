"use client";

import { useState } from "react";
import { contactFields } from "@/app/_content/contact";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (formData: FormData) => {
    const newErrors: Record<string, string> = {};
    
    contactFields.forEach((field) => {
      const value = formData.get(field.key) as string;
      
      if (field.required) {
        if (!value || (typeof value === 'string' && !value.trim())) {
           newErrors[field.key] = "Please fill out this field.";
        }
      }

      if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors[field.key] = "Please enter a valid email address.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (!validate(formData)) {
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const data: Record<string, unknown> = {};
    const fields: Record<string, unknown> = {};

    contactFields.forEach((field) => {
       const value = formData.get(field.key);
       data[field.key] = value;
       fields[field.key] = value;
    });

    // Backwards compatibility for templates expecting specific top-level keys if any
    // data.name = formData.get("name");
    // data.email = formData.get("email");
    // data.message = formData.get("message");
    // data.subject = formData.get("category"); // Mapped from category
    data.fields = fields;


    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      setStatus("success");
      (event.target as HTMLFormElement).reset();
      setErrors({});
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to send message. Please try again later.");
    }
  }

  const getInputClassName = (fieldName: string) => {
    const baseClass = "w-full px-4 py-3 border bg-white dark:bg-black focus:outline-none focus:ring-2 transition-colors duration-200";
    const errorClass = "border-red-500 focus:ring-red-500 focus:border-red-500";
    const normalClass = "border-gray-300 dark:border-gray-700 focus:ring-primary dark:focus:ring-white";
    
    return `${baseClass} ${errors[fieldName] ? errorClass : normalClass}`;
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {status === "success" && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
          Message sent successfully! We&apos;ll get back to you soon.
        </div>
      )}
      {status === "error" && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          {errorMessage}
        </div>
      )}
      
      {contactFields.map((field) => (
        <div key={field.key}>
          <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          
          {field.type === "textarea" ? (
             <textarea
              id={field.key}
              name={field.key}
              rows={6}
              className={getInputClassName(field.key)}
              placeholder={field.label}
              disabled={status === "submitting"}
            />
          ) : field.type === "select" ? (
             <div className="relative">
              <select
                id={field.key}
                name={field.key}
                className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white transition-colors appearance-none cursor-pointer`}
                disabled={status === "submitting"}
                defaultValue=""
              >
                <option value="" disabled>Select an option</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          ) : field.type === "checkbox" ? (
             <div className="flex items-center space-x-3">
               <input
                 type="checkbox"
                 id={field.key}
                 name={field.key}
                 value={field.options?.[0] || "yes"}
                 className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                 disabled={status === "submitting"}
               />
                <label htmlFor={field.key} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {field.key === "agree" ? (
                    <>
                      I agree to the{" "}
                      <a
                        href="/legal#privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-primary transition-colors"
                      >
                        Privacy Policy
                      </a>
                    </>
                  ) : (
                    field.options?.[0]
                  )}
                </label>
             </div>
          ) : (
            <input
              type={field.type}
              id={field.key}
              name={field.key}
              className={getInputClassName(field.key)}
              placeholder={field.label}
              disabled={status === "submitting"}
            />
          )}

          {errors[field.key] && (
            <p className="mt-1 text-sm text-red-500">{errors[field.key]}</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-primary text-white dark:bg-white dark:text-primary py-4 px-8 text-sm uppercase tracking-[0.3em] hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
