"use client";
import React from "react";
import SocietiesListTable from "./list";
import AddSociety from "./add-society";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/app/context/User_Context";
export default function SocietiesList() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const user = useContext(UserContext)
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold m-2">
        Liste des Sociétés
      </h1>
      {user?.session?.category === "Admin" ? (
        <div className="flex justify-end gap-2 mb-2">
          <AddSociety id={id} /> {/* <Edit id={id} /> */}
        </div>) : ""}
      <SocietiesListTable />
    </div>
  );
}
