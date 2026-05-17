// Mini store de notifications "toast", sans librairie externe.
// On déclenche depuis n'importe quel composant client avec :
//   import { showToast } from "@/lib/toast";
//   showToast("Texte de la notif");

export type ToastKind = "success" | "info" | "error";
export type Toast = {
  id: number;
  message: string;
  kind: ToastKind;
};

const DURATION_MS = 2200;

let listeners: Array<(toasts: Toast[]) => void> = [];
let toasts: Toast[] = [];
let nextId = 0;

function notify() {
  for (const l of listeners) l(toasts);
}

export function showToast(message: string, kind: ToastKind = "success") {
  const id = ++nextId;
  toasts = [...toasts, { id, message, kind }];
  notify();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, DURATION_MS);
}

export function subscribeToasts(fn: (toasts: Toast[]) => void) {
  listeners.push(fn);
  fn(toasts);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}
