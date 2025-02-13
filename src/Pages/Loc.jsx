import React, { useEffect, useRef, useState } from "react";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";
import nmp_mapboxgl from "@neshan-maps-platform/mapbox-gl";
import { useNavigate } from "react-router-dom";

const Loc = () => {
  const navigate = useNavigate();

  const [handelblock, setHandelblock] = useState(false);
  const [inputLng, setInputLng] = useState(0);
  const [inputLat, setInputLat] = useState(0);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;
    mapRef.current = new nmp_mapboxgl.Map({
      container: mapContainerRef.current,
      mapType: nmp_mapboxgl.Map.mapTypes.neshanVector,
      zoom: 13,
      pitch: 0,
      center: [51.391173, 35.700954],
      minZoom: 2,
      maxZoom: 21,
      trackResize: true,
      mapKey: "web.8547671c42c24412ba86214076d7941d",
      poi: false,
      traffic: false,
      mapTypeControllerOptions: {
        show: true,
        position: "top-left",
      },
      locationControlOptions: {
        show: true,
        position: "top-right",
      },
    });

    const geolocateControl = new nmp_mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserLocation: true,
    });

    const navControl = new nmp_mapboxgl.NavigationControl();
    mapRef.current.addControl(navControl, "top-right");

    mapRef.current.addControl(geolocateControl, "top-right");

    mapRef.current.on("load", () => {
      const markerElement = document.createElement("div");
      markerElement.innerHTML = `
          <svg width="60" height="60" viewBox="0 0 24 24" fill="red" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 3.37 4.36 8.59 6.26 10.75a1 1 0 0 0 1.48 0C14.64 17.59 19 12.37 19 9c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
          </svg>
        `;
      markerElement.style.width = "60px";
      markerElement.style.height = "60px";

      markerRef.current = new nmp_mapboxgl.Marker({ element: markerElement })
        .setLngLat([51.391173, 35.700954])
        .addTo(mapRef.current);
    });
    mapRef.current.on("click", (event) => {
      const { lng, lat } = event.lngLat;

      if (markerRef.current) {
        markerRef.current.setLngLat([lng, lat]);
      } else {
        markerRef.current = new nmp_mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(mapRef.current);
      }
      setHandelblock(true);
      setInputLng(lng);
      setInputLat(lat);
    });
  }, []);
  const handApileNavigate = () => {
    navigate("/Pricing", { state: { inputLng, inputLat } });
  };
  const handleNavigate = () => {
    navigate("./Pricing");
  };
  return (
    <div>
      <div className="w-full h-[835px]" ref={mapContainerRef} />
      <div className=" absolute bottom-8">
        {handelblock ? (
          <button
            onClick={handApileNavigate}
            className="bg-[#007EA2] p-3 ml-6 rounded-full text-white px-10 hover:bg-cyan-500 hover:shadow-custom"
          >
            انتخاب مبدا
          </button>
        ) : (
          <button className="bg-[#007EA2] p-3 ml-6 rounded-full text-white px-10 opacity-50 cursor-not-allowed">
            انتخاب مبدا
          </button>
        )}
        <button
          onClick={handleNavigate}
          className="bg-[#007EA2] p-3 ml-6 rounded-full text-white px-10 hover:bg-cyan-500 hover:shadow-custom"
        >
          ارسال توسط خودم
        </button>
      </div>
    </div>
  );
};

export default Loc;
