"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Globe,
  Heart,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { number: "12K+", label: "Properties Listed" },
    { number: "8K+", label: "Happy Clients" },
    { number: "200+", label: "Expert Agents" },
    { number: "50+", label: "Cities Covered" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Client First",
      description:
        "We prioritize our clients' needs and work tirelessly to find them the perfect property.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We maintain the highest standards of professionalism and expertise in real estate.",
    },
    {
      icon: Globe,
      title: "Innovation",
      description:
        "We leverage cutting-edge technology to make property search and transactions seamless.",
    },
    {
      icon: Zap,
      title: "Transparency",
      description:
        "We believe in clear communication and honest dealings with all our stakeholders.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      bio: "With 20+ years in real estate, Sarah founded RealEstate to revolutionize how people buy and sell properties.",
      image: "👩‍💼",
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      bio: "Michael leads our tech innovation, building scalable solutions that simplify real estate transactions.",
      image: "👨‍💻",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Agent Relations",
      bio: "Emily ensures our agent network remains the best in the business with continuous support and training.",
      image: "👩‍🤝‍👨",
    },
    {
      name: "David Williams",
      role: "Chief Marketing Officer",
      bio: "David drives our mission to make real estate accessible and transparent for everyone.",
      image: "👨‍💼",
    },
  ];

  const timeline = [
    {
      year: "2018",
      event: "RealEstate founded with a vision to transform real estate",
    },
    {
      year: "2019",
      event: "Launched mobile app and reached 1,000+ properties",
    },
    {
      year: "2020",
      event: "Expanded to 10 cities and partnered with 50+ agents",
    },
    {
      year: "2022",
      event: "Hit 50,000+ transactions and became market leader",
    },
    {
      year: "2024",
      event: "Reached 12,000+ properties and expanded to 50 cities",
    },
    { year: "2026", event: "Launched AI-powered property recommendations" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 bg-linear-to-r from-primary/10 via-transparent to-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Our Story
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
              About RealEstate
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              We're on a mission to make real estate transactions faster,
              easier, and more transparent for everyone. Join thousands of
              satisfied clients who've found their perfect property with us.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl sm:text-5xl font-display font-bold text-primary mb-2">
                  {stat.number}
                </p>
                <p className="text-foreground/80 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-6">
                Our Mission & Vision
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Mission
                  </h3>
                  <p className="text-foreground/80">
                    To revolutionize real estate by providing transparent,
                    efficient, and customer-centric solutions that empower
                    people to make informed decisions about properties.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Vision
                  </h3>
                  <p className="text-foreground/80">
                    To become the most trusted real estate platform globally,
                    where buying, selling, and renting properties is
                    frictionless, transparent, and accessible to everyone.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                "Expert Agents",
                "Transparent Pricing",
                "Fast Transactions",
                "24/7 Support",
                "Verified Listings",
                "Secure Payments",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do and help us serve our
              clients with integrity and excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className="p-8 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-foreground/80">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Leadership Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the talented people behind RealEstate who are dedicated to
              transforming the real estate industry.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-8 text-center">
                  <div className="text-6xl mb-4">{member.image}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-foreground/80">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From a small startup to an industry leader, here's how we've grown
              and evolved.
            </p>
          </div>

          <div className="relative">
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    {index !== timeline.length - 1 && (
                      <div className="w-1 h-12 bg-primary/20 mt-2" />
                    )}
                  </div>
                  <div className="pt-2 pb-8">
                    <p className="text-sm font-semibold text-primary mb-1">
                      {item.year}
                    </p>
                    <p className="text-foreground/80">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-linear-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-6">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied clients who've found their dream
            property with RealEstate. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90"
              asChild
            >
              <Link href="/properties">
                Browse Properties
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
