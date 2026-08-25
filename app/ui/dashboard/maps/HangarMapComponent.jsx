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

function HangarMapComponent({ data = [], onMarkerClick, selectedHangar }) {
  const [geoData, setGeoData] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredHangars, setFilteredHangars] = useState([]);
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

  if (!mounted) return null;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
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
            zoom={11} // ou le zoom que vous souhaitez
          />
        )}
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="Carte Standard">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked name="Vue Satellite">
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

export default HangarMapComponent;
