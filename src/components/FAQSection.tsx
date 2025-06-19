
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I choose the right mentor for my needs?",
    answer: "Our matching system considers your goals, preferred practices, and personality. You can browse mentor profiles, read reviews, and even have a brief intro call before committing to sessions."
  },
  {
    question: "What if I'm new to wellness practices?",
    answer: "Perfect! Many of our mentors specialize in working with beginners. We have specially designed starter programs and our mentors will guide you step-by-step at your own pace."
  },
  {
    question: "Can I change mentors if needed?",
    answer: "Absolutely. Your healing journey is unique, and sometimes you need a different approach. You can switch mentors anytime without any additional fees."
  },
  {
    question: "Are the sessions live or pre-recorded?",
    answer: "We offer both! Access thousands of pre-recorded sessions anytime, plus book live 1-on-1 sessions with your mentor. Premium members get unlimited access to both."
  },
  {
    question: "How does the free trial work?",
    answer: "Your 14-day free trial gives you full access to explore mentors, join sessions, and use our wellness library. No credit card required to start, and you can cancel anytime."
  },
  {
    question: "Is my personal information kept confidential?",
    answer: "Yes, absolutely. We follow strict privacy protocols and never share your personal information. All conversations with mentors are confidential and secure."
  },
  {
    question: "What happens if I need immediate crisis support?",
    answer: "HealConnect is designed for ongoing wellness support and is not a replacement for emergency mental health services. If you're experiencing a crisis, please contact emergency services or a crisis hotline immediately."
  }
];

const FAQSection = () => {
  return (
    <section className="py-20 px-6 bg-hc-surface">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16 slide-up">
          <h2 className="text-4xl lg:text-5xl font-inter font-semibold text-gray-900 mb-6">
            Frequently Asked <span className="hc-primary">Questions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about starting your healing journey with HealConnect.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-gray-100 rounded-xl px-6 hover:shadow-md transition-all duration-200"
              >
                <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Important Disclaimer */}
        <div className="mt-12 bg-red-50 border-l-4 border-red-400 rounded-r-xl p-6 fade-in">
          <div className="flex items-start space-x-3">
            <div className="text-red-400 text-xl">⚠️</div>
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Important Medical Disclaimer</h3>
              <p className="text-red-700 leading-relaxed">
                HealConnect provides wellness support and is <strong>not a replacement for professional medical or mental health therapy</strong>. 
                If you're experiencing a mental health crisis, please contact emergency services immediately or reach out to:
              </p>
              <div className="mt-3 space-y-1 text-sm">
                <div>• National Suicide Prevention Lifeline: 988</div>
                <div>• Crisis Text Line: Text HOME to 741741</div>
                <div>• Emergency Services: 911</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
