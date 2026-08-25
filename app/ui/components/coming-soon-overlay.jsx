import React from "react";
import { Hammer, Pickaxe, Construction } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Composant de superposition (Overlay) à utiliser sur un élément en cours de développement.
 * Assurez-vous que l'élément parent a la classe `relative` et `overflow-hidden` 
 * pour que ce composant se positionne correctement par-dessus.
 * 
 * @param {string} className - Classes additionnelles pour le conteneur principal
 * @param {string} title - Titre à afficher (défaut: "En construction")
 * @param {string} message - Message à afficher (défaut: "Cette fonctionnalité sera bientôt disponible.")
 * @param {boolean} transparent - Si vrai, le fond sera plus transparent (défaut: false)
 */
export function ComingSoonOverlay({
  className,
  title = "En cours de développement",
  message = "Cette fonctionnalité sera bientôt disponible.",
  transparent = false,
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center ",
        transparent
          ? "bg-background/40 backdrop-blur-[2px]"
          : "bg-background/80 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex flex-col items-center max-w-sm gap-4 p-6  rounded-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Construction className="w-8 h-8 text-primary" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default ComingSoonOverlay;
