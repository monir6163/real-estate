import { getAllReviews } from "@/actions/review";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

type TestimonialReview = {
  id: string;
  rating: number;
  comment: string;
  agent?: {
    name?: string;
  };
};

const Testimonials = async () => {
  const { data } = await getAllReviews();
  const testimonials: TestimonialReview[] = Array.isArray(data)
    ? (data.slice(0, 6) as TestimonialReview[])
    : [];

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
          {testimonials.length > 0 ? (
            testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="p-6 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-semibold">
                    {(testimonial.agent?.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">
                      {testimonial.agent?.name || "Anonymous User"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Verified Review
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {Array.from({
                    length: Math.min(Math.max(testimonial.rating || 0, 0), 5),
                  }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-muted-foreground italic">
                  "
                  {testimonial.comment ||
                    "Great experience with this property."}
                  "
                </p>
              </Card>
            ))
          ) : (
            <Card className="p-6 text-center md:col-span-2 lg:col-span-3 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <p className="text-muted-foreground">
                No reviews yet. Be the first to share your experience.
              </p>
            </Card>
          )}
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
