import { NextResponse } from "next/server";
import { z } from "zod";
import { getVehiculeBySlug } from "@/lib/data";

const schema = z.object({
  slug: z.string().min(1),
  nom: z.string().min(2),
  email: z.string().email(),
  telephone: z.string().min(6),
  adresse: z.string().optional()
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }
  const { slug, nom, email, telephone, adresse } = parsed.data;

  const v = getVehiculeBySlug(slug);
  if (!v) return NextResponse.json({ error: "Véhicule introuvable" }, { status: 404 });
  if (v.statut !== "disponible") {
    return NextResponse.json({ error: "Véhicule non disponible" }, { status: 409 });
  }

  const acompte = Math.round(v.prixTtc * 0.05 * 100); // centimes
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  // Si Stripe pas encore configuré, on renvoie une URL factice de confirmation pour pouvoir tester l'UX.
  if (!stripeKey) {
    return NextResponse.json({
      url: `/vehicules/${slug}/reserver/confirmation?demo=1&nom=${encodeURIComponent(nom)}&email=${encodeURIComponent(email)}`
    });
  }

  // Sinon, on crée une session Stripe Checkout.
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(stripeKey);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: acompte,
          product_data: {
            name: `Acompte 5% — ${v.marque} ${v.modele} ${v.version}`,
            description: `VIN ${v.vin}`
          }
        },
        quantity: 1
      }
    ],
    metadata: {
      vin: v.vin,
      slug: v.slug,
      nom,
      telephone,
      adresse: adresse ?? ""
    },
    success_url: `${siteUrl}/vehicules/${slug}/reserver/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/vehicules/${slug}/reserver`
  });

  return NextResponse.json({ url: session.url });
}
