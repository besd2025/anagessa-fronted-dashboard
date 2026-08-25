"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { fetchData } from "@/app/_utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  MapPin,
  Phone,
  User,
  ChevronLeft,
  ChevronRight,
  QrCode,
  MapPinHouse,
  ShieldUser,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

function DetailsCard({ id }) {
  const [data, setData] = useState(null);
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
    const getSociety = async () => {
      setLoading(true);
      try {
        const response = await fetchData("get", `mais/societes/${id}/`, {});
        setData(response);
      } catch (error) {
        console.error("Error fetching society data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      getSociety();
    }
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
          className="flex flex-col items-center gap-4 mt-2 cursor-pointer"
          onClick={toggleSidebar}
        >
          <div className="w-16 h-16 mx-auto border-2 p-2 border-secondary/50 rounded-full flex items-center justify-center bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-8 text-primary"
            >
              <path
                fillRule="evenodd"
                d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z"
                clipRule="evenodd"
              />
              <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
            </svg>
          </div>
          <div className="text-xs font-semibold text-center truncate w-full">
            S.{" "}
            {data?.nom_societe
              ? data.nom_societe.slice(0, 5).toUpperCase() + "..."
              : "--"}
          </div>
          {/* <Separator className="my-2" />
          <MapPinHouse size={20} />
          <Separator className="my-2" />
          <ShieldUser size={20} />
          <Separator className="my-2" />
          <Phone size={20} /> */}
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center space-y-3 text-center animate-in fade-in duration-300">
            <div className="w-32 h-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-16 text-primary"
              >
                <path
                  fillRule="evenodd"
                  d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z"
                  clipRule="evenodd"
                />
                <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
              </svg>
            </div>
            <div className="space-y-1">
              {loading ? (
                <Skeleton className="h-7 w-48 mx-auto" />
              ) : (
                <p className="text-xl font-bold break-all">
                  {data?.nom_societe}
                </p>
              )}
            </div>
            <Badge
              className="px-3 py-1 text-lg text-secondary rounded "
              variant="outline"
            >
              <QrCode size={30} className="mr-2" />
              <span>
                {loading ? (
                  <Skeleton className="h-6 w-24" />
                ) : (
                  data?.code_societe
                )}
              </span>
            </Badge>
          </div>

          {/* <div className="space-y-3 pt-4 border-t">
            <div>
              <div className="flex items-center justify-between text-sm flex-col gap-y-1">
                <span className="text-muted-foreground flex gap-x-1">
                  <User size={20} />
                  Responsable
                </span>
                <span className="font-medium text-right">
                  {loading ? (
                    <Skeleton className="h-5 w-32 ml-auto" />
                  ) : (
                    <>
                      {data?.responsable?.user?.first_name}{" "}
                      {data?.responsable?.user?.last_name}
                    </>
                  )}
                </span>
              </div>
              <Separator className="my-2" />
            </div> 
            
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex gap-x-1">
                  <Phone size={20} />
                  Contact
                </span>
                <span className="font-medium">
                  {loading ? (
                    <Skeleton className="h-5 w-24" />
                  ) : (
                    data?.responsable?.user?.phone || "N/A"
                  )}
                </span>
              </div>
              <Separator className="my-2" />
            </div> 

            <div>
              <div className="flex items-center justify-between text-sm flex-col gap-y-1">
                <span className="text-muted-foreground flex gap-x-1">
                  <MapPin size={20} />
                  Adresse
                </span>
                <div className="text-sm text-right font-medium">
                  {loading ? (
                    <Skeleton className="h-5 w-40 ml-auto" />
                  ) : (
                    <>
                      <p>
                        {
                          data?.adresse?.zone_code?.commune_code?.province_code
                            ?.province_name
                        }
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {data?.adresse?.zone_code?.commune_code?.commune_name},{" "}
                        {data?.adresse?.zone_code?.zone_name}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div> */}
        </>
      )}
    </Card>
  );
}

export default DetailsCard;
