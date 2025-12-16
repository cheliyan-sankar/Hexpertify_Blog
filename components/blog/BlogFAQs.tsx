'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQ {
  question: string;
  answer: string;
}

interface BlogFAQsProps {
  faqs: FAQ[];
}

export default function BlogFAQs({ faqs }: BlogFAQsProps) {
  return (
    <div className="bg-purple-50 rounded-lg p-8 mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">FAQs</h2>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-gray-900 font-medium hover:text-purple-600">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
