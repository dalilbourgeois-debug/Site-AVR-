/**
 * Mini store pour ouvrir le modal d'auth depuis n'importe quel composant client.
 *
 * Usage :
 *   import { openAuthModal } from "@/lib/auth-modal";
 *   openAuthModal({ reason: "Pour ajouter aux favoris, créez un compte." });
 */

export type AuthModalState = {
  open: boolean;
  reason?: string;
  /** Chemin vers lequel rediriger après la connexion. Défaut : la page actuelle. */
  redirectTo?: string;
};

let state: AuthModalState = { open: false };
let listeners: Array<(s: AuthModalState) => void> = [];

function notify() {
  for (const l of listeners) l(state);
}

export function openAuthModal(opts?: { reason?: string; redirectTo?: string }) {
  state = { open: true, reason: opts?.reason, redirectTo: opts?.redirectTo };
  notify();
}

export function closeAuthModal() {
  state = { open: false };
  notify();
}

export function subscribeAuthModal(fn: (s: AuthModalState) => void) {
  listeners.push(fn);
  fn(state);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}
