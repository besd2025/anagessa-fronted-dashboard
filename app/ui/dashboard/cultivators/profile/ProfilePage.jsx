"use client";
import React, { useContext, useState, useEffect } from "react";
import ProfileCard from "./ProfileCard";
import StatsCard from "./StatsCard";
import ActivityList from "./profile-content";
import Edit from "../edit";
import { useSearchParams } from "next/navigation";
import { UserContext } from "@/app/context/User_Context";
import { fetchData } from "@/app/_utils/api";
import AvancePayment from "../payment/avance";
function ProfilePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const user = useContext(UserContext)
  const [data, setData] = useState([])
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetchData("get", `/cultivators/${id}/`, {
          params: {},
          additionalHeaders: {},
          body: {},
        });
        setData(response)
        console.log("data", response)
      } catch (error) {
        console.error("Error loading cultivator data:", error);
      }
    }
    loadData();
  }, [id]);
  return (
    <div className=" space-y-6">

      <div className="flex justify-end gap-2">
        {data?.in_payment ? (
          <></>
        ) : (
          <>
            {user?.session?.category === "Admin" || user?.session?.category === "Superviseur" ? (

              <Edit cultivator={id} />
            ) : (
              <></>
            )}
          </>
        )}

        {user?.session?.category === "Admin" || user?.session?.category === "Anagessa_Chef_societe" || user?.session?.category === "Superviseur_Regional" ? (
          <>
            <AvancePayment cultivator={id} />
          </>
        ) : ""}

      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <ProfileCard cult_id={id} />

        <div className="relative flex-1 space-y-6 z-10">
          <section className="space-y-4">
            <StatsCard cult_id={id} />
          </section>

          <ActivityList cult_id={id} />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;