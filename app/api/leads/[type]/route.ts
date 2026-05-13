import { NextResponse } from "next/server";

// Endpoint générique pour tous les leads (essai, reprise, vente, contact, etc.).
// Accepte JSON ou multipart/form-data (quand le formulaire a des pièces jointes).
// À brancher : envoi d'email (Brevo/Resend) + insertion en BDD + stockage des fichiers (S3/R2 ou disque local).

// Désactive la limite par défaut pour autoriser jusqu'à ~50 Mo de pièces jointes.
export const maxDuration = 30; // secondes

export async function POST(
  req: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const contentType = req.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("multipart/form-data")) {
      const fd = await req.formData();

      // Sépare champs texte et fichiers
      const texte: Record<string, string> = {};
      const fichiers: { name: string; field: string; size: number; mime: string }[] = [];

      for (const [k, v] of fd.entries()) {
        if (typeof v === "string") {
          texte[k] = v;
        } else if (v instanceof File && v.size > 0) {
          // TODO : uploader v dans S3/R2/disque puis stocker l'URL en BDD
          fichiers.push({ name: v.name, field: k, size: v.size, mime: v.type });
        }
      }

      console.log(`[lead:${type}] (multipart)`, { texte, fichiers });
      return NextResponse.json({ ok: true, type, fichiers: fichiers.length });
    }

    // Fallback : JSON
    const body = await req.json().catch(() => ({}));
    console.log(`[lead:${type}] (json)`, body);
    return NextResponse.json({ ok: true, type });
  } catch (err) {
    console.error(`[lead:${type}] erreur :`, err);
    return NextResponse.json({ error: "Réception échouée" }, { status: 500 });
  }
}
