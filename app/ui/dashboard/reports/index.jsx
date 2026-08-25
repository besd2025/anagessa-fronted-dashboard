import React from 'react'
import { ChartAreaInteractive } from './chart-area-interactive'
import { SectionCards } from './SectionCards'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { AlignEndHorizontal, Badge } from 'lucide-react'
import HangarsListTableReports from './hangars'


export default function Reports() {
    return (
        <div><div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <h1 className="text-2xl font-semibold text-foreground px-4 lg:px-6 mb-2">Rapport sur terrain</h1>
                <Tabs
                    defaultValue="outline"
                    className="w-full flex-col justify-start gap-6"
                >
                    <div className="flex items-center justify-between px-4 lg:px-6">

                        <TabsList className=" **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex flex w-full justify-between">
                            <TabsTrigger value="outline"><AlignEndHorizontal />Détails</TabsTrigger>
                            <TabsTrigger value="hangar">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                    <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z" clipRule="evenodd" />
                                </svg>

                                Hangars
                            </TabsTrigger>
                        </TabsList>

                    </div>
                    <TabsContent
                        value="outline"
                        className="relative flex flex-col gap-4 overflow-auto"
                    >
                        <div className="flex flex-col gap-4 md:gap-6 ">
                            <SectionCards />
                            <div className="px-4 lg:px-6">
                                {/* <ChartAreaInteractive /> */}
                            </div>

                        </div>
                    </TabsContent>
                    <TabsContent value="hangar" className="flex flex-col px-4 lg:px-6">
                        <HangarsListTableReports />
                    </TabsContent>
                    <TabsContent
                        value="focus-documents"
                        className="flex flex-col px-4 lg:px-6"
                    >
                        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
                    </TabsContent>
                </Tabs>

            </div>
        </div></div>
    )
}
