import Link from "next/link";
import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";
import VehiculeCard from "@/components/VehiculeCard";
import Reveal from "@/components/Reveal";
import ShareButton from "@/components/ShareButton";
import { getSimilaires, getVehiculeBySlug, vehicules } from "@/lib/data";
import { formatDate, formatEur, formatKm } from "@/lib/format";
import type { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const v = getVehiculeBySlug(slug);
  if (!v) return {};
  return {
    title: `${v.marque} ${v.modele} ${v.version}`,
    description: `${v.marque} ${v.modele} ${v.version} — ${formatEur(v.prixTtc)}, ${formatKm(v.kilometrage)}, ${v.annee}, ${v.energie}.`
  };
}

export function generateStaticParams() {
  return vehicules.map((v) => ({ slug: v.slug }));
}

export default async function VehiculeDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = getVehiculeBySlug(slug);
  if (!v) notFound();
  const similaires = getSimilaires(v);

  return (
    <>
      {/* Fil d'Ariane */}
      <div className="container-x py-6">
        <nav className="text-xs tracking-widest uppercase text-gray-500">
          <Link href="/vehicules" className="hover:text-brand-accent">Nos véhicules</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-700">{v.marque} {v.modele}</span>
        </nav>
      </div>

      <div className="container-x pb-32 lg:pb-16">
        {/* En-tête principal : galerie + identité */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10">
          <Reveal variant="left">
            <Gallery photos={v.photos} alt={`${v.marque} ${v.modele}`} />
          </Reveal>

          <Reveal variant="right">
            <div>
              <div className="text-[10px] tracking-[0.4em] uppercase text-brand-accent">
                {v.marque}
              </div>
              <h1 className="mt-2 text-4xl md:text-5xl font-serif text-brand leading-tight">
                {v.modele}
              </h1>
              <div className="mt-1 text-gray-600">{v.version}</div>

              <div className="mt-6 flex flex-wrap gap-x-3 gap-y-2 text-xs tracking-widest uppercase text-gray-600">
                <Chip>{v.annee}</Chip>
                <Chip>{formatKm(v.kilometrage)}{v.kmGaranti ? " ✓" : ""}</Chip>
                <Chip>{v.energie}</Chip>
                <Chip>{v.boite}</Chip>
                {v.critAir && <Chip>Crit'Air {v.critAir}</Chip>}
                {v.premiereMain && <Chip>1ʳᵉ main</Chip>}
              </div>

              <div className="mt-8 p-6 bg-brand text-white">
                <div className="text-[10px] tracking-[0.4em] uppercase text-brand-accent">Prix TTC</div>
                <div className="text-4xl md:text-5xl font-serif font-bold mt-1">{formatEur(v.prixTtc)}</div>
                <div className="text-xs text-white/60 mt-2">
                  Hors carte grise et frais de mise en service.
                </div>
                {v.garantieLibelle && (
                  <div className="mt-4 pt-4 border-t border-white/10 text-sm text-white/90 flex items-start gap-2">
                    <span className="text-brand-accent shrink-0">✓</span>
                    <span>{v.garantieLibelle}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 hidden lg:grid grid-cols-1 gap-2">
                <CtaButtons slug={v.slug} statut={v.statut} />
              </div>

              {/* Partage */}
              <div className="mt-6 hidden lg:flex items-center justify-between border-t border-gray-100 pt-6">
                <div className="text-xs tracking-widest uppercase text-gray-500">
                  Cette voiture vous plait ?
                </div>
                <ShareButton
                  title={`${v.marque} ${v.modele} ${v.version}`}
                  text={`${formatEur(v.prixTtc)} · ${formatKm(v.kilometrage)} · ${v.annee} · ${v.energie}`}
                />
              </div>

              {/* Partage version mobile : sous le prix */}
              <div className="mt-4 lg:hidden flex justify-center">
                <ShareButton
                  title={`${v.marque} ${v.modele} ${v.version}`}
                  text={`${formatEur(v.prixTtc)} · ${formatKm(v.kilometrage)} · ${v.annee} · ${v.energie}`}
                />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Description libre */}
        {v.commentairePublic && (
          <section className="mt-16">
            <Reveal>
              <div className="max-w-3xl mx-auto text-center">
                <div className="text-[10px] tracking-[0.4em] uppercase text-brand-accent">Description</div>
                <h2 className="mt-2 text-2xl md:text-3xl font-serif text-brand">À propos de ce véhicule</h2>
                <p className="mt-6 text-gray-700 whitespace-pre-line leading-relaxed">
                  {v.commentairePublic}
                </p>
              </div>
            </Reveal>
          </section>
        )}

        {/* Caractéristiques */}
        <section className="mt-16">
          <Reveal>
            <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
              <div>
                <div className="text-[10px] tracking-[0.4em] uppercase text-brand-accent">Spécifications</div>
                <h2 className="mt-2 text-2xl md:text-3xl font-serif text-brand">Caractéristiques techniques</h2>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bg-white border border-gray-100">
              <Row label="VIN" value={v.vin} />
              <Row label="1ʳᵉ mise en circulation" value={formatDate(v.dateMec)} />
              <Row label="Kilométrage" value={`${formatKm(v.kilometrage)}${v.kmGaranti ? " (garanti)" : ""}`} />
              <Row label="Énergie" value={v.energie} />
              <Row label="Boîte de vitesses" value={v.boite} />
              <Row label="Puissance fiscale" value={v.puissanceFisc ? `${v.puissanceFisc} CV` : "—"} />
              <Row label="Puissance réelle" value={v.puissanceReel ? `${v.puissanceReel} ch` : "—"} />
              <Row label="CO₂" value={v.co2 != null ? `${v.co2} g/km` : "—"} />
              <Row label="Crit'Air" value={v.critAir ?? "—"} />
              <Row label="Couleur extérieure" value={v.couleurExt ?? "—"} />
              <Row label="Couleur intérieure" value={v.couleurInt ?? "—"} />
              <Row label="Portes / Places" value={`${v.nbPortes ?? "—"} / ${v.nbPlaces ?? "—"}`} />
              <Row label="Garantie" value={v.garantieDuree ?? "—"} />
              {v.energie === "Électrique" && (
                <>
                  <Row label="État de santé batterie" value={v.soh ? `${v.soh}%` : "—"} />
                  <Row label="Autonomie" value={v.autonomie ? `${v.autonomie} km` : "—"} />
                  <Row label="Capacité batterie" value={v.capaciteBat ? `${v.capaciteBat} kWh` : "—"} />
                  <Row label="Temps de recharge" value={v.tempsRecharge ?? "—"} />
                </>
              )}
            </div>
          </Reveal>
        </section>

        {/* Équipements */}
        <section className="mt-16">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-8">
              <div className="text-[10px] tracking-[0.4em] uppercase text-brand-accent">Équipements</div>
              <h2 className="mt-2 text-2xl md:text-3xl font-serif text-brand">Ce que comprend ce véhicule</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal delay={0}><EquipList title="Série" items={v.equipSerie} /></Reveal>
            <Reveal delay={120}><EquipList title="Option" items={v.equipOption} /></Reveal>
            <Reveal delay={240}><EquipList title="Personnalisé" items={v.equipPerso} /></Reveal>
          </div>
        </section>

        {/* Véhicules similaires */}
        {similaires.length > 0 && (
          <section className="mt-20">
            <Reveal>
              <div className="text-center mb-8">
                <div className="text-[10px] tracking-[0.4em] uppercase text-brand-accent">À découvrir</div>
                <h2 className="mt-2 text-2xl md:text-3xl font-serif text-brand">Véhicules similaires</h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similaires.map((s, i) => (
                <Reveal key={s.id} delay={i * 100}><VehiculeCard v={s} /></Reveal>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* CTA flottants mobile */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-brand-dark text-white border-t border-brand-accent/40 z-30 p-3 grid grid-cols-3 gap-2">
        <CtaButtons slug={v.slug} statut={v.statut} compact />
      </div>
    </>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-sm">
      {children}
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-2 gap-4 px-5 py-3.5 border-b border-gray-100 last:border-0 even:bg-gray-50 text-sm">
      <div className="text-xs tracking-widest uppercase text-gray-500">{label}</div>
      <div className="font-medium text-brand">{value}</div>
    </div>
  );
}

function EquipList({ title, items }: { title: string; items?: string[] }) {
  return (
    <div className="bg-white border border-gray-100 p-6 h-full">
      <div className="text-[10px] tracking-[0.4em] uppercase text-brand-accent mb-3">{title}</div>
      {!items || items.length === 0 ? (
        <div className="text-xs text-gray-400">—</div>
      ) : (
        <ul className="text-sm text-gray-700 space-y-2">
          {items.map((it) => (
            <li key={it} className="flex gap-2">
              <span className="text-brand-accent shrink-0">✓</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CtaButtons({ slug, statut, compact }: { slug: string; statut: string; compact?: boolean }) {
  const dispo = statut === "disponible";
  return (
    <>
      <Link
        href={dispo ? `/vehicules/${slug}/reserver` : "#"}
        className={`inline-flex items-center justify-center text-center bg-brand-accent text-white tracking-[0.2em] uppercase hover:brightness-110 transition ${
          compact ? "text-[10px] px-2 py-2.5" : "px-6 py-3.5 text-sm"
        } ${!dispo ? "opacity-50 pointer-events-none" : ""}`}
      >
        {compact ? "Réserver" : "Réserver (acompte 5%)"}
      </Link>
      <Link
        href={`/vehicules/${slug}/essayer`}
        className={`inline-flex items-center justify-center text-center border border-brand text-brand tracking-[0.2em] uppercase hover:bg-brand hover:text-white transition ${
          compact ? "text-[10px] px-2 py-2.5 border-white text-white hover:bg-white hover:text-brand" : "px-6 py-3.5 text-sm"
        }`}
      >
        Essayer
      </Link>
      <Link
        href={`/vehicules/${slug}/reprise`}
        className={`inline-flex items-center justify-center text-center border border-brand text-brand tracking-[0.2em] uppercase hover:bg-brand hover:text-white transition ${
          compact ? "text-[10px] px-2 py-2.5 border-white text-white hover:bg-white hover:text-brand" : "px-6 py-3.5 text-sm"
        }`}
      >
        Reprise
      </Link>
    </>
  );
}
