export default function ContactForm() {
  return (
    <form className="space-y-6">
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
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full bg-primary text-white dark:bg-white dark:text-primary py-4 px-8 text-sm uppercase tracking-[0.3em] hover:opacity-90 transition-opacity duration-300"
      >
        Send Message
      </button>
    </form>
  );
}
