"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
export default function AddUserDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    identifiant: "",
    cni: "",
    category: "",
    adresse: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchData("post", `mais/mais_registration/`, {
        params: {},
        additionalHeaders: {},
        body: formData,
      });
      if (response.status === 201) {
        setOpen(false);
        toast.info("Utilisateur ajouté avec succès");
        window.location.reload();
      } else {
        toast.error("Erreur lors de l'ajout de l'utilisateur");
      }
    } catch (error) {
      console.error("Error fetching users data:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Nouvel Utilisateur
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un Utilisateur</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour créer un nouvel utilisateur.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="last_name">Nom</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Entrer le nom"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="first_name">Prénom</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Entrer le prénom"
                required
              />
            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="identifiant">Identifiant (Email/Username)</Label>
              <Input
                id="identifiant"
                name="identifiant"
                value={formData.identifiant}
                onChange={handleChange}
                placeholder="john.doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie / Rôle</Label>
              <Select onValueChange={handleSelectChange} value={formData.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Administrateur</SelectItem>
                  <SelectItem value="General">Général</SelectItem>
                  <SelectItem value="ANAGESSA">CADRES ANAGESSA</SelectItem>
                  <SelectItem value="Anagessa_Chef_societe">CHEF SOCIETE</SelectItem>
                  <SelectItem value="mais_Responsable">mais RESPONSABLE</SelectItem>
                  <SelectItem value="Superviseur_Regional">SUPERVISEUR REGIONAL</SelectItem>
                  <SelectItem value="Superviseur">SUPERVISEUR
                  </SelectItem>

                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cni">CNI</Label>
              <Input
                id="cni"
                name="cni"
                value={formData.cni}
                onChange={handleChange}
                placeholder="Numéro de pièce d'identité"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+257 ..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
        </div>
        <DialogFooter className="pt-4">
          <Button type="submit" onClick={handleSubmit} className="w-full">
            Créer l'utilisateur
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
