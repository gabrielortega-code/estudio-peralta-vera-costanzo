import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HeroFaqStrip from "@/components/HeroFaqStrip";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HeroFaqStrip />
        <Services />
        <WhyUs />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
