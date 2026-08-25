"use client";

import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Grape,
  ArrowDownToLine,
  Factory,
  Leaf,
  Truck,
} from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { SimpleCardSkeleton } from "@/components/ui/skeletons";

export function UsineSummaryCards() {
  const [data, setData] = React.useState({
    total_usine: 0,
    qty_recu: 0,
    total_traite: 0,
    total_produit: 0,
    total_sorti: 0,
    stock_mais_vert: 0,
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getData = async () => {
      try {
        const responseUsines = await fetchData(
          "get",
          "mais/usine_deparchage/get_total_usine_deparchage/",
          {}
        );
        const qteRecu = await fetchData(
          "get",
          "mais/usine_deparchage/get_quantite_receptionne/",
          {}
        );
        const qteVendu = await fetchData(
          "get",
          "mais/usine_deparchage/get_quanitite_vert_vendu/",
          {}
        );
        const qteProduit = await fetchData(
          "get",
          "mais/usine_deparchage/get_quanitite_vert_produit/",
          {}
        );
        const qteUsinee = await fetchData(
          "get",
          "mais/usine_deparchage/get_quantite_usinee/",
          {}
        );

        const totalUsines = responseUsines?.total_usine_deparchage || 0;

        // Mock data for new KPIs as global endpoints might not exist yet
        setData({
          total_usine: totalUsines,
          qty_recu: qteRecu?.quantite_receptionne || 0,
          total_traite: qteUsinee?.quantite_usinee || 0,
          total_produit: qteProduit?.quantite_produit || 0,
          total_sorti: qteVendu?.quantite_vert_vendu || 0,
          stock_mais_vert:
            qteProduit?.quantite_produit - qteVendu?.quantite_vert_vendu || 0,
        });
      } catch (error) {
        console.error("Error fetching usine stats:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const cards = [
    {
      title: "Effectif Total des Usines",
      value: data.total_usine,
      icon: Building2,
      color: "bg-primary",
      unit: "",
      desc: "Nombre d'usines",
    },
    {
      title: "Qte. Réceptionnée",
      value: data.qty_recu,
      icon: ArrowDownToLine,
      color: "bg-blue-600",
      unit: "Kg",
      desc: "Depuis les Hangars",
    },
    {
      title: "Qte. Usinée",
      value: data.total_traite,
      icon: Factory,
      color: "bg-orange-500",
      unit: "Kg",
      desc: "Total traité",
    },
    {
      title: "Qte. Café Vert Produit",
      value: data.total_produit,
      icon: Leaf,
      color: "bg-green-600",
      unit: "Kg",
      desc: "Production nette",
    },
    {
      title: "Qte. Café Vert Sorti",
      value: data.total_sorti,
      icon: Truck,
      color: "bg-red-500",
      unit: "Kg",
      desc: "Expéditions",
    },
    {
      title: "Stock Café Vert",
      value: data.stock_mais_vert,
      icon: Grape,
      color: "bg-emerald-600",
      unit: "Kg",
      desc: "Global",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SimpleCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <div className="flex flex-row gap-x-2 items-center">
              <div className={`${card.color} p-2 rounded-md`}>
                <card.icon className="text-white w-5 h-5" />
              </div>
              <CardTitle className="text-xl font-semibold tracking-tight tabular-nums ml-1">
                {card.value.toLocaleString()}
                {card.unit && <span className="text-sm ml-1">{card.unit}</span>}
              </CardTitle>
            </div>
            <CardTitle className="text-base font-medium text-muted-foreground mt-2 ml-1">
              {card.title}
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
