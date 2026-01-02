"use client";

import { useState } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (formData: FormData) => {
    const newErrors: Record<string, string> = {};
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name?.trim()) {
      newErrors.name = "Please fill out this field.";
    }

    if (!email?.trim()) {
      newErrors.email = "Please fill out this field.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!message?.trim()) {
      newErrors.message = "Please fill out this field.";
    }

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

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      fields: {
        name: formData.get("name"),
        email: formData.get("email"),
        category: formData.get("subject"),
        message: formData.get("message"),
      },
    };

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
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className={getInputClassName("name")}
          placeholder="Your Name"
          disabled={status === "submitting"}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className={getInputClassName("email")}
          placeholder="your@email.com"
          disabled={status === "submitting"}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
          Subject
        </label>
        <div className="relative">
          <select
            id="subject"
            name="subject"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white transition-colors appearance-none cursor-pointer"
            disabled={status === "submitting"}
          >
            <option value="general">General Inquiry</option>
            <option value="booking">Booking / Commission</option>
            <option value="print">Print Sales</option>
            <option value="collaboration">Collaboration</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          className={getInputClassName("message")}
          placeholder="How can I help you?"
          disabled={status === "submitting"}
        ></textarea>
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message}</p>
        )}
      </div>
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
