"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { fetchData } from "@/app/_utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Grape,
  Layers,
  Layers2,
  MapPinHouse,
  Phone,
  QrCode,
  ChevronLeft,
  ChevronRight,
  User,
  ShieldUser,
  IdCard,
} from "lucide-react";
import Link from "next/link";
import ViewImageDialog from "@/components/ui/view-image-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function ProfileCard({ cult_id }) {
  const [data, setData] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.innerWidth >= 1024) {
        setIsExpanded(false);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const getCultivators = async () => {
      setLoading(true);
      try {
        const response = await fetchData("get", `/cultivators/${cult_id}/`, {
          params: {},
          additionalHeaders: {},
          body: {},
        });
        setData(response);
        console.log("Cultivators data fetched:", response);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      } finally {
        setLoading(false);
      }
    };

    getCultivators();
  }, [cult_id]);

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  return (
    <Card
      className={cn(
        " relative lg:sticky lg:top-5 transition-all duration-300 ease-in-out border-r shadow-sm bg-card rounded-xl h-max",
        isExpanded
          ? "w-full lg:w-[300px] p-6 space-y-4 "
          : "w-[80px] p-4 flex flex-col items-center",
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex absolute -right-3 top-6 h-9 w-9 rounded-full border bg-secondary shadow-sm hover:bg-primary z-10 text-white hover:text-white cursor-pointer "
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
          <p>Voir details du profile</p>
        </TooltipContent>
      </Tooltip>
      {!isExpanded ? (
        <div className="flex flex-col items-center gap-4 mt-2 ">
          <Avatar
            className="h-16 w-16 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={toggleSidebar}
          >
            <AvatarImage
              src={data?.cultivator_photo || null}
              alt={data?.cultivator_first_name}
              className="object-cover"
            />
            <AvatarFallback>
              {data?.cultivator_first_name ? (
                data.cultivator_first_name.slice(0, 2).toUpperCase()
              ) : (
                <User className="h-4 w-4" />
              )}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium">
            {data?.cultivator_first_name
              ? data.cultivator_first_name.slice(0, 2).toUpperCase()
              : "--"}
          </div>
          <Separator className="my-2" />
          <QrCode size={20} />
          <Separator className="my-2" />
          <MapPinHouse size={20} />
          <Separator className="my-2" />
          <Phone size={20} />
          <Separator className="my-2" />
          <Layers size={20} />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center space-y-3 text-center animate-in fade-in duration-300">
            <Avatar className="w-32 h-32 mx-auto">
              {data?.cultivator_entity_type == "personne" ? (
                <>
                  <AvatarImage
                    src={data?.cultivator_photo || null}
                    alt={data?.cultivator_first_name}
                    className="object-cover hidden"
                  />
                  <ViewImageDialog
                    imageUrl={data?.cultivator_photo}
                    className="size-full object-cover"
                  // fallbackUrl=""
                  />
                </>
              ) : (
                <>
                  <AvatarImage
                    src={data?.cultivator_photo || null}
                    alt={data?.cultivator_assoc_name}
                    className="object-cover "
                  />
                  <ViewImageDialog
                    imageUrl={data?.cultivator_photo}
                    className="size-full object-cover"
                  />
                </>
              )}

              {/* <AvatarFallback>
                {[data?.cultivator_first_name, data?.cultivator_last_name]
                  .filter(Boolean)
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback> */}
            </Avatar>
            <div className="space-y-1 flex flex-col items-center gap-y-2">
              {loading ? (
                <Skeleton className="h-7 w-48 mx-auto" />
              ) : (
                <p className="text-xl font-semibold">
                  {data?.cultivator_entity_type === "personne"
                    ? data?.cultivator_first_name +
                    " " +
                    data?.cultivator_last_name
                    : data?.cultivator_assoc_name}
                </p>
              )}
              {data?.cultivator_entity_type === "personne" ? (
                <p className="text-sm text-muted-foreground flex flex-row gap-x-2">
                  <Grape className="text-primary size-5" />
                  cultivateur
                </p>
              ) : (
                <p className="text-sm text-muted-foreground flex flex-row gap-x-2">
                  <Grape className="text-primary size-5" />
                  association des cultivateurs
                </p>
              )}
            </div>
            <Badge
              className="px-3 py-1 text-lg text-secondary rounded "
              variant="outline"
            >
              <QrCode size={30} />
              <span className="">
                {loading ? (
                  <Skeleton className="h-6 w-24" />
                ) : (
                  data?.cultivator_code
                )}
              </span>
            </Badge>
          </div>

          <div className="space-y-3">
            {data?.cultivator_entity_type !== "personne" ? (
              <>
                <div>
                  <div className="flex items-center justify-between text-sm flex-col gap-y-1">
                    <span className="text-muted-foreground">Représentant</span>
                    <span className="font-medium text-center">
                      {loading ? (
                        <Skeleton className="h-5 w-32 mx-auto" />
                      ) : (
                        data?.cultivator_assoc_rep_name
                      )}
                    </span>
                  </div>
                  <Separator className="my-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm flex-col gap-y-1">
                    <span className="text-muted-foreground">NIF</span>
                    <span className="font-medium">
                      {loading ? (
                        <Skeleton className="h-5 w-24 mx-auto" />
                      ) : (
                        data?.cultivator_assoc_nif
                      )}
                    </span>
                  </div>
                  <Separator className="my-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm flex-col gap-y-1">
                    <span className="text-muted-foreground">Numéro Fiche</span>
                    <span className="font-medium">
                      {data?.cultivator_assoc_numero_fiche}
                    </span>
                  </div>
                  <Separator className="my-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm flex-col gap-y-1">
                    <span className="text-muted-foreground">
                      Tel Représentant
                    </span>
                    <span className="font-medium">
                      {loading ? (
                        <Skeleton className="h-5 w-24 mx-auto" />
                      ) : (
                        data?.cultivator_assoc_rep_phone
                      )}
                    </span>
                  </div>
                  <Separator className="my-2" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="flex items-center justify-between text-sm flex-col gap-y-1">
                    <span className="text-muted-foreground">Numéro Fiche</span>
                    <span className="font-medium">
                      {data?.cultivator_assoc_numero_fiche}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm flex-col gap-y-1">
                    <span className="text-muted-foreground">CNI</span>

                    <div className="flex items-center gap-3">
                      <ViewImageDialog
                        imageUrl={data?.cultivator_cni_photo || null}
                        alt="CNI"
                        profile={false}
                      />
                      <div>
                        <span className="">
                          <span className="flex justify-center items-center font-medium">
                            <IdCard size={18} /> :{" "}
                            {loading ? (
                              <Skeleton className="h-5 w-24 mx-auto" />
                            ) : (
                              data?.cultivator_cni
                            )}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm flex-col gap-y-1">
                    <span className="text-muted-foreground">
                      Date de Naissance
                    </span>
                    <span className="font-medium">
                      {loading ? (
                        <Skeleton className="h-5 w-24 mx-auto" />
                      ) : (
                        data?.date_naissance
                      )}
                    </span>
                  </div>
                  <Separator className="my-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm ">
                    <span className="text-muted-foreground">Sexe</span>
                    <span className="font-medium">
                      {loading ? (
                        <Skeleton className="h-5 w-20 ml-auto" />
                      ) : (
                        data?.cultivator_gender
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
                        <Skeleton className="h-5 w-24 ml-auto" />
                      ) : (
                        data?.cultivator_telephone
                      )}
                    </span>
                  </div>
                  <Separator className="my-2" />
                </div>
              </>
            )}

            <div>
              <div className="flex items-center justify-between text-sm flex-col gap-y-1">
                <span className="text-muted-foreground flex gap-x-1">
                  <MapPinHouse size={20} />
                  Localité
                </span>
                <span className="font-medium text-right">
                  {
                    data?.cultivator_adress?.zone_code?.commune_code
                      ?.commune_name
                  }
                  /{data?.cultivator_adress?.zone_code?.zone_name}/
                  {data?.cultivator_adress?.colline_name}
                </span>
              </div>
              <Separator className="my-2" />
            </div>
            <div>
              {/* <div className="flex items-center justify-between text-sm ">
                <span className="text-muted-foreground flex gap-x-1">
                  <Layers size={20} /> Champs
                </span>
                <span className="font-medium">2</span>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="p-0">
                      details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Champs du cultivateur</DialogTitle>
                      <div className="mt-2 flex flex-col gap-y-2">
                        <div className="#Champ1 border rounded p-2">
                          <h1 className="flex gap-x-2 bg-primary w-max items-center py-1 px-2 rounded-lg text-primary-foreground">
                            <Layers2 size={20} /> Champ 1
                          </h1>
                          <div className="mt-2 flex flex-col gap-y-2">
                            <div className="flex items-center justify-between text-sm ">
                              <span className="text-muted-foreground">
                                Superficie
                              </span>
                              <span className="font-medium">7.5 ha</span>
                            </div>
                            <div className="flex items-center justify-between text-sm ">
                              <span className="text-muted-foreground">
                                Nombre de pieds
                              </span>
                              <span className="font-medium">400</span>
                            </div>
                            <div className="flex items-center justify-between text-sm ">
                              <span className="text-muted-foreground flex gap-x-1">
                                <MapPinHouse size={20} />
                                Localité
                              </span>
                              <span className="font-medium text-right">
                                bujumbura
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="#Champ2 border rounded p-2">
                          <h1 className="flex gap-x-2 bg-primary w-max items-center py-1 px-2 rounded-lg text-primary-foreground">
                            <Layers2 size={20} /> Champ 2
                          </h1>
                          <div className="mt-2 flex flex-col gap-y-2">
                            <div className="flex items-center justify-between text-sm ">
                              <span className="text-muted-foreground">
                                Superficie
                              </span>
                              <span className="font-medium">7.5 ha</span>
                            </div>
                            <div className="flex items-center justify-between text-sm ">
                              <span className="text-muted-foreground">
                                Nombre de pieds
                              </span>
                              <span className="font-medium">400</span>
                            </div>
                            <div className="flex items-center justify-between text-sm ">
                              <span className="text-muted-foreground flex gap-x-1">
                                <MapPinHouse size={20} />
                                Localité
                              </span>
                              <span className="font-medium text-right">
                                BUBANZA
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div> */}
            </div>
            <div>
              {/* <div className="flex items-center justify-between text-sm ">
                <span className="text-muted-foreground">hangar / Hangar</span>
                <Link href="/anagessa-dashboard/hangarss/details">
                  <Button variant="link" className="p-0">
                    BUHANZA
                  </Button>
                </Link>
              </div> */}
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

export default ProfileCard;
