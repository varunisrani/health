
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import MentorSpotlightSection from "@/components/MentorSpotlightSection";
import ConsultantLibrarySection from "@/components/ConsultantLibrarySection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import FooterSection from "@/components/FooterSection";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { showAuthModal, setShowAuthModal } = useAuth();

  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <MentorSpotlightSection />
      <ConsultantLibrarySection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <FooterSection />
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
};

export default Index;
