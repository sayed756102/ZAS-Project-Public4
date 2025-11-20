import { Globe, Sparkles, Languages, HelpCircle } from "lucide-react";
import heroImage from "@/assets/hero-translation.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Hero = () => {
  const { language } = useLanguage();
  const t = translations.hero[language];
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const scrollToForm = () => {
    const formElement = document.getElementById('translation-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-hero py-20 px-4">
      <div className="absolute inset-0 opacity-10">
        <img src={heroImage} alt="" className="w-full h-full object-cover" />
      </div>
      
      <div className="relative max-w-6xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
          <Sparkles className="w-5 h-5 text-white" />
          <span className="text-white font-medium">{t.badge}</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          {t.title}
          <br />
          <span className="text-4xl md:text-5xl">{t.subtitle}</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
          {t.description}
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-6">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <Globe className="w-5 h-5 text-white" />
            <span className="text-white font-medium">{t.languages}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <Languages className="w-5 h-5 text-white" />
            <span className="text-white font-medium">{t.aiPowered}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-white font-medium">{t.instant}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-8">
          <Button 
            size="lg"
            variant="hero"
            className="text-lg px-8 py-6"
            onClick={scrollToForm}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {translations.form[language].startNow}
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 bg-white/10 text-white border-white/30 hover:bg-white/20"
            onClick={() => setShowHowItWorks(true)}
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            {translations.nav[language].howItWorks}
          </Button>
          <Link to="/features">
            <Button 
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-white/10 text-white border-white/30 hover:bg-white/20"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {translations.nav[language].features}
            </Button>
          </Link>
        </div>

        <Dialog open={showHowItWorks} onOpenChange={setShowHowItWorks}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{translations.howItWorks[language].title}</DialogTitle>
              <DialogDescription className="text-base leading-relaxed pt-4 space-y-4">
                <div className="space-y-4">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <h4 className="font-bold text-lg mb-2">{translations.howItWorks[language].step1}</h4>
                    <p>{translations.howItWorks[language].step1Details}</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <h4 className="font-bold text-lg mb-2">{translations.howItWorks[language].step2}</h4>
                    <p>{translations.howItWorks[language].step2Details}</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <h4 className="font-bold text-lg mb-2">{translations.howItWorks[language].step3}</h4>
                    <p>{translations.howItWorks[language].step3Details}</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <h4 className="font-bold text-lg mb-2">{translations.howItWorks[language].step4}</h4>
                    <p>{translations.howItWorks[language].step4Details}</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <h4 className="font-bold text-lg mb-2">{translations.howItWorks[language].step5}</h4>
                    <p>{translations.howItWorks[language].step5Details}</p>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};
