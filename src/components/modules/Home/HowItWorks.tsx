import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  DollarSign,
  FileText,
  Home,
  MapPin,
  Zap,
} from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: MapPin,
      title: "Browse Properties",
      description:
        "Explore thousands of listings with detailed information and photos",
    },
    {
      icon: FileText,
      title: "Compare & Research",
      description:
        "View property details, prices, reviews and neighborhood information",
    },
    {
      icon: DollarSign,
      title: "Get Best Price",
      description:
        "Negotiate with agents and secure the best deal for your budget",
    },
    {
      icon: CheckCircle2,
      title: "Schedule Tour",
      description:
        "Book property tours at your convenience with professional agents",
    },
    {
      icon: Home,
      title: "Make Offer",
      description:
        "Submit offers and negotiate directly through our secure platform",
    },
    {
      icon: Zap,
      title: "Finalize & Own",
      description: "Complete paperwork and move into your dream property today",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our simple and transparent process makes buying, selling, or renting
            properties easy and stress-free
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card
                key={index}
                className="p-8 hover:shadow-lg transition-shadow bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-primary">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
