import { redirect } from "next/navigation";

// Redirection : l'espace favoris vit maintenant sous /compte/favoris
export default function Page() {
  redirect("/compte/favoris");
}
