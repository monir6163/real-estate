"use client";
import { Button } from "@/components/ui/button";
import { DollarSign, Home, MapPin, Search } from "lucide-react";
import { useState } from "react";

const HeroSection = () => {
  const [tab, setTab] = useState<"buy" | "rent">("buy");

  return (
    <section className="relative min-h-150 lg:min-h-175 flex items-center overflow-hidden">
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

          {/* Search Card */}
          <div
            className="bg-card rounded-2xl shadow-2xl p-1 max-w-xl animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            {/* Tabs */}
            <div className="flex gap-1 p-1">
              <button
                onClick={() => setTab("buy")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tab === "buy"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setTab("rent")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tab === "rent"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                Rent
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 bg-secondary rounded-xl px-4 py-3">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <input
                  type="text"
                  placeholder="Enter city, neighborhood, or ZIP"
                  className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 bg-secondary rounded-xl px-4 py-3">
                  <Home className="w-4 h-4 text-primary shrink-0" />
                  <select className="bg-transparent text-sm text-muted-foreground outline-none w-full">
                    <option>Property Type</option>
                    <option>Apartment</option>
                    <option>House</option>
                    <option>Villa</option>
                    <option>Commercial</option>
                    <option>Land</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 bg-secondary rounded-xl px-4 py-3">
                  <DollarSign className="w-4 h-4 text-primary shrink-0" />
                  <select className="bg-transparent text-sm text-muted-foreground outline-none w-full">
                    <option>Price Range</option>
                    <option>$0 - $500K</option>
                    <option>$500K - $1M</option>
                    <option>$1M - $5M</option>
                    <option>$5M+</option>
                  </select>
                </div>
              </div>
              <Button size="lg" className="w-full">
                <Search className="w-4 h-4" />
                Search Properties
              </Button>
            </div>
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
