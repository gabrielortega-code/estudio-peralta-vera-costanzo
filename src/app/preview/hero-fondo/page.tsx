import type { Metadata } from "next";
import Header from "@/components/Header";
import HeroBackdrop from "@/components/HeroBackdrop";
import HeroFaqStrip from "@/components/HeroFaqStrip";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

/**
 * Ruta temporal: misma home pero con la variante B del Hero (foto de fondo),
 * para que el cliente compare contra la variante A publicada en `/`.
 * Se elimina junto con el componente descartado una vez tomada la decisión.
 */
export const metadata: Metadata = {
  title: "Vista previa — Hero con foto de fondo",
  robots: { index: false, follow: false },
};

export default function PreviewHeroFondo() {
  return (
    <>
      <Header />
      <main>
        <HeroBackdrop />
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
