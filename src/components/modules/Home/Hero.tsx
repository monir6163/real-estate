"use client";
import { Button } from "@/components/ui/button";
import { DollarSign, Home } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative min-h-150 lg:min-h-140 flex items-center overflow-hidden">
      <img
        src={"/hero-city.jpg"}
        alt="Modern city skyline"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={800}
      />
      <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-black/30" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-primary-foreground text-sm font-medium px-4 py-1.5 rounded-full mb-6 animate-fade-up">
            <Home className="w-4 h-4" />
            #1 Real Estate Platform
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-primary-foreground leading-tight mb-4 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Find Your Perfect <br />
            <span className="text-gradient">Property</span>
          </h1>
          <p
            className="text-white/80 text-lg max-w-lg mb-8 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Browse thousands of listings across top locations. Buy, sell, or
            rent with confidence.
          </p>

          {/* Call-to-Action Section */}
          <div
            className="flex flex-col sm:flex-row gap-4 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              asChild
            >
              <Link href="/properties">
                <Home className="w-4 h-4 mr-2" />
                Browse Properties
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20  hover:bg-white/10 px-8"
              asChild
            >
              <Link href="/become-agent">
                <DollarSign className="w-4 h-4 mr-2" />
                Find an Agent
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div
            className="flex gap-8 mt-8 animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            {[
              { value: "12K+", label: "Properties" },
              { value: "8K+", label: "Happy Clients" },
              { value: "200+", label: "Agents" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-display font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
