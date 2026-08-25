"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Grape, Save, Send, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WeeklyReportGrid from '@/app/ui/dashboard/reports/weekly-report-grid';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { fetchData } from '@/app/_utils/api';
import { useSearchParams } from 'next/navigation';
import { UserContext } from '@/app/context/User_Context';
import PaginationContent from "@/components/ui/pagination-content";
export default function DetailsReports() {
    // Mocks de données pour la province du superviseur (ex: Ngozi)
    const searchParams = useSearchParams();
    const id = searchParams.get("id_rapport");
    const user = React.useContext(UserContext);
    const [totals, setTotals] = useState({ ca: 0, cb: 0, general: 0 });

    // Pagination states
    const [sdlLimit, setSdlLimit] = useState(10);
    const [sdlPointer, setSdlPointer] = useState(0);
    const [sdlCurrentPage, setSdlCurrentPage] = useState(1);

    const [ctLimit, setCtLimit] = useState(10);
    const [ctPointer, setCtPointer] = useState(0);
    const [ctCurrentPage, setCtCurrentPage] = useState(1);

    const [allSdlItems, setAllSdlItems] = useState([]);
    const [allCtItems, setAllCtItems] = useState([]);
    const [activeTab, setActiveTab] = useState("hangar");
    const [sdlTotalCount, setSdlTotalCount] = useState(0);
    const [ctTotalCount, setCtTotalCount] = useState(0);

    // Fetch hangar data with its own pagination
    useEffect(() => {
        const fetchSdlReport = async () => {
            try {
                const response = await fetchData("get", `mais/rapportages_sdl_ct_semaine/${id}/get_list_sdl_ct_per_week/`, {
                    params: {
                        limit: sdlLimit,
                        offset: sdlPointer,
                        type: "hangar",
                    }
                });
                const items = response?.results || [];

                const sdlItems = items.filter(item => item.sdl_ct?.sdl_ct?.hangar?.sdl_nom).map((item) => ({
                    id: item.id,
                    responsable_id: item.sdl_ct?.sdl_ct?.hangar?.id,
                    name: item.sdl_ct?.sdl_ct?.hangar?.sdl_nom,
                    ca: item.quantite_grains_a,
                    cb: item.quantite_grains_b
                }));
                setAllSdlItems(sdlItems);
                setSdlTotalCount(response?.count || 0);

                // Calculer les totaux dynamiques à partir des données hangar
                const total_ca = items.reduce((acc, item) => acc + item.quantite_grains_a, 0);
                const total_cb = items.reduce((acc, item) => acc + item.quantite_grains_b, 0);
                setTotals(prev => ({
                    ...prev,
                    ca: total_ca,
                    cb: total_cb,
                    general: total_ca + total_cb,
                    dates: (items[0]?.rapportage_sdl_ct_semaine?.week_beginning || prev.dates?.split(" - ")[0] || "") + " - " + (items[0]?.rapportage_sdl_ct_semaine?.week_end || prev.dates?.split(" - ")[1] || ""),
                }));
            } catch (error) {
                console.error("Error fetching hangar report:", error);
            }
        };
        if (id) fetchSdlReport();
    }, [id, sdlLimit, sdlPointer]);

    // Fetch hangar data with its own pagination
    useEffect(() => {
        const fetchCtReport = async () => {
            try {
                const response = await fetchData("get", `mais/rapportages_sdl_ct_semaine/${id}/get_list_sdl_ct_per_week/`, {
                    params: {
                        limit: ctLimit,
                        offset: ctPointer,
                        type: "hangar",
                    }
                });
                const items = response?.results || [];

                const ctItems = items.filter(item => item.sdl_ct?.sdl_ct?.hangar?.ct_nom).map((item) => ({
                    id: item.id,
                    responsable_id: item.sdl_ct?.sdl_ct?.hangar?.id,
                    name: item.sdl_ct?.sdl_ct?.hangar?.ct_nom,
                    ca: item.quantite_grains_a,
                    cb: item.quantite_grains_b
                }));
                setAllCtItems(ctItems);
                setCtTotalCount(response?.count || 0);
            } catch (error) {
                console.error("Error fetching hangar report:", error);
            }
        };
        if (id) fetchCtReport();
    }, [id, ctLimit, ctPointer]);

    return (
        <div className="p-2 md:p-8 gap-y-6 max-w-7xl flex flex-col min-h-screen">
            {/* En-tête */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/anagessa-dashboard/reports">
                            <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
                                <ChevronLeft className="w-5 h-5 mr-1" />
                                Retour
                            </Button>
                        </Link>
                        <span className="text-gray-300 dark:text-gray-600">|</span>
                        <Badge variant="outline" className="text-sm text-secondary border-secondary bg-secondary/10 dark:bg-secondary/20 dark:border-secondary dark:text-secondary">
                            {user?.session?.category === "Anagessa_Chef_societe" ? `SOCIETE ${user?.session?.societe}` : user?.session?.category === "mais_Superviseur" ? "SUPERVISEUR" : ""}

                        </Badge>
                    </div>

                    <h1 className="text-2xl font-semibold">
                        Rapportage de la Semaine du {totals.dates}
                    </h1>
                    <div className="flex items-center gap-x-1 mt-2">
                        <User />
                        <span>Superviseur:</span>
                        <span className="font-medium ">{user?.session?.last_name} {user?.session?.first_name}</span>
                    </div>
                </div>
            </div>

            <div className=" shadow-none">
                <div className="flex flex-col gap-y-1 bg-card rounded-md p-3 mb-4">
                    <h1 className="text-xl font-semibold">Total General: {totals.general.toLocaleString()} Kg</h1>
                    <div className="flex items-center gap-x-1 pl-4"><Grape className="text-primary size-5" />
                        <h1 className="text-md ">Total CA: {totals.ca.toLocaleString()} Kg</h1>
                    </div>
                    <div className="flex items-center gap-x-1 pl-4"><Grape className="text-secondary size-5" />
                        <h1 className="text-md ">Total CB: {totals.cb.toLocaleString()} Kg</h1>
                    </div>
                </div>
                <Tabs defaultValue="hangar" onValueChange={setActiveTab} className="w-full">
                    <TabsList className="mb-2">
                        <TabsTrigger value="hangar">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Hangars
                        </TabsTrigger>
                        <TabsTrigger value="hangar">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Hangarse
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="hangar" className="border-none outline-none p-0 focus:ring-0">
                        <WeeklyReportGrid
                            items={allSdlItems}
                            type="hangar"
                            readOnly={true}
                            internalPagination={false}
                        />
                        <div className="mt-4 bg-white dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800">
                            <PaginationContent
                                currentPage={sdlCurrentPage}
                                totalPages={Math.ceil(sdlTotalCount / sdlLimit)}
                                onPageChange={(page) => {
                                    setSdlCurrentPage(page);
                                    setSdlPointer((page - 1) * sdlLimit);
                                }}
                                pointer={sdlPointer}
                                totalCount={sdlTotalCount}
                                onLimitChange={(limit) => {
                                    setSdlLimit(limit);
                                    setSdlPointer(0);
                                    setSdlCurrentPage(1);
                                }}
                                limit={sdlLimit}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="hangar" className="m-0 border-none outline-none   p-0 focus:ring-0">
                        <WeeklyReportGrid
                            items={allCtItems}
                            type="hangar"
                            readOnly={true}
                            internalPagination={false}
                        />
                        <div className="mt-4 bg-white dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800">
                            <PaginationContent
                                currentPage={ctCurrentPage}
                                totalPages={Math.ceil(ctTotalCount / ctLimit)}
                                onPageChange={(page) => {
                                    setCtCurrentPage(page);
                                    setCtPointer((page - 1) * ctLimit);
                                }}
                                pointer={ctPointer}
                                totalCount={ctTotalCount}
                                onLimitChange={(limit) => {
                                    setCtLimit(limit);
                                    setCtPointer(0);
                                    setCtCurrentPage(1);
                                }}
                                limit={ctLimit}
                            />
                        </div>
                    </TabsContent>
                </Tabs>

            </div>

        </div>
    );
}
