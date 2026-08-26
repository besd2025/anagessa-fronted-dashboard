"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { fetchData } from "@/app/_utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Grape,
  MapPinHouse,
  Phone,
  QrCode,
  ShieldUser,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { AddPrevision } from "./add-prevision-hangar";

function DetailsCard({ id }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.innerWidth >= 1024) {
        setIsExpanded(false);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);
  const toggleSidebar = () => setIsExpanded(!isExpanded);
  useEffect(() => {
    const getSdls = async () => {
      setLoading(true);
      try {
        const response = await fetchData("get", `hangars/${id}/`, {
          params: {},
          additionalHeaders: {},
          body: {},
        });

        setData(response);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      } finally {
        setLoading(false);
      }
    };

    getSdls();
  }, [id]);
  return (
    <Card
      className={cn(
        "relative lg:sticky lg:top-5 transition-all duration-300 ease-in-out border-r shadow-sm bg-card rounded-xl h-max",
        isExpanded
          ? "w-full lg:w-[300px] p-6 space-y-4"
          : "w-[80px] p-4 flex flex-col items-center",
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex absolute -right-3 top-6 h-9 w-9 rounded-full border bg-secondary shadow-sm hover:bg-primary dark:hover:bg-primary z-10 text-white hover:text-white cursor-pointer "
            onClick={toggleSidebar}
          >
            {isExpanded ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Voir details</p>
        </TooltipContent>
      </Tooltip>

      {!isExpanded ? (
        <div
          className="flex flex-col items-center gap-4 mt-2"
          onClick={toggleSidebar}
        >
          <div className="w-16 h-16 mx-auto border-2 p-2 border-secondary/50 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-full text-accent-foreground/80"
            >
              <path
                fillRule="evenodd"
                d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-xs font-semibold text-center truncate w-full">
            hangar{" "}
            {data?.hangar_name
              ? data.hangar_name.slice(0, 2).toUpperCase() + "..."
              : "--"}
          </div>
          <Separator className="my-2" />
          <MapPinHouse size={20} />
          <Separator className="my-2" />
          <ShieldUser size={20} />
          <Separator className="my-2" />
          <Phone size={20} />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center space-y-3 text-center animate-in fade-in duration-300">
            <div className="w-32 h-32 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-full text-accent-foreground/80"
              >
                <path
                  fillRule="evenodd"
                  d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="space-y-1">
              {loading ? (
                <Skeleton className="h-7 w-48 mx-auto" />
              ) : (
                <p className="text-xl font-semibold">hangar {data?.hangar_name}</p>
              )}
              <p className="text-lg text-primary font-bold flex flex-row justify-center gap-x-2">
                {""}
              </p>
            </div>
            <Badge
              className="px-3 py-1 text-lg text-secondary rounded "
              variant="outline"
            >
              <QrCode size={30} />
              <span className="">
                {loading ? <Skeleton className="h-6 w-24" /> : data?.hangar_code}
              </span>
            </Badge>
          </div>

          {/* <Button className="w-full bg-black text-white hover:bg-black/90">
        Message
      </Button> */}

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm flex-col gap-y-1">
                <span className="text-muted-foreground flex gap-x-1">
                  <MapPinHouse size={20} />
                  Localité
                </span>
                <span className="font-medium text-right">
                  {loading ? (
                    <Skeleton className="h-5 w-32 ml-auto" />
                  ) : (
                    <>
                      {data?.province}{" "}/{" "}
                      {data?.commune}
                    </>
                  )}
                </span>
              </div>
              <Separator className="my-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm flex-col gap-y-1">
                <span className="text-secondary flex gap-x-1">
                  <ShieldUser size={20} />
                  Responsable
                </span>
                <span className="font-medium text-right">
                  {loading ? (
                    <Skeleton className="h-5 w-32 ml-auto" />
                  ) : (
                    <>
                      {data?.responsable_name}
                    </>
                  )}
                </span>
              </div>
              <Separator className="my-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm ">
                <span className="text-muted-foreground flex gap-x-1">
                  <Phone size={20} />
                  Téléphone
                </span>
                <span className="font-medium">
                  {loading ? (
                    <Skeleton className="h-5 w-24" />
                  ) : (
                    data?.responsable_phone
                  )}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-center"> <AddPrevision sdl_id={data?.id} /></div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

export default DetailsCard;
