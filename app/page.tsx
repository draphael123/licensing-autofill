import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import HowItWorks from "@/components/HowItWorks";
import LearnModeDemo from "@/components/LearnModeDemo";
import FieldSchema from "@/components/FieldSchema";
import Features from "@/components/Features";
import GettingStarted from "@/components/GettingStarted";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <LearnModeDemo />
      <FieldSchema />
      <Features />
      <GettingStarted />
      <FAQ />
      <Footer />
    </main>
  );
}

