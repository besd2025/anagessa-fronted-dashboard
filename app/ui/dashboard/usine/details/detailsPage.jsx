"use client";
import React,{useContext} from "react";
import StatsCard from "./StatsCard";
import Edit from "../edit";
import DetailsCard from "./detailsCard";
import DetailsContent from "./details-content";
import { useSearchParams } from "next/navigation";
import { UserContext } from "@/app/context/User_Context";
function DetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
       const user=useContext(UserContext)
  return (
    <div className=" space-y-6">
                   {user?.session?.category==="Admin"?(
             <div className="flex justify-end gap-2">
        <Edit id={id} />
      </div>):""}
      <div className="flex flex-col lg:flex-row gap-4">
        <DetailsCard id={id} />

        <div className="flex-1 space-/y-6">
          <section className="space-y-4">{/* <StatsCard id={id} /> */}</section>

          <DetailsContent id={id} />
        </div>
      </div>
    </div>
  );
}

export default DetailsPage;
