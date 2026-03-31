import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Home Buyer",
      image: "👩‍💼",
      rating: 5,
      text: "Found my dream home in just 2 weeks! The agents were incredibly helpful and made the entire process smooth and stress-free.",
    },
    {
      name: "Michael Chen",
      role: "Property Seller",
      image: "👨‍💼",
      rating: 5,
      text: "Sold my apartment at a great price. The platform's transparency and professional service exceeded my expectations completely.",
    },
    {
      name: "Emma Williams",
      role: "First-time Buyer",
      image: "👩‍🦱",
      rating: 5,
      text: "As a first-time buyer, I was nervous. The team guided me through every step and I couldn't be happier with my new home!",
    },
    {
      name: "David Martinez",
      role: "Property Investor",
      image: "👨‍💻",
      rating: 5,
      text: "Investment properties made easy. Great market insights and professional support throughout the entire transaction.",
    },
    {
      name: "Lisa Anderson",
      role: "Rental Property Owner",
      image: "👩‍🎓",
      rating: 5,
      text: "The most reliable platform for managing rental properties. Excellent tenant screening and efficient management tools.",
    },
    {
      name: "James Wilson",
      role: "Commercial Buyer",
      image: "👨‍💼",
      rating: 5,
      text: "Outstanding service for commercial properties. The team understood my specific needs and delivered exactly what I was looking for.",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thousands of satisfied customers have found their perfect property
            through our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-6 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{testimonial.image}</div>
                <div>
                  <h4 className="font-bold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-muted-foreground italic">
                "{testimonial.text}"
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/20 dark:to-primary/10 rounded-lg p-12 border border-primary/20">
            <h3 className="text-3xl font-bold text-foreground mb-2">
              Join Thousands of Happy Customers
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start your property journey today and find the perfect home or
              investment
            </p>
            <button className="bg-primary text-primary-foreground px-10 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-lg">
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
