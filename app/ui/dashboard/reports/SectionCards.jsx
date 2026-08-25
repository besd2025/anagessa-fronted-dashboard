"use client"
import React from "react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Archive, Grape, CircleDollarSign } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { fetchData } from "@/app/_utils/api";
export function SectionCards() {
    const datas = {
        total_grains_achat: 15420.5,
        total_grains_a_achat: 10023.3,
        total_grains_b_achat: 5397.2,
        total_montant_achat: 12500400
    };
    const newQtyToday = 2500;
    const percentageA = 65;
    const percentageB = 35;
    const [data, setData] = React.useState([]);
    React.useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await fetchData("get", `mais/rapportages_sdl_ct/get_details/`);
                setData({
                    total_grains_achat: response?.total_grains_rapport,
                    total_grains_a_achat: response?.total_grains_a_rapport,
                    total_grains_b_achat: response?.total_grains_b_rapport,
                    total_montant_achat: 0,
                    gap_total: response?.total_grains_rapport > response?.total_grains_mobile ? response?.total_grains_rapport - response?.total_grains_mobile : response?.total_grains_mobile - response?.total_grains_rapport,
                    total_gap_ca: response?.total_grains_a_rapport > response?.total_grains_a_mobile ? response?.total_grains_a_rapport - response?.total_grains_a_mobile : response?.total_grains_a_mobile - response?.total_grains_a_rapport,
                    total_gap_cb: response?.total_grains_b_rapport > response?.total_grains_b_mobile ? response?.total_grains_b_rapport - response?.total_grains_b_mobile : response?.total_grains_b_mobile - response?.total_grains_b_rapport,
                    percentage_a: (response?.total_grains_a_rapport / response?.total_grains_rapport) * 100,
                    percentage_b: (response?.total_grains_b_rapport / response?.total_grains_rapport) * 100,
                    pourcentage_total_gap: response?.total_grains_rapport > response?.total_grains_mobile ? (response?.total_grains_rapport - response?.total_grains_mobile) * 100 / response?.total_grains_rapport : (response?.total_grains_mobile - response?.total_grains_rapport) * 100 / response?.total_grains_mobile,
                    message: response?.total_grains_rapport > response?.total_grains_mobile ? "Le rapport a depassé la quantité collectée" : "Le rapport est inferieur à la quantité collectée",
                });
            } catch (error) {
                console.error("Error fetching hangar report:", error);
            }
        };
        fetchReport();
    }, []);
    return (
        <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
            <Card className="@container/card col-span-4 @5xl/main:col-span-2 relative">
                <CardHeader className="flex flex-col">
                    <div className="flex flex-row gap-x-2 items-center">
                        <div className="bg-primary p-2 rounded-md">
                            <Archive className="text-white" />
                        </div>
                        <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tracking-tight tabular-nums">
                            {data?.total_grains_achat >= 1000 ? (
                                <>
                                    {(data?.total_grains_achat / 1000).toLocaleString("fr-FR", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}{" "}
                                    <span className="text-base">T</span>
                                </>
                            ) : (
                                <>
                                    {data?.total_grains_achat?.toLocaleString("fr-FR") || 0}{" "}
                                    <span className="text-sm">Kg</span>
                                </>
                            )}
                        </CardTitle>

                    </div>
                    <CardTitle className="text-lg font-semibold tabular-nums  ">
                        Qte rapportee (CAB)
                    </CardTitle>

                    <div className="mt-2 space-y-3 w-full">
                        <div className="flex justify-between items-end">
                            <span className="text-xs text-muted-foreground ">
                                Rapport grains A / B
                            </span>
                            {/* <span className="text-[10px] font-mono text-muted-foreground">
                Ratio: 65%
              </span> */}
                        </div>
                        {/* Barre de progression professionnelle */}
                        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                className="bg-primary/90"
                                style={{ width: `${data.percentage_a}%` }}
                            />
                            <div
                                className="bg-secondary/90"
                                style={{ width: `${data.percentage_b}%` }}
                            />
                        </div>
                        <div className="flex flex-wrap gap-y-2 justify-between text-xs font-medium">
                            <div className="flex flex-row gap-x-2 items-center bg-primary/10 py-1 px-2 rounded-lg w-max">
                                <span className="text-primary flex items-center gap-1">●</span>
                                <div className="flex flex-row gap-x-1 items-center">
                                    <Grape className="text-primary size-5" />
                                    <CardTitle className="text-md font-semibold text-primary">
                                        MaÃ¯s blanc :
                                    </CardTitle>
                                </div>
                                <CardDescription className="font-semibold text-accent-foreground text-lg">
                                    {data?.total_grains_a_achat >= 1000 ? (
                                        <>
                                            {(data?.total_grains_a_achat / 1000).toLocaleString(
                                                "fr-FR",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                },
                                            )}{" "}
                                            <span className="text-sm">T</span>
                                        </>
                                    ) : (
                                        <>
                                            {data?.total_grains_a_achat?.toLocaleString("fr-FR") || 0}{" "}
                                            <span className="text-sm">Kg</span>
                                        </>
                                    )}
                                    <span className="text-xs font-normal text-muted-foreground ml-2">
                                        ({data?.percentage_a?.toFixed(1)}%)
                                    </span>
                                </CardDescription>
                            </div>
                            <span className="w-0.5 h-8 bg-black/20 hidden @5xl/main:block">
                                <Separator orientation="vertical" />
                            </span>
                            <div className="flex flex-row gap-x-2 items-center bg-secondary/10 py-1 px-2 rounded-lg">
                                <span className="text-secondary flex items-center gap-1">
                                    ●
                                </span>
                                <div className="flex flex-row gap-x-1 items-center">
                                    <Grape className="text-secondary size-5" />
                                    <CardTitle className="text-md font-semibold text-secondary">
                                        MaÃ¯s jaune :
                                    </CardTitle>
                                </div>
                                <CardDescription className="font-semibold text-accent-foreground text-lg">
                                    {data?.total_grains_b_achat >= 1000 ? (
                                        <>
                                            {(data?.total_grains_b_achat / 1000).toLocaleString(
                                                "fr-FR",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                },
                                            )}
                                            <span className="text-sm">T</span>
                                        </>
                                    ) : (
                                        <>
                                            {data?.total_grains_b_achat?.toLocaleString("fr-FR") || 0}{" "}
                                            <span className="text-sm">Kg</span>
                                        </>
                                    )}
                                    <span className="text-xs font-normal text-muted-foreground ml-2">
                                        ({data?.percentage_b?.toFixed(1)}%)
                                    </span>
                                </CardDescription>
                            </div>
                        </div>
                    </div>

                </CardHeader>
            </Card>
            <Card className="@container/card col-span-4 @5xl/main:col-span-2 relative">
                <CardHeader>
                    <CardDescription className="text-lg  font-semibold tabular-nums  ">GAP</CardDescription>
                    <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tracking-tight tabular-nums text-destructive">
                        {data?.gap_total >= 1000 ? (
                            <>
                                {(data?.gap_total / 1000).toLocaleString("fr-FR", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}{" "}
                                <span className="text-base">T</span>
                            </>
                        ) : (
                            <>
                                {data?.gap_total?.toLocaleString("fr-FR") || 0}{" "}
                                <span className="text-sm">Kg</span>
                            </>
                        )}
                    </CardTitle>
                    {/* <CardAction>
                        <Badge variant="destructive">
                            <IconTrendingDown />
                            {data?.pourcentage_total_gap?.toFixed(1)}%
                        </Badge>
                    </CardAction> */}
                </CardHeader>
                <CardContent className="">
                    <div className="flex flex-wrap gap-y-2 justify-between text-xs font-medium">
                        <div className="flex flex-row gap-x-2 items-center bg-primary/10 py-1 px-2 rounded-lg w-max">
                            <span className="text-primary flex items-center gap-1">●</span>
                            <div className="flex flex-row gap-x-1 items-center">
                                <Grape className="text-primary size-5" />
                                <CardTitle className="text-md font-semibold text-primary">
                                    MaÃ¯s blanc :
                                </CardTitle>
                            </div>
                            <CardDescription className="font-semibold text-accent-foreground text-lg">
                                {data?.total_gap_ca >= 1000 ? (
                                    <>
                                        {(data?.total_gap_ca / 1000).toLocaleString(
                                            "fr-FR",
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            },
                                        )}{" "}
                                        <span className="text-sm">T</span>
                                    </>
                                ) : (
                                    <>
                                        {data?.total_gap_ca?.toLocaleString("fr-FR") || 0}{" "}
                                        <span className="text-sm">Kg</span>
                                    </>
                                )}
                                {/* <span className="text-xs font-normal text-muted-foreground ml-2">
                                    ({percentageA.toFixed(1)}%)
                                </span> */}
                            </CardDescription>
                        </div>
                        <span className="w-0.5 h-8 bg-black/20 hidden @5xl/main:block">
                            <Separator orientation="vertical" />
                        </span>
                        <div className="flex flex-row gap-x-2 items-center bg-secondary/10 py-1 px-2 rounded-lg">
                            <span className="text-secondary flex items-center gap-1">
                                ●
                            </span>
                            <div className="flex flex-row gap-x-1 items-center">
                                <Grape className="text-secondary size-5" />
                                <CardTitle className="text-md font-semibold text-secondary">
                                    MaÃ¯s jaune :
                                </CardTitle>
                            </div>
                            <CardDescription className="font-semibold text-accent-foreground text-lg">
                                {data?.total_gap_cb >= 1000 ? (
                                    <>
                                        {(data?.total_gap_cb / 1000).toLocaleString(
                                            "fr-FR",
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            },
                                        )}
                                        <span className="text-sm">T</span>
                                    </>
                                ) : (
                                    <>
                                        {data?.total_gap_cb?.toLocaleString("fr-FR") || 0}{" "}
                                        <span className="text-sm">Kg</span>
                                    </>
                                )}
                                {/* <span className="text-xs font-normal text-muted-foreground ml-2">
                                    ({percentageB.toFixed(1)}%)
                                </span> */}
                            </CardDescription>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Gap de {data?.pourcentage_total_gap?.toFixed(2)}% <IconTrendingDown className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        {data?.message}
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
