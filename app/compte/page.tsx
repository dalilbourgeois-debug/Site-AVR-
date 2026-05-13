import Link from "next/link";

export const metadata = { title: "Mon compte" };

export default function ComptePage() {
  return (
    <div className="container-x py-16 max-w-md">
      <div className="text-xs tracking-[0.4em] text-brand-accent uppercase text-center">Espace client</div>
      <h1 className="mt-3 text-3xl font-serif text-brand text-center">Créer un compte</h1>
      <p className="mt-3 text-center text-gray-600 text-sm">
        Suivez vos demandes, retrouvez vos favoris, gérez vos rendez-vous atelier.
      </p>

      <form className="mt-8 card p-6 space-y-4">
        <div>
          <label className="label">Prénom</label>
          <input className="input" />
        </div>
        <div>
          <label className="label">Nom</label>
          <input className="input" />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" />
        </div>
        <div>
          <label className="label">Mot de passe</label>
          <input type="password" className="input" />
        </div>
        <button
          type="button"
          className="w-full inline-flex items-center justify-center px-8 py-3 bg-brand text-white text-sm tracking-[0.2em] uppercase hover:bg-brand-light transition"
          disabled
          title="Authentification à brancher (NextAuth ou Clerk)"
        >
          Créer mon compte
        </button>
        <p className="text-xs text-gray-500 text-center">
          Déjà inscrit ? <Link href="/compte/connexion" className="text-brand underline">Se connecter</Link>
        </p>
      </form>

      <p className="mt-6 text-xs text-amber-700 bg-amber-50 p-3 rounded text-center">
        Espace client à activer (authentification NextAuth / Clerk à brancher).
      </p>
    </div>
  );
}
