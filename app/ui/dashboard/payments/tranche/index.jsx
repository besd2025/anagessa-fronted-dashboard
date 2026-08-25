"use client";
import React from 'react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import EnAttente from './en-attente';
import Validate from './validate';
import Rejected from './rejected';
import Paid from './paid';
import Irregulars from './irregulars';

export default function TrancheDetails() {
    return (
        <div className="bg-sidebar p-4 rounded-lg">
            <h1 className='text-xl font-bold text-foreground mb-4'>1ere Tranche du 01 Avr - 30 Jun 2026</h1>
            <Tabs defaultValue="en_attente" className="w-full">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                    <TabsList className="flex flex-wrap h-auto bg-transparent border-b rounded-none p-0 gap-4">
                        <TabsTrigger
                            value="en_attente"
                            className="rounded-none p-2"
                        >
                            En attente
                        </TabsTrigger>
                        <TabsTrigger
                            value="valide"
                            className="rounded-none p-2"
                        >
                            Validés
                        </TabsTrigger>
                        <TabsTrigger
                            value="rejette"
                            className="rounded-none p-2"

                        >
                            Rejettés
                        </TabsTrigger>
                        <TabsTrigger
                            value="paye"
                            className="rounded-none p-2"
                        >
                            Payés
                        </TabsTrigger>
                        <TabsTrigger
                            value="irregularites"
                            className="rounded-none p-2"

                        >
                            Irrégularités
                        </TabsTrigger>
                    </TabsList>

                </div>

                <TabsContent value="en_attente" className="mt-0">
                    <EnAttente />
                </TabsContent>
                <TabsContent value="valide" className="mt-0">
                    <Validate />
                </TabsContent>
                <TabsContent value="rejette" className="mt-0">
                    <Rejected />
                </TabsContent>
                <TabsContent value="paye" className="mt-0">
                    <Paid />
                </TabsContent>
                <TabsContent value="irregularites" className="mt-0">
                    <Irregulars />
                </TabsContent>
            </Tabs>
        </div>
    )
}
