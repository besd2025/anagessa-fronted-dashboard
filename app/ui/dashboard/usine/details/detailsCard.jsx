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
    const getHangars = async () => {
      setLoading(true);
      try {
        const response = await fetchData(
          "get",
          `mais/usine_deparchage/${id}/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );

        setData(response);
        console.log("Usine details data:", response);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      } finally {
        setLoading(false);
      }
    };

    getHangars();
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
              <path d="M11.584 2.376a.75.75 0 0 1 .832 0l9 6a.75.75 0 1 1-.832 1.248L12 3.901 3.416 9.624a.75.75 0 0 1-.832-1.248l9-6Z" />
              <path
                fillRule="evenodd"
                d="M20.25 10.332v9.918H21a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1 0-1.5h.75v-9.918a.75.75 0 0 1 .634-.74A49.109 49.109 0 0 1 12 9c2.59 0 5.134.202 7.616.592a.75.75 0 0 1 .634.74Zm-7.5 2.418a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Zm3-.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0v-6.75a.75.75 0 0 1 .75-.75ZM9 12.75a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Z"
                clipRule="evenodd"
              />
              <path d="M12 7.875a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" />
            </svg>
          </div>
          <div className="text-xs font-semibold text-center truncate w-full">
            USINE{" "}
            {data?.usine_name
              ? data.usine_name.slice(0, 2).toUpperCase() + "..."
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
                <path d="M11.584 2.376a.75.75 0 0 1 .832 0l9 6a.75.75 0 1 1-.832 1.248L12 3.901 3.416 9.624a.75.75 0 0 1-.832-1.248l9-6Z" />
                <path
                  fillRule="evenodd"
                  d="M20.25 10.332v9.918H21a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1 0-1.5h.75v-9.918a.75.75 0 0 1 .634-.74A49.109 49.109 0 0 1 12 9c2.59 0 5.134.202 7.616.592a.75.75 0 0 1 .634.74Zm-7.5 2.418a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Zm3-.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0v-6.75a.75.75 0 0 1 .75-.75ZM9 12.75a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Z"
                  clipRule="evenodd"
                />
                <path d="M12 7.875a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" />
              </svg>
            </div>
            <div className="space-y-1">
              {loading ? (
                <Skeleton className="h-7 w-48 mx-auto" />
              ) : (
                <p className="text-xl font-semibold">
                  USINE {data?.usine_name}
                </p>
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
                {loading ? <Skeleton className="h-6 w-24" /> : data?.usine_code}
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
                      {
                        data?.usine_adress?.zone_code?.commune_code
                          ?.province_code?.province_name
                      }{" "}
                      /{" "}
                      {
                        data?.usine_adress?.zone_code?.commune_code
                          ?.commune_name
                      }
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
                      {data?.usine_responsable?.user?.first_name}{" "}
                      {data?.usine_responsable?.user?.last_name}
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
                    data?.usine_responsable?.user?.phone
                  )}
                </span>
              </div>
              <Separator className="my-2" />
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

export default DetailsCard;
