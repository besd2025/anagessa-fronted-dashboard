"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  Tooltip,
  LayersControl, // Ajoutez ceci
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { Dropdown } from "../ui_elements/dropdown/dropdown_cultvators";
import DropdownItem from "../ui_elements/dropdown/DropdownItem";

function FlyToOnSelect({ position, zoom, onFlyEnd }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, zoom, { duration: 1.5 });
      const handleMoveEnd = () => {
        if (onFlyEnd) onFlyEnd();
        map.off("moveend", handleMoveEnd);
      };
      map.on("moveend", handleMoveEnd);
    }
    // Cleanup in case component unmounts before moveend
    return () => {
      map.off("moveend");
    };
  }, [position, zoom, map, onFlyEnd]);
  return null;
}

function MapComponent({ data = [], onMarkerClick, onFilterClick }) {
  const [geoData, setGeoData] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredHangars, setFilteredHangars] = useState([]);
  const [selectedHangar, setSelectedHangar] = useState(null);
  const [center, setCenter] = useState([-3.3896077, 29.9255829]);
  const [baseLayer, setBaseLayer] = useState("satellite"); // NEW
  const mapRef = useRef();

  useEffect(() => {
    setMounted(true);
    fetch("/data/Burundi-map.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data));
  }, []);

  // Listen for base layer change
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const handleBaseLayerChange = (e) => {
      if (e.name === "Vue Satellite") {
        setBaseLayer("satellite");
      } else {
        setBaseLayer("standard");
      }
    };
    map.on("baselayerchange", handleBaseLayerChange);
    return () => {
      map.off("baselayerchange", handleBaseLayerChange);
    };
  }, [mounted]);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredHangars([]);
    } else {
      setFilteredHangars(
        data.filter((h) =>
          (h.name || "").toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, data]);

  if (!mounted) return null;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Barre de recherche */}
      <div
        style={{
          position: "absolute",
          zIndex: 1000,
          top: 16,
          left: 70,
          // width: 300,
        }}
        className="w-[60%] lg:w-[300px]"
      >
        <form>
          <div className="relative ">
            <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
              <svg
                className="fill-gray-500 dark:fill-gray-400"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Rechercher un hangar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="dark:bg-dark-900 h-11 w-[100%] rounded-lg border border-gray-200  py-2.5 pl-12 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-yellow-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 bg-white dark:bg-gray-800  dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-yellow-800 xl:w-[250px]"
            />
          </div>
        </form>

        {filteredHangars.length > 0 && (
          <ul
            style={{
              background: "white",
              border: "1px solid #ccc",
              borderRadius: 4,
              margin: 0,
              padding: 0,
              listStyle: "none",
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            <Dropdown
              isOpen={filteredHangars.length > 0}
              onClose={() => setFilteredHangars([])}
              className="w-max max-h-[60vh] p-2 overflow-auto"
            >
              {filteredHangars.map((h, idx) => (
                <DropdownItem
                  key={idx}
                  onItemClick={() => {
                    setSelectedHangar(h);
                    setSearch("");
                    setFilteredHangars([]);
                    onFilterClick(h);
                  }}
                  className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {h.name}
                    </p>
                    <span className=" text-xs leading-normal text-gray-500 dark:text-gray-400">
                      {h.province + " / " + h.commune + " / " + h.zone}
                    </span>
                  </div>
                </DropdownItem>
              ))}
            </Dropdown>
          </ul>
        )}
      </div>
      <MapContainer
        center={center}
        zoom={9}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        {selectedHangar && (
          <FlyToOnSelect
            position={[selectedHangar.latitude, selectedHangar.longitude]}
            zoom={18} // ou le zoom que vous souhaitez
            onFlyEnd={() => setSelectedHangar(null)}
          />
        )}
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Carte Standard">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Vue Satellite">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </LayersControl.BaseLayer>
        </LayersControl>
        {/* Markers for each hangar */}
        {data.map((hangar, idx) => (
          <Marker
            key={idx}
            position={[hangar.latitude, hangar.longitude]}
            eventHandlers={{
              mouseover: (e) => {
                e.target.openPopup();
              },
              mouseout: (e) => {
                e.target.closePopup();
              },
              click: () => {
                if (onMarkerClick) {
                  onMarkerClick(hangar);
                }
                setSelectedHangar(hangar);
              },
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -10]}
              opacity={1}
              permanent={false}
            >
              {hangar.name}
            </Tooltip>
          </Marker>
        ))}
        {geoData && (
          <GeoJSON
            data={geoData}
            style={() => ({
              color: baseLayer == "satellite" ? "white" : "black", // or "black" for standard
              weight: 0.2,
              fillOpacity: 0,
              opacity: 0.5,
            })}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default MapComponent;
