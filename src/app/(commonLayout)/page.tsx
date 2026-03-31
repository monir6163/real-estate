import FeaturedListings from "@/components/modules/Home/FeaturedListings";
import HeroSection from "@/components/modules/Home/Hero";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedListings />
    </>
  );
}
