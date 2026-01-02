import { visibleServicePlans, processSteps, faqs } from "@/app/_content/services";

export default function ServicesPage() {
  return (
    <div className="py-16 sm:py-24 px-6 sm:px-10 md:px-20 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-wider leading-tight mb-6">
          Services
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
          Professional photography services tailored to your needs.
        </p>
      </div>

      {/* Service Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        {visibleServicePlans.map((plan) => (
          <div key={plan.slug} className="border border-gray-200 dark:border-gray-800 p-8 flex flex-col h-full hover:border-primary dark:hover:border-white transition-colors duration-300">
            <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{plan.summary}</p>
            <div className="text-xl font-medium mb-6 text-primary dark:text-white">{plan.price}</div>
            
            <ul className="space-y-3 mb-8 flex-grow">
              {plan.deliverables.map((item, i) => (
                <li key={i} className="flex items-start text-sm">
                  <span className="mr-2 text-primary dark:text-white">•</span>
                  <span className="text-gray-600 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
            
            {plan.notes && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                {plan.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Process */}
      <div className="mb-24">
        <h2 className="text-3xl font-light uppercase tracking-wider text-center mb-12">Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                {index + 1}
              </div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{step.description}</p>
              <p className="text-xs font-medium text-primary dark:text-white">{step.duration}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-light uppercase tracking-wider text-center mb-12">FAQ</h2>
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-800 pb-8">
              <h3 className="text-lg font-bold mb-3">{faq.question}</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
