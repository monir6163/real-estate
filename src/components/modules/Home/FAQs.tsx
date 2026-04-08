"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQs = () => {
  const faqs = [
    {
      id: "faq-1",
      question: "How do I search for properties?",
      answer:
        "You can search for properties using our advanced search filters. Use the budget slider on the hero section to set your price range, select property type, location, and amenities. You can also browse our curated listings directly from the home page.",
    },
    {
      id: "faq-2",
      question: "What is the process to buy a property?",
      answer:
        "Our process is simple: Browse & Filter properties, Compare options with our property details, Schedule a Tour with agents, Make an Offer through our platform, and Finalize the purchase with guidance from our team. We ensure transparency and security at every step.",
    },
    {
      id: "faq-3",
      question: "How can I list my property for sale?",
      answer:
        "Click on 'Find an Agent' to connect with our verified agents. They will help you list your property, set the right price, market it effectively, and manage inquiries from potential buyers. Our agents have extensive experience in the real estate market.",
    },
    {
      id: "faq-4",
      question: "Are the agent listings verified?",
      answer:
        "Yes, all agents on our platform are thoroughly verified and vetted. We maintain high standards to ensure you're working with qualified professionals. You can view agent ratings, reviews, and credentials before connecting with them.",
    },
    {
      id: "faq-5",
      question: "What are your commission rates?",
      answer:
        "Commission rates vary depending on the property type, location, and market conditions. Typically, commission is 2-5% of the sales price and is negotiable. Contact your agent for specific details about their rates.",
    },
    {
      id: "faq-6",
      question: "Can I rent instead of buy?",
      answer:
        "Absolutely! Our platform supports both buying and renting. You can filter properties by 'For Rent' in the search results. We have thousands of rental listings across various locations and price ranges.",
    },
    {
      id: "faq-7",
      question: "Is my personal information secure?",
      answer:
        "Your security is our priority. We use industry-standard encryption and security protocols to protect your personal and financial information. All transactions are secure and your data is never shared with third parties without consent.",
    },
    {
      id: "faq-8",
      question: "How do I schedule a property tour?",
      answer:
        "Once you find a property you're interested in, click 'Schedule Tour' on the listing. Select your preferred date and time, and the agent will confirm the appointment. Tours can be in-person or virtual based on your preference.",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 bg-white dark:bg-slate-950">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Help & Support
            </span>
          </div>
          <h2 className="text-4xl font-display font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about buying, selling, and renting
            properties on our platform
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="rounded-2xl border border-border bg-card px-6 py-4 hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary transition-colors py-0">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 pt-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-16 rounded-2xl border border-border bg-linear-to-br from-primary/10 to-primary/5 p-8 sm:p-10 text-center">
          <h3 className="text-2xl font-semibold text-foreground mb-3">
            Didn't find what you're looking for?
          </h3>
          <p className="text-foreground/70 mb-6">
            Our support team is here to help. Get in touch with us for any
            additional questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@realestate.com"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-primary/30 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Email Support
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border bg-card text-foreground font-medium hover:bg-secondary transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
