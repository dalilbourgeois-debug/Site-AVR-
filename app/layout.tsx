import "./globals.css";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CompareBar from "@/components/CompareBar";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <CompareBar />
        <Footer />
      </body>
    </html>
  );
}
