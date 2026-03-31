import { Card } from "@/components/ui/card";
import { Award, Lock, Shield, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";

const WhyChooseUs = () => {
  const features = [
    {
      icon: Award,
      title: "Expert Agents",
      description:
        "Work with certified professionals with years of real estate experience",
    },
    {
      icon: Zap,
      title: "Fast Processing",
      description:
        "Quick property verification and streamlined transaction process",
    },
    {
      icon: Lock,
      title: "Secure Platform",
      description:
        "Bank-level encryption and secure payment processing for all deals",
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Dedicated customer service team available round the clock",
    },
    {
      icon: TrendingUp,
      title: "Best Prices",
      description:
        "Guaranteed competitive prices and transparent pricing with no hidden fees",
    },
    {
      icon: Shield,
      title: "Buyer Protection",
      description:
        "Full legal protection and escrow services for every transaction",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by thousands of property buyers and sellers. Here's what
            makes us different
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-lg p-8 border border-primary/20">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Ready to Find Your Dream Property?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of happy customers who have found their perfect
              home
            </p>
            <Link
              href="/properties"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Browse Properties Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
