import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  service: z.string().min(1),
  autreTexte: z.string().optional(),
  slot: z.object({ day: z.string(), time: z.string() }).nullable(),
  contact: z.object({
    nom: z.string().min(2),
    email: z.string().email(),
    telephone: z.string().min(6),
    immat: z.string().optional()
  })
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  if (!parsed.data.slot) return NextResponse.json({ error: "Créneau manquant" }, { status: 400 });

  // TODO :
  //  - Insérer le RDV en BDD (table rdv_atelier)
  //  - Pousser dans l'agenda atelier (Google Calendar / Cardiff)
  //  - Envoyer email de confirmation (Brevo/Resend)
  //  - Programmer un SMS de rappel J-1 (Brevo/Twilio/OVH)
  console.log("[rdv:atelier]", parsed.data);

  return NextResponse.json({ ok: true });
}
