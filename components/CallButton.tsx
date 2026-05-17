"use client";

/**
 * Bouton flottant d'appel direct, visible uniquement sur mobile.
 * Position : bas droit, sticky au-dessus de tout le reste.
 */

const PHONE = "0240862102";
const PHONE_DISPLAY = "02 40 86 21 02";

export default function CallButton() {
  return (
    <a
      href={`tel:${PHONE}`}
      aria-label={`Appeler AVR Automobile au ${PHONE_DISPLAY}`}
      title={`Appeler ${PHONE_DISPLAY}`}
      className="call-button md:hidden fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-brand-accent text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.487 17.14l-4.065-3.696c-.39-.354-.998-.343-1.376.024l-2.392 2.392c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.355-1.66-2.926l2.39-2.392c.367-.378.378-.985.025-1.375L7.787 3.443c-.354-.39-.961-.41-1.337-.043L4.292 5.558c-.193.194-.31.451-.328.726-.022.281-.435 6.946 4.731 12.114C13.196 22.917 18.844 23.31 20.4 23.31c.227 0 .366-.008.403-.011.275-.018.532-.135.726-.328l2.157-2.158c.368-.376.348-.984-.043-1.337z"/>
      </svg>
    </a>
  );
}
