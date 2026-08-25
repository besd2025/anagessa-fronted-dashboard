"use client";
import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Eye } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PaginationContent from '@/components/ui/pagination-content';
import { fetchData } from '@/app/_utils/api';
import { UserContext } from '@/app/context/User_Context';
export const metadata = {
    title: "Historique des Rapports | ANAGESSA",
};
export default function ReportsPage() {
    const user = useContext(UserContext)
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [pointer, setPointer] = useState(0);
    const [allCollectors, setAllCollectors] = useState([])
    const [totalCount, setTotalCount] = useState(0);
    const [reports, setReports] = useState([])

    React.useEffect(() => {

        const fetchReports = async () => {
            try {
                const response = await fetchData("get", `mais/rapportages_sdl_ct_semaine/`);
                const pastReports = response?.results?.map((item) => ({
                    id: item.id,
                    week: item.semaine,
                    dates: item?.week_beginning + " - " + item?.week_end,
                    totalCa: item.quantite_grains_a,
                    totalCb: item.quantite_grains_b,
                    status: item.statut,
                }))
                setReports(pastReports);
                setTotalCount(response?.count);
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };
        fetchReports();
    }, []);

    const onPageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setPointer((pageNumber - 1) * limit);
    };

    const onLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPointer(0);
        setCurrentPage(1);
    };

    return (
        <div className="p-1 md:p-8 space-y-6 max-w-7xl mx-auto flex flex-col min-h-screen">
            <div className="flex flex-col gap-y-4 px-2 lg:flex-row lg:justify-between lg:items-center w-full">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Rapports Hebdomadaires
                    </h1>
                    <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
                        Gérez et soumettez vos rapports de Hangar et centre de traitement.
                    </p>
                </div>
                {user?.session?.category !== "General" && user?.session?.category !== "ANAGESSA" && user?.session?.category !== "mais_Responsable" && (
                    <Link href="/anagessa-dashboard/reports/saisie">
                        <Button size="lg" className="flex gap-2">
                            <Plus className="w-5 h-5" />
                            Nouveau Rapport
                        </Button>
                    </Link>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Historique des soumissions</CardTitle>
                    <CardDescription>Consultez vos rapports précédents.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md overflow-x-auto w-full">
                        <Table className="lg:min-w-[800px] min-w-full">
                            <TableHeader>
                                <TableRow>
                                    {/* <TableHead className="w-[150px]">Semaine</TableHead> */}
                                    <TableHead>Période</TableHead>
                                    <TableHead>Total CA</TableHead>
                                    <TableHead>Total CB</TableHead>
                                    {/* <TableHead>Auteur</TableHead> */}
                                    {/* <TableHead>Statut</TableHead> */}
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reports.map((report) => (
                                    <TableRow key={report.id}>
                                        {/* <TableCell className="font-medium">{report.week}</TableCell> */}
                                        <TableCell>{report.dates}</TableCell>
                                        <TableCell>{report.totalCa.toLocaleString()} kg</TableCell>
                                        <TableCell>{report.totalCb.toLocaleString()} kg</TableCell>
                                        {/* <TableCell>{report.author}</TableCell> */}
                                        {/* <TableCell>
                                            <Badge variant="secondary" >
                                                {report.status}
                                            </Badge>
                                        </TableCell> */}
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">
                                                <Link href={`/anagessa-dashboard/reports/details?id_rapport=${report.id}`} className="flex items-center">
                                                    <Eye className="w-4 h-4 mr-2" /> Voir
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 py-4">
                            <div className="flex-1 text-sm text-muted-foreground"></div>
                            <PaginationContent
                                datapaginationlimit={() => { }}
                                currentPage={currentPage}
                                totalPages={Math.ceil(totalCount / limit)}
                                onPageChange={onPageChange}
                                pointer={pointer}
                                totalCount={totalCount}
                                onLimitChange={onLimitChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
