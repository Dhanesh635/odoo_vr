import Hero from "@/components/marketing/Hero";
import Metrics from "@/components/marketing/Metrics";
import Features from "@/components/marketing/Features";
import DashboardPreview from "@/components/marketing/DashboardPreview";
import HowItWorks from "@/components/marketing/HowItWorks";
import Benefits from "@/components/marketing/Benefits";
import Testimonials from "@/components/marketing/Testimonials";
import FAQ from "@/components/marketing/FAQ";
import CTA from "@/components/marketing/CTA";
import Footer from "@/components/marketing/Footer";

export const metadata = {
  title: "TransitOps | Smarter Fleet Management",
  description:
    "Manage vehicles, drivers, dispatch, maintenance and operational analytics from one intelligent, unified platform.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30">
      <Hero />
      <Metrics />
      <Features />
      <DashboardPreview />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
