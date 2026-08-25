"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Layers,
  CheckCircle2,
  Clock,
  XCircle,
  Pencil,
} from "lucide-react";
import ViewImageDialog from "@/components/ui/view-image-dialog";
import { toast } from "sonner";

// Données fictives (Mock Data) pour la liste des grades
const MOCK_GRADES = [
  {
    id: 1,
    grade: "A1",
    quantite: 1500,
    cafe_parche_type: "Cerise A",
    enregitrement_date: "2025-01-15",
    comfirmation_status: "CONFIRMEE",
  },
  {
    id: 2,
    grade: "A2",
    quantite: 2300,
    cafe_parche_type: "Cerise A",
    enregitrement_date: "2025-01-15",
    comfirmation_status: "EN_ATTENTE",
  },
  {
    id: 3,
    grade: "B1",
    quantite: 850,
    cafe_parche_type: "Cerise B",
    enregitrement_date: "2025-01-16",
    comfirmation_status: "EN_ATTENTE",
  },
];

export default function DetailsTransfer({
  transfer = {},
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen : setInternalOpen;

  // Liste des grades avec données mockées
  const [gradesDetails, setGradesDetails] = useState(MOCK_GRADES);

  // État pour le sous-dialogue de modification
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);

  // Champs du transfert
  const chauffeurNom = transfer?.chauffeur_nom || "-";
  const chauffeurPrenom = transfer?.chauffeur_prenom || "-";
  const chauffeurTelephone = transfer?.chauffeur_telephone || "-";

  const nomAccompagnateur = transfer?.nom_accompagnateur || "-";
  const prenomAccompagnateur = transfer?.prenom_accompagnateur || "-";
  const phoneAccompagnateur =
    transfer?.phone_accompagnteur || transfer?.phone_accompagnateur || "-";

  const plaqueCamion = transfer?.plaque_camion || "-";
  const totalParche =
    transfer?.total_parche ??
    transfer?.qte_tranferer?.ca ??
    transfer?.quantite_totale ??
    0;
  const dateReception = transfer?.date_reception || "-";

  const sdlSource = transfer?.from_sdl || transfer?.hangar?.sdl_nom || "-";
  const usineDestination =
    transfer?.usine_deparchage?.usine_name ||
    transfer?.usine_deparchage ||
    transfer?.usine?.name ||
    transfer?.usine ||
    "-";
  const transferDate =
    transfer?.transfer_date || transfer?.date_transfert || transfer?.date || "-";
  const photoBordereau =
    transfer?.photo_bordereau || transfer?.photo_fiche || null;

  const isConfirmed =
    transfer?.est_confirme === true ||
    transfer?.status === true ||
    transfer?.status === "CONFIRME" ||
    transfer?.status === "CONFIRMEE" ||
    transfer?.comfirmation_status === "CONFIRMEE";

  const renderStatusBadge = (status) => {
    const s = String(status || "").toUpperCase();
    if (s === "CONFIRMEE" || s === "CONFIRME" || s === "CONFIRMED" || status === true) {
      return (
        <Badge variant="secondary" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Confirmé
        </Badge>
      );
    }
    if (s === "REJETEE" || s === "REJETE" || s === "REJECTED") {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          Rejeté
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="gap-1">
        <Clock className="h-3 w-3" />
        En attente
      </Badge>
    );
  };

  // Ouvrir le sous-dialogue pour modifier
  const handleOpenEdit = (gradeItem) => {
    setSelectedGrade({ ...gradeItem });
    setEditModalOpen(true);
  };

  // Enregistrer les modifications localement
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedGrade) return;

    setGradesDetails((prev) =>
      prev.map((g) => (g.id === selectedGrade.id ? selectedGrade : g))
    );
    setEditModalOpen(false);
    toast.success(`Grade ${selectedGrade.grade} modifié avec succès`);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {trigger ? (
          <DialogTrigger asChild>{trigger}</DialogTrigger>
        ) : !isControlled ? (
          <DialogTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 p-2 font-normal text-sm">
              <span>Détails</span>
            </Button>
          </DialogTrigger>
        ) : null}

        <DialogContent className="sm:max-w-[780px] bg-sidebar p-0 overflow-y-auto max-h-[90vh] flex flex-col">
          <DialogHeader className="p-5 pb-3 border-b bg-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <DialogTitle className="text-lg font-bold text-foreground">
                  Détails du Transfert hangar
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Informations sur le transport, chauffeur, accompagnateur et liste des grades
                </DialogDescription>
              </div>
              <div>{renderStatusBadge(isConfirmed ? "CONFIRMEE" : "EN_ATTENTE")}</div>
            </div>

            {/* Informations de base avec disposition en 2 colonnes */}
            <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t border-border/50 text-sm">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Source :</span>
                  <span className="truncate">{sdlSource}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Destination :</span>
                  <span className="truncate">{usineDestination}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Date :</span>
                  <span>{transferDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Chauffeur :</span>
                  <span>{chauffeurNom} {chauffeurPrenom !== "-" ? chauffeurPrenom : ""}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Téléphone chauffeur :</span>
                  <span>{chauffeurTelephone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Accompagnateur :</span>
                  <span>{nomAccompagnateur} {prenomAccompagnateur !== "-" ? prenomAccompagnateur : ""}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Téléphone accompagnateur :</span>
                  <span>{phoneAccompagnateur}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Véhicule :</span>
                  <span className="font-semibold font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
                    {plaqueCamion}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Total parche :</span>
                  <span className="font-bold text-primary text-sm">
                    {typeof totalParche === "number"
                      ? totalParche.toLocaleString("fr-FR", { minimumFractionDigits: 2 })
                      : totalParche}{" "}
                    kg
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Date de réception :</span>
                  <span className="font-semibold font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
                    {dateReception}
                  </span>
                </div>
              </div>

              {/* Photo bordereau */}
              <div>
                {photoBordereau && photoBordereau !== "null" && (
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex flex-col items-center gap-4">
                      <div>
                        <div className="text-xs font-semibold text-foreground">Bordereau de Transfert</div>
                        <div className="text-[11px] text-muted-foreground">Cliquez sur l'image pour l'agrandir</div>
                      </div>
                      <ViewImageDialog
                        imageUrl={photoBordereau}
                        alt="Bordereau de transfert"
                        profile={false}
                        className="h-24 w-24 rounded-md border"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Corps de la boîte de dialogue */}
          <div className="custom-scrollbar flex-1">
            {/* Section: Tableau liste des grades */}
            <div className="space-y-2.5 p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>Liste des Lots de Café & Grades</span>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {gradesDetails.length} lot{gradesDetails.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="rounded-lg border bg-card overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-semibold text-xs">Actions</TableHead>
                      <TableHead className="font-semibold text-xs">Grade</TableHead>
                      <TableHead className="font-semibold text-xs text-right">Quantité (kg)</TableHead>
                      <TableHead className="font-semibold text-xs">Type de Café Parche</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Date d'enregistrement</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gradesDetails.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        <TableCell className="w-16">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 cursor-pointer"
                            onClick={() => handleOpenEdit(item)}
                            title="Modifier ce lot"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                        <TableCell className="font-semibold text-foreground text-sm">
                          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-xs">
                            {item.grade}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-bold text-foreground text-sm">
                          {typeof item.quantite === "number"
                            ? item.quantite.toLocaleString("fr-FR", { minimumFractionDigits: 2 })
                            : item.quantite}
                        </TableCell>
                        <TableCell className="text-sm text-foreground">
                          <span className="font-medium">{item.cafe_parche_type}</span>
                        </TableCell>
                        <TableCell className="text-center text-xs text-muted-foreground">
                          {item.enregitrement_date}
                        </TableCell>
                        <TableCell className="text-center">
                          {renderStatusBadge(item.comfirmation_status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sous-dialogue de modification d'un lot/grade */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[420px] bg-card">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Modifier le Lot ({selectedGrade?.grade})
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Modifier les informations de ce lot de café
            </DialogDescription>
          </DialogHeader>

          {selectedGrade && (
            <form onSubmit={handleSaveEdit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Grade</Label>
                <Input
                  value={selectedGrade.grade}
                  onChange={(e) =>
                    setSelectedGrade((prev) => ({ ...prev, grade: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Quantité (kg)</Label>
                <Input
                  type="number"
                  step="any"
                  value={selectedGrade.quantite}
                  onChange={(e) =>
                    setSelectedGrade((prev) => ({
                      ...prev,
                      quantite: parseFloat(e.target.value) || 0,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Type de Café Parche</Label>
                <Input
                  value={selectedGrade.cafe_parche_type}
                  onChange={(e) =>
                    setSelectedGrade((prev) => ({
                      ...prev,
                      cafe_parche_type: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Date d'enregistrement</Label>
                <Input
                  type="date"
                  value={selectedGrade.enregitrement_date}
                  onChange={(e) =>
                    setSelectedGrade((prev) => ({
                      ...prev,
                      enregitrement_date: e.target.value,
                    }))
                  }
                />
              </div>

              <DialogFooter className="pt-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditModalOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" size="sm">
                  Enregistrer
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
