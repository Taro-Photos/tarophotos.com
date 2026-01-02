"use client";

import { useState } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"), // Note: This maps to 'category' in current backend logic if needed, but 'subject' is fine
      message: formData.get("message"),
      // Backend expects 'fields' object
      fields: {
        name: formData.get("name"),
        email: formData.get("email"),
        category: formData.get("subject"), // Mapping UI 'subject' (category select) to backend 'category' field if configured
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

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");
      (event.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("Failed to send message. Please try again later.");
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
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
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white transition-colors"
          placeholder="Your Name"
          required
          disabled={status === "submitting"}
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white transition-colors"
          placeholder="your@email.com"
          required
          disabled={status === "submitting"}
        />
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white transition-colors appearance-none"
          disabled={status === "submitting"}
        >
          <option value="general">General Inquiry</option>
          <option value="booking">Booking / Commission</option>
          <option value="print">Print Sales</option>
          <option value="collaboration">Collaboration</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white transition-colors resize-none"
          placeholder="How can I help you?"
          required
          disabled={status === "submitting"}
        ></textarea>
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
