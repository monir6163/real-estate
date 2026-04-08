import FAQs from "@/components/modules/Home/FAQs";
import FeaturedListings from "@/components/modules/Home/FeaturedListings";
import HeroSection from "@/components/modules/Home/Hero";
import HowItWorks from "@/components/modules/Home/HowItWorks";
import PropertyTypeCards from "@/components/modules/Home/PropertyTypeCards";
import Testimonials from "@/components/modules/Home/Testimonials";
import WhyChooseUs from "@/components/modules/Home/WhyChooseUs";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <>
      <HeroSection />
      <PropertyTypeCards />
      <FeaturedListings />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <FAQs />
    </>
  );
}
