import React from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Archive,
  ArrowDownToLine,
  Leaf,
  Factory,
  PackageCheck,
  Truck,
  Layers,
  Activity,
} from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { SimpleCardSkeleton } from "@/components/ui/skeletons";

function StatsCard({ id }) {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState({
    total_recu: 0,
    total_usine: 0,
    total_vert_produit: 0,
    total_vert_sorti: 0,
    stock_actuel: 0,
    rendement_moyen: 0,
    lots_actifs: 0,
  });

  React.useEffect(() => {
    const getUsineStats = async () => {
      setLoading(true);
      try {
        // Placeholder for API calls
        const response = await fetchData(
          "get",
          `mais/usine_deparchage/${id}/get_quantite_receptionne_par_hangar/`,
          {}
        );
        const usinee = await fetchData(
          "get",
          `mais/usine_deparchage/${id}/get_quantite_usinee_par_hangar/`,
          {}
        );
        const produit = await fetchData(
          "get",
          `mais/usine_deparchage/${id}/get_quanitite_vert_produit_par_usine/`,
          {}
        );
        const qteVendu = await fetchData(
          "get",
          `mais/usine_deparchage/${id}/get_quanitite_vert_vendu_par_usine/`,
          {}
        );
        setData({
          total_recu: response?.quantite_receptionne || 0,
          total_usine: usinee?.quantite_usinee || 0,
          total_vert_produit: produit?.quantite_vert_produit || 0,
          total_vert_sorti: qteVendu?.quantite_vert_vendu || 0,
          stock_actuel:
            produit?.quantite_vert_produit - qteVendu?.quantite_vert_vendu || 0,
          rendement_moyen: 80,
          lots_actifs: 5,
        });
      } catch (error) {
        console.error("Error fetching usine stats:", error);
      } finally {
        setLoading(false);
      }
    };

    getUsineStats();
  }, [id]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SimpleCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Qte. Réceptionnée",
      value: data.total_recu,
      unit: "Kg",
      icon: ArrowDownToLine,
      color: "bg-primary",
      desc: "Total reçu à l'usine",
    },
    {
      title: "Qte. Usinée",
      value: data.total_usine,
      unit: "Kg",
      icon: Factory,
      color: "bg-orange-500",
      desc: "Total traité par l'usine",
    },
    {
      title: "Qte. Café Vert Produit",
      value: data.total_vert_produit,
      unit: "Kg",
      icon: Leaf,
      color: "bg-green-600",
      desc: "Production après usinage",
    },
    {
      title: "Qte. Café Vert Sorti",
      value: data.total_vert_sorti,
      unit: "Kg",
      icon: Truck,
      color: "bg-red-500",
      desc: "Expédié hors usine",
    },
    {
      title: "Stock Café Vert Actuel",
      value: data.stock_actuel,
      unit: "Kg",
      icon: PackageCheck,
      color: "bg-emerald-600",
      desc: "Disponible en stock",
    },
    // {
    //   title: "Rendement Moyen",
    //   value: data.rendement_moyen,
    //   unit: "%",
    //   icon: Activity,
    //   color: "bg-purple-500",
    //   desc: "Performance moyenne",
    // },
    // {
    //   title: "Nombre de Lots Actifs",
    //   value: data.lots_actifs,
    //   unit: "",
    //   icon: Layers,
    //   color: "bg-indigo-500",
    //   desc: "Lots en cours de traitement",
    // },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <div className="flex flex-row gap-x-2 items-center">
              <div className={`${card.color} p-2 rounded-md`}>
                <card.icon className="text-white w-5 h-5" />
              </div>
              <CardTitle className="text-xl font-semibold tracking-tight tabular-nums">
                {card.value.toLocaleString()}
                {card.unit && <span className="text-sm ml-1">{card.unit}</span>}
              </CardTitle>
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground mt-2">
              {card.title}
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default StatsCard;
