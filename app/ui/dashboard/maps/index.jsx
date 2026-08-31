"use client";
import React, { useEffect, useState } from "react";
import SharedGeoLocalisation from "@/components/ui/geo-localisation";
import { Search, X, MapPin } from "lucide-react";
import { fetchData } from "@/app/_utils/api";

const TYPE_TEMPLATE = [
  {
    name: "Hangar",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10 text-secondary drop-shadow-xl">
        <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z" clipRule="evenodd" />
      </svg>
    ),
    mapIcon: (
      <div className="relative size-16 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="currentColor" className="absolute inset-0 size-full text-secondary/50 drop-shadow-xl z-0">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        </svg>
        <div className="absolute -top-2 inset-0 flex items-center justify-center z-999">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white drop-shadow-md">
            <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    )
  },
  {
    name: "hangar",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10 text-red-500 drop-shadow-xl">
        <path fillRule="evenodd" d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z" clipRule="evenodd" />
      </svg>
    ),
    mapIcon: (
      <div className="relative size-16 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="currentColor" className="absolute inset-0 size-full text-red-500/50 drop-shadow-xl z-0">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        </svg>
        <div className="absolute -top-2 inset-0 flex items-center justify-center z-999">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white drop-shadow-md">
            <path fillRule="evenodd" d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    )
  },
  {
    name: "UDP",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10 text-yellow-500 drop-shadow-xl">
        <path d="M11.584 2.376a.75.75 0 0 1 .832 0l9 6a.75.75 0 1 1-.832 1.248L12 3.901 3.416 9.624a.75.75 0 0 1-.832-1.248l9-6Z" />
        <path fillRule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1 0-1.5h.75v-9.918a.75.75 0 0 1 .634-.74A49.109 49.109 0 0 1 12 9c2.59 0 5.134.202 7.616.592a.75.75 0 0 1 .634.74Zm-7.5 2.418a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Zm3-.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0v-6.75a.75.75 0 0 1 .75-.75ZM9 12.75a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Z" clipRule="evenodd" />
        <path d="M12 7.875a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" />
      </svg>
    ),
    mapIcon: (
      <div className="relative size-16 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="currentColor" className="absolute inset-0 size-full text-yellow-500/50 drop-shadow-xl z-0">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        </svg>
        <div className="absolute -top-2 inset-0 flex items-center justify-center z-999">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white drop-shadow-md">
            <path d="M11.584 2.376a.75.75 0 0 1 .832 0l9 6a.75.75 0 1 1-.832 1.248L12 3.901 3.416 9.624a.75.75 0 0 1-.832-1.248l9-6Z" />
            <path fillRule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1 0-1.5h.75v-9.918a.75.75 0 0 1 .634-.74A49.109 49.109 0 0 1 12 9c2.59 0 5.134.202 7.616.592a.75.75 0 0 1 .634.74Zm-7.5 2.418a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Zm3-.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0v-6.75a.75.75 0 0 1 .75-.75ZM9 12.75a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Z" clipRule="evenodd" />
            <path d="M12 7.875a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" />
          </svg>
        </div>
      </div>
    )
  }
];

export default function Maps() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const [data, setData] = useState([
    { ...TYPE_TEMPLATE[0], places: [] },
    { ...TYPE_TEMPLATE[1], places: [] },
    { ...TYPE_TEMPLATE[2], places: [] }
  ]);
  const [loading, setLoading] = useState(true);

  // States for filter and search parameters
  const [filterData, setFilterData] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadAllMapData = async () => {
      setLoading(true);
      try {
        const response = await fetchData("get", "site_aggregates/", {
          params: {},
          additionalHeaders: {},
          body: {},
        });

        const aggregates = Array.isArray(response) ? response : [];
        const hangarPlaces = aggregates
          .filter((item) => item?.latitude && item?.longitude)
          .map((item, index) => {
            const province =
              item?.hangar?.hangar_adress?.commune_code?.province_code
                ?.province_name || item?.hangar?.province || "";
            const commune =
              item?.hangar?.hangar_adress?.commune_code?.commune_name ||
              item?.hangar?.commune || "";
            const zone =
              item?.hangar?.hangar_adress?.zone_name || item?.hangar?.zone || "";

            return {
              id: item?.hangar?.id || index,
              name: item?.hangar?.hangar_name || item?.site_name || "Hangar",
              coordinates: [parseFloat(item.latitude), parseFloat(item.longitude)],
              type: "Hangar",
              address: `${province}, ${commune}${zone ? ` (${zone})` : ""}`,
              stockCA: item?.quantity_total_blanc || 0,
              stockCB: item?.quantity_total_jaune || 0,
              stockCAB:
                (item?.quantity_total_blanc || 0) +
                (item?.quantity_total_jaune || 0),
              farmersCount: item?.total_cultivators || 0,
            };
          });

        if (isMounted) {
          const finalMapData = [
            {
              ...TYPE_TEMPLATE[0], // Hangar
              places: hangarPlaces,
            },
          ];

          setData(finalMapData);
        }
      } catch (error) {
        console.error("Error loading map data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAllMapData();

    return () => {
      isMounted = false;
    };
  }, [filterData, search]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = [];
    data.forEach((type) => {
      type.places.forEach((place) => {
        if (place.name.toLowerCase().includes(query.toLowerCase())) {
          results.push(place);
        }
      });
    });
    setSearchResults(results);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSelectResult = (place) => {
    setSelectedPosition(place.coordinates);
    setSearchQuery(place.name);
    setSearchResults([]);
    setSelectedPlace(place);
  };

  return (
    <SharedGeoLocalisation
      data={data}
      selectedPlace={selectedPlace}
      onSelectPlace={handleSelectResult} // Also triggers updating search state from map clicks
      onCloseDetails={() => setSelectedPlace(null)}
      flyToPosition={selectedPosition}
      mainMap={true}
    >
      <div className="absolute top-4 left-4 z-1000 w-screen lg:w-full max-w-sm flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher Hangar/hangar/UDP..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full h-12 pl-12 pr-10 bg-white dark:bg-zinc-800 shadow-lg rounded-xl text-sm  focus:outline-hidden placeholder:text-gray-400"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="size-5" />
          </div>
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="w-full bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700 overflow-hidden max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => handleSelectResult(result)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-700/50 text-left transition-colors border-b border-gray-50 last:border-0"
              >
                <MapPin className="size-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {result.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </SharedGeoLocalisation>
  );
}
