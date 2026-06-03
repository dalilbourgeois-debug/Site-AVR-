import "./globals.css";
import type { Metadata, Viewport } from "next";
import Nav from "@/components/Nav";
import SectionNav from "@/components/SectionNav";
import Footer from "@/components/Footer";
import CompareBar from "@/components/CompareBar";
import Toaster from "@/components/Toaster";
import CallButton from "@/components/CallButton";
import SignInModal from "@/components/SignInModal";

export const metadata: Metadata = {
  title: { default: "AVR Automobile — Garage et véhicules d'occasion à Couëron", template: "%s · AVR Automobile" },
  description:
    "AVR Automobile : véhicules d'occasion, atelier mécanique, carrosserie et contrôle technique à Couëron (44). Réservation en ligne, prise de RDV, reprise.",
  openGraph: {
    title: "AVR Automobile",
    description: "Vente et atelier multimarque à Couëron",
    type: "website",
    locale: "fr_FR"
  }
};

// Viewport mobile : fige la largeur sur la largeur du device,
// empêche le zoom intempestif au focus des champs (iOS)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <Nav />
        <SectionNav />
        <main className="flex-1">{children}</main>
        <CompareBar />
        <CallButton />
        <SignInModal />
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
