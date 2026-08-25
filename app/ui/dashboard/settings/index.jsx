import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileUser from "./profile";
import UsersContent from "./users/UsersContent";
import ChefSocietesContent from "./chef_societtes/ChefSocietesContent";
import SupervisorsContent from "./supervisors/SuperviseursContent.jsx";
import UsinesContent from "./usine/UsinesContent";
import LaboUsersContent from "./laboratoire/LaboUsersContent";

const tabs = [
  { name: 'Generale', value: 'profil' },
  { name: 'Utilisateurs', value: 'users' },
  { name: 'chef_societes', value: 'chef_societes' },
  { name: 'superviseurs', value: 'superviseurs' },
  { name: 'Usines', value: 'Usines' },
  { name: 'Laboratoires', value: 'Laboratoires' }

]


export default function Settings() {
  return (
    <div className="flex flex-col gap-6 bg-card p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
        </div>
      </div>
      <Tabs defaultValue='profil' className='gap-4'>
        <TabsList className='h-fit! w-full rounded-none border-b bg-transparent p-0 sm:justify-start'>
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className='data-[state=active]:border-primary dark:data-[state=active]:border-primary rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none! sm:flex-0 dark:data-[state=active]:bg-transparent px-6'
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="profil" className="pt-4">
          <ProfileUser />
        </TabsContent>
        <TabsContent value="users" className="pt-4">
          <UsersContent />
        </TabsContent>
        <TabsContent value="chef_societes" className="pt-4">
          <ChefSocietesContent />
        </TabsContent>
        <TabsContent value="superviseurs" className="pt-4">
          <SupervisorsContent />
        </TabsContent>
        <TabsContent value="Usines" className="pt-4">
          <UsinesContent />
        </TabsContent>
        <TabsContent value="Laboratoires" className="pt-4">
          <LaboUsersContent />
        </TabsContent>
      </Tabs>
    </div>
  )
}
