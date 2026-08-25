import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SquarePen } from "lucide-react";
import { toast } from "sonner";
import { fetchData } from "@/app/_utils/api";
import React from "react";
export function Edit({ collector, children }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    first_name: collector?.first_name || "",
    last_name: collector?.last_name || "",
    phone: collector?.phone || "",
    cni: collector?.cni || "",
    identifiant: collector?.identifiant || "",
    password: "",
  });

  // Mettre à jour les données lorsqu'on ouvre le modal au cas où l'objet a changé
  React.useEffect(() => {
    if (open && collector) {
      setFormData({
        first_name: collector.first_name || "",
        last_name: collector.last_name || "",
        phone: collector.phone || "",
        cni: collector.cni || "",
        identifiant: collector.identifiant || "",
        password: "",
      });
    }
  }, [open, collector]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...formData };
    // Ne pas envoyer de mot de passe vide si l'utilisateur ne l'a pas modifié
    if (!payload.password) {
      delete payload.password;
    }

    try {
      const response = await fetchData(
        "patch",
        `/mais/responsable_registration/${collector?.id}/`,
        {
          params: {},
          additionalHeaders: {},
          body: payload,
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(`${formData.identifiant} a été modifié avec succès`);
        setOpen(false);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error("Erreur lors de la modification");
      }
    } catch (error) {
      console.error("Error patching collector:", error);
      toast.error("Donnée non modifiée");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="secondary"
            className="w-full justify-start font-normal text-sm"
          >
            <SquarePen className="mr-2" size={16} />
            Modifier
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier</DialogTitle>
          <DialogDescription>
            Modifiez les informations du collecteur {collector?.first_name} {collector?.last_name}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="last_name">Nom</Label>
              <Input
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Nom"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="first_name">Prénom</Label>
              <Input
                id="first_name"
                name="first_name"
                type="text"
                placeholder="Prénom"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Numéro de téléphone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="identifiant">Identifiant</Label>
              <Input
                id="identifiant"
                name="identifiant"
                type="text"
                placeholder="Identifiant de connexion"
                value={formData.identifiant}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cni">CNI</Label>
              <Input
                id="cni"
                name="cni"
                type="text"
                placeholder="Numéro de CNI"
                value={formData.cni}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Laisser vide pour ne pas modifier"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
