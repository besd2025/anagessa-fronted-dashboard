"use client";
import React from "react";
import GeoLocalisation from "@/components/ui/geo-localisation";
import { fetchData } from "@/app/_utils/api";
import { MapPin } from "lucide-react";

export default function CultivatorMap({ cult_id }) {
  const [places, setPlaces] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [center, setCenter] = React.useState([-3.3896077, 29.9255829]); // Default center
  const [flyToPosition, setFlyToPosition] = React.useState(null);
  const [selectedPlace, setSelectedPlace] = React.useState(null);

  React.useEffect(() => {
    const getCultivator = async () => {
      setLoading(true);
      try {
        const response = await fetchData("get", `/cultivators/${cult_id}/`, {
          params: {},
          additionalHeaders: {},
          body: {},
        });

        const lat = response?.latitude || -3.3896077;
        const lng = response?.longitude || 29.9255829;

        const cultivatorName =
          response?.cultivator_entity_type === "personne"
            ? `${response?.cultivator_first_name} ${response?.cultivator_last_name}`
            : response?.cultivator_assoc_name;

        const placeData = {
          name: cultivatorName || "Cultivateur",
          type: "Cultivateur",
          coordinates: [lat, lng],
          address: `${
            response?.cultivator_adress?.zone_code?.commune_code
              ?.commune_name || ""
          } ${response?.cultivator_adress?.colline_name || ""}`,
          stockmaisVert: 0,
          farmersCount: 1,
        };

        const mapData = [
          {
            name: "Cultivateur",

            mapIcon: (
              <div className="relative size-16 flex items-center justify-center">
                {/* PIN */}
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="absolute inset-0 size-full text-red-500/50 drop-shadow-xl z-0"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                </svg>
                {/* ICON CENTER */}
                <div className="absolute -top-2 inset-0 flex items-center justify-center z-999">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 text-white drop-shadow-md"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            ),
            places: [placeData],
          },
        ];

        setPlaces(mapData);
        setCenter([lat, lng]);

        // Trigger FlyTo animation
        setTimeout(() => {
          setFlyToPosition([lat, lng]);
        }, 500);
      } catch (error) {
        console.error("Error fetching cultivator data for map:", error);
      } finally {
        setLoading(false);
      }
    };

    if (cult_id) {
      getCultivator();
    }
  }, [cult_id]);

  if (loading) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center bg-gray-50 rounded-lg">
        Chargement de la carte...
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border shadow-sm h-[600px]">
      <GeoLocalisation
        data={places}
        center={center}
        zoom={13}
        mainMap={false}
        flyToPosition={flyToPosition}
        // selectedPlace={selectedPlace}
        // onSelectPlace={setSelectedPlace}
        // onCloseDetails={() => setSelectedPlace(null)}
      />
    </div>
  );
}
