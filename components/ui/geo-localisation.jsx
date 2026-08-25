"use client";
import React, { useState, useEffect } from "react";
import {
  Map,
  MapLayerGroup,
  MapLayers,
  MapLayersControl,
  MapLocateControl,
  MapMarker,
  MapPopup,
  MapTooltip,
  MapTileLayer,
  MapZoomControl,
  MapPolyline,
} from "@/components/ui/map";
import { X, MapPin, Waypoints, Check, ChevronsUpDown } from "lucide-react";
import { useMap } from "react-leaflet";
import Link from "next/link";

function MapFlyTo({ position }) {
  const map = useMap();
  React.useEffect(() => {
    if (position) {
      map.flyTo(position, 18, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

function MapPanes() {
  const map = useMap();
  React.useEffect(() => {
    if (!map.getPane("labels")) {
      const pane = map.createPane("labels");
      pane.style.zIndex = 650; // au-dessus des tiles normales
      pane.style.pointerEvents = "none"; // pour ne pas bloquer les clics
    }
  }, [map]);
  return null;
}

function SearchableInput({
  label,
  value,
  onChange,
  options,
  colorClass = "border-gray-500",
}) {
  const [query, setQuery] = useState(value ? value.name : "");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = React.useRef(null);

  useEffect(() => {
    if (value) setQuery(value.name);
    else if (!isOpen) setQuery("");
  }, [value, isOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        // Reset query to selected value on blur if not finding a match could be annoying,
        // but for now let's just close.
        if (value) setQuery(value.name);
        else setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef, value]);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex gap-3 relative" ref={wrapperRef}>
      <div className="mt-2.5">
        <div
          className={`size-3 rounded-full border-2 ${colorClass} bg-white relative z-10`}
        ></div>
      </div>
      <div className="flex-1 relative">
        <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
          {label}
        </label>
        <div className="relative">
          <input
            type="text"
            className="w-full text-sm p-2 bg-gray-50 dark:bg-zinc-800 border-0 rounded-lg focus:ring-2 focus:ring-primary/50 pr-8"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              if (!e.target.value) onChange(null);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Rechercher..."
          />
          <ChevronsUpDown className="absolute right-2 top-2.5 size-4 text-gray-400 pointer-events-none" />
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-zinc-800 rounded-lg shadow-lg z-50 border border-gray-100 dark:border-zinc-700">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((place) => (
                <button
                  key={place.name}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 flex items-center justify-between"
                  onClick={() => {
                    onChange(place);
                    setIsOpen(false);
                  }}
                >
                  <span className="truncate">{place.name}</span>
                  {value?.name === place.name && (
                    <Check className="size-3 text-primary" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-400">
                Aucun résultat
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function GeoLocalisation({
  data = [],
  center = [-3.3896077, 29.9255829],
  zoom = 9,
  selectedPlace = null,
  onSelectPlace = () => { },
  onCloseDetails = () => { },
  flyToPosition = null,
  onLocateError = null,
  children,
  mainMap = false,
}) {
  const [myCoordinates, setMyCoordinates] = useState(null);
  const [isDistanceDrawerOpen, setIsDistanceDrawerOpen] = useState(false);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(null);
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);

  // Flatten the data to get a list of all places for the dropdowns
  const allPlaces = data.flatMap((group) => group.places);

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(2);
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  useEffect(() => {
    async function fetchRoute() {
      if (!origin || !destination) {
        setDistance(null);
        setRouteGeoJSON(null);
        setRouteInfo(null);
        return;
      }

      // Calculate Flight Distance
      const dist = calculateDistance(
        origin.coordinates[0],
        origin.coordinates[1],
        destination.coordinates[0],
        destination.coordinates[1]
      );
      setDistance(dist);

      // Fetch OSRM Route
      // Leaflet coordinates are [lat, lng], OSRM expects [lng, lat]
      const [lat1, lng1] = origin.coordinates;
      const [lat2, lng2] = destination.coordinates;

      const url = `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=full&geometries=geojson`;

      try {
        const res = await fetch(url);
        const json = await res.json();

        if (json?.routes?.length) {
          const r = json.routes[0];
          setRouteGeoJSON(r.geometry); // LineString GeoJSON
          setRouteInfo({
            km: (r.distance / 1000).toFixed(2),
            minutes: Math.round(r.duration / 60),
          });
        } else {
          setRouteGeoJSON(null);
          setRouteInfo(null);
        }
      } catch (error) {
        console.error("Error fetching OSRM route:", error);
        setRouteGeoJSON(null);
        setRouteInfo(null);
      }
    }

    fetchRoute();
  }, [origin, destination]);

  return (
    <div
      className={
        mainMap
          ? "lg:h-[calc(90vh-64px)] h-[calc(100vh-64px)] w-full relative"
          : "lg:h-[calc(70vh-64px)] h-[calc(100vh-64px)] w-full relative"
      }
    >
      {/* Search Bar or other overlays passed as children */}
      {children}

      <div className="absolute top-4 left-4 z-1000 w-full max-w-sm flex flex-col gap-4 pointer-events-none"></div>

      {/* Distance Calculator Drawer - Only visible on mainMap */}
      {mainMap && isDistanceDrawerOpen && (
        <div className="absolute top-20 lg:top-4 right-4 z-2000 w-80 bg-white dark:bg-zinc-900 shadow-xl rounded-xl overflow-hidden animate-in slide-in-from-right-4 duration-300 pointer-events-auto">
          <div className="bg-secondary text-white p-4 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <Waypoints className="size-4" /> Itinéraire
            </h3>
            <button
              onClick={() => setIsDistanceDrawerOpen(false)}
              className="hover:bg-white/20 p-1 rounded-full transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div className="space-y-4 relative">
              {/* Connector Line */}
              <div className="absolute left-4.5 top-8 bottom-8 w-0.5 bg-gray-300 dark:bg-zinc-700 -z-10 border-l-2 border-dotted"></div>

              {/* Origin Input */}
              <SearchableInput
                label="Point de départ"
                value={origin}
                onChange={setOrigin}
                options={allPlaces}
                colorClass="border-gray-500"
              />

              {/* Destination Input */}
              <SearchableInput
                label="Destination"
                value={destination}
                onChange={setDestination}
                options={allPlaces}
                colorClass="border-primary"
              />
            </div>

            {/* Results */}
            {(distance || routeInfo) && (
              <div className="mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-zinc-800 space-y-4">
                {/* Flight Distance */}
                {distance && (
                  <div className="flex items-center justify-between ">
                    <span className="text-xs text-gray-900 dark:text-gray-100">
                      Vol d'oiseau
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-secondary">
                        {distance}
                      </span>
                      <span className="text-xs font-medium text-gray-500">
                        km
                      </span>
                    </div>
                  </div>
                )}

                {/* Road Distance & Time */}
                {routeInfo ? (
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Distance Route
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-primary">
                          {routeInfo.km}
                        </span>
                        <span className="text-sm font-medium text-gray-500">
                          km
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 bg-secondary/10 text-secondary text-center py-2 rounded-lg text-sm font-semibold">
                      ~ {routeInfo.minutes} min{" "}
                      <span className="text-xs font-normal opacity-75">
                        (en voiture)
                      </span>
                    </div>
                  </div>
                ) : (
                  origin &&
                  destination && (
                    <div className="text-xs text-center text-gray-400 italic">
                      Calcul de l'itinéraire routier...
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Details Panel - Positioned absolutely */}
      {selectedPlace && (
        <div
          className={
            mainMap
              ? "absolute top-20 lg:top-24 left-4 z-1000 w-screen lg:w-full max-w-sm flex flex-col gap-4"
              : "absolute top-20 lg:top-4 left-4 z-1000 w-screen lg:w-full max-w-sm flex flex-col gap-4"
          }
        >
          <div className="w-full bg-white/90 dark:bg-zinc-900 rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
            <div className="relative h-24 bg-linear-to-r from-primary/40 to-transparent p-4">
              <button
                onClick={() => {
                  if (onCloseDetails) onCloseDetails();
                  else onSelectPlace(null);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/50 hover:bg-white text-gray-500 transition-colors"
              >
                <X className="size-4" />
              </button>
              <div className="flex items-end h-full gap-4">
                <div className="mb-1 text-white">
                  {/* Find icon from data if possible, or use Place's own icon prop if we restructure */}
                  {data.find((t) => t.name === selectedPlace.type)?.icon}
                </div>
                <div>
                  <span className="text-xs font-bold tracking-wider text-secondary uppercase bg-white/80 px-2 py-0.5 rounded-md mb-1 inline-block">
                    {selectedPlace.type}
                  </span>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {selectedPlace.name}
                  </h2>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs text-gray-500  uppercase tracking-wider mb-1">
                  Address
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <MapPin className="size-4 text-gray-400 mt-0.5 shrink-0" />
                  {selectedPlace.address}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-dashed border-gray-200 dark:border-zinc-800">
                {selectedPlace.type === "UDP" ? (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500  uppercase tracking-wider mb-1">
                      Stock Café Vert
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedPlace.stockmaisVert >= 1000 ? (
                        <>
                          {(selectedPlace.stockmaisVert / 1000).toLocaleString(
                            "fr-FR",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}{" "}
                          <span className="text-sm">T</span>
                        </>
                      ) : (
                        <>
                          {selectedPlace.stockmaisVert?.toLocaleString("fr-FR") || 0}{" "}
                          <span className="text-sm">Kg</span>
                        </>
                      )}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="col-span-2 bg-gray-100 dark:bg-zinc-800/50 p-2.5 rounded-lg border border-dashed">
                      <p className="text-[10px] text-gray-500  uppercase mb-1">
                        Qte Totale CAB
                      </p>
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        {selectedPlace.stockCAB >= 1000 ? (
                          <>
                            {(selectedPlace.stockCAB / 1000).toLocaleString(
                              "fr-FR",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}{" "}
                            <span className="text-sm">T</span>
                          </>
                        ) : (
                          <>
                            {selectedPlace.stockCAB?.toLocaleString("fr-FR") || 0}{" "}
                            <span className="text-sm">Kg</span>
                          </>
                        )}
                      </p>
                    </div>
                    <div className="bg-primary/20 dark:bg-zinc-800/50 p-2.5 rounded-lg border border-dashed">
                      <p className="text-[10px] text-gray-500  uppercase mb-1">
                        Qte CA
                      </p>
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        {selectedPlace.stockCA >= 1000 ? (
                          <>
                            {(selectedPlace.stockCA / 1000).toLocaleString(
                              "fr-FR",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}{" "}
                            <span className="text-sm">T</span>
                          </>
                        ) : (
                          <>
                            {selectedPlace.stockCA?.toLocaleString("fr-FR") || 0}{" "}
                            <span className="text-sm">Kg</span>
                          </>
                        )}
                      </p>
                    </div>
                    <div className="bg-secondary/20 dark:bg-zinc-800/50 p-2.5 rounded-lg border border-dashed">
                      <p className="text-[10px] text-gray-500  uppercase mb-1">
                        Qte CB
                      </p>
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        {selectedPlace.stockCB >= 1000 ? (
                          <>
                            {(selectedPlace.stockCB / 1000).toLocaleString(
                              "fr-FR",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}{" "}
                            <span className="text-sm">T</span>
                          </>
                        ) : (
                          <>
                            {selectedPlace.stockCB?.toLocaleString("fr-FR") || 0}{" "}
                            <span className="text-sm">Kg</span>
                          </>
                        )}
                      </p>
                    </div>
                    <div className="col-span-2 mt-1">
                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 dark:border-zinc-800">
                        <span className="text-xs text-gray-500 font-medium">
                          Caféiculteurs
                        </span>
                        <span className="text-base font-bold text-gray-900 dark:text-white">
                          {selectedPlace.farmersCount}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="px-4 pb-4">
              <Link href={`/anagessa-dashboard/${selectedPlace.type.toLowerCase()}/details?id=${selectedPlace.id}`}>
                <button className="w-full py-2 bg-secondary text-white text-sm font-medium rounded-lg hover:bg-secondary/90 transition-colors shadow-sm">
                  Voir {selectedPlace.name}
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <Map center={center} zoom={zoom} className="h-full w-full rounded-none">
        <MapPanes />
        {flyToPosition && <MapFlyTo position={flyToPosition} />}

        {/* Connection Polyline (Flight) */}
        {origin && destination && (
          <MapPolyline
            positions={[origin.coordinates, destination.coordinates]}
            color="#9ca3af" // Gray for flight path
            dashArray="4"
            weight={2}
            opacity={0.6}
            className="fill-none stroke-secondary"
          />
        )}

        {/* Connection Polyline (Road - OSRM) */}
        {routeGeoJSON && (
          <MapPolyline
            // Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
            positions={routeGeoJSON.coordinates.map(([lng, lat]) => [lat, lng])}
            color="#ea580c" // Orange/Primary for road path
            weight={10}
            opacity={0.9}
            className="fill-none stroke-amber-700 stroke-4"
          />
        )}

        <MapLayers defaultLayerGroups={data.map((place) => place.name)}>
          <MapTileLayer />
          <MapLayerGroup name="Satellite (Street)">
            <MapTileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            <MapTileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
              zIndex={999}
              pane="labels"
            />
          </MapLayerGroup>
          <MapTileLayer
            name="No Labels"
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            darkUrl="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          />

          <div className="absolute top-20 lg:top-4 right-4 z-1000 flex flex-col gap-2 items-center">
            <MapLayersControl className="bg-secondary dark:bg-zinc-800 shadow-lg border-0 rounded-lg size-10 flex items-center justify-center relative top-0 right-0" />
            <MapLocateControl
              onLocationFound={(location) => setMyCoordinates(location.latlng)}
              onLocationError={(error) => {
                if (onLocateError) onLocateError(error);
                else console.error(error);
              }}
              watch
              className="bg-secondary dark:bg-zinc-800 shadow-lg border-0 rounded-lg size-10 flex items-center justify-center relative bottom-0 right-0"
            />
            <MapZoomControl className="bg-secondary dark:bg-zinc-800 shadow-lg border-0 rounded-lg flex flex-col items-center relative top-0 left-0" />

            {/* Waypoints Button - Only visible on mainMap */}
            {mainMap && (
              <Waypoints
                size={38}
                onClick={() => setIsDistanceDrawerOpen(!isDistanceDrawerOpen)}
                className="bg-secondary p-1 cursor-pointer text-white dark:bg-zinc-800 shadow-lg border-0 rounded-lg flex flex-col items-center relative top-0 left-0"
              />
            )}
          </div>

          {data.map((placesGroup) => (
            <MapLayerGroup key={placesGroup.name} name={placesGroup.name}>
              {placesGroup.places.map((place) => (
                <MapMarker
                  key={place.name}
                  position={place.coordinates}
                  icon={placesGroup.mapIcon}
                  iconAnchor={[24, 48]}
                  eventHandlers={{
                    click: () => {
                      onSelectPlace(place);
                    },
                    mouseover: (e) => {
                      e.target.openTooltip();
                    },
                    mouseout: (e) => {
                      e.target.closeTooltip();
                    },
                  }}
                >
                  <MapTooltip
                    direction="top"
                    offset={[0, -48]}
                    opacity={1}
                    className="font-bold text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 border-0 shadow-lg px-3 py-1.5 rounded-lg"
                  >
                    {place.name}
                  </MapTooltip>
                </MapMarker>
              ))}
            </MapLayerGroup>
          ))}
        </MapLayers>

        {myCoordinates && (
          <MapPopup
            position={myCoordinates}
            offset={[0, -5]}
            className="w-56 rounded-xl shadow-xl"
          >
            {myCoordinates.toString()}
          </MapPopup>
        )}
      </Map>
    </div>
  );
}
