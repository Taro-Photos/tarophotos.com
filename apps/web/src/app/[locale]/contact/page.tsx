import { profile } from "@/app/_content/about";
import ContactForm from "@/components/organisms/ContactForm";

export default function ContactPage() {
  return (
    <div className="w-full py-24 px-6 sm:px-10 md:px-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-wider leading-tight mb-6 text-primary dark:text-white">
            Contact
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
            For inquiries regarding photography services, collaborations, or print sales, please use the form below or contact me directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold uppercase tracking-widest mb-4 text-primary dark:text-white">
                Email
              </h3>
              <a href={`mailto:${profile.email}`} className="text-lg text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors">
                {profile.email}
              </a>
            </div>
            <div>
              <h3 className="text-xl font-bold uppercase tracking-widest mb-4 text-primary dark:text-white">
                Socials
              </h3>
              <ul className="space-y-2">
                {profile.socials.map((social) => (
                  <li key={social.platform}>
                    <a 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-lg text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors"
                    >
                      {social.platform}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold uppercase tracking-widest mb-4 text-primary dark:text-white">
                Location
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {profile.location}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
