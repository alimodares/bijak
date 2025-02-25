import React, { useEffect, useRef, useState } from "react";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";
import nmp_mapboxgl from "@neshan-maps-platform/mapbox-gl";
import { useNavigate } from "react-router-dom";

const Loc = () => {
  const navigate = useNavigate();

  const [handelblock, setHandelblock] = useState(false);
  const [inputLng, setInputLng] = useState(0);
  const [inputLat, setInputLat] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const debounceTimeout = useRef(null);

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
        show: false,
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

  useEffect(() => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api.neshan.org/v1/search?term=${encodeURIComponent(
            searchQuery
          )}&lat=35.700954&lng=51.391173`,
          {
            headers: { "Api-Key": "service.81590f575b4a471c800fd48d30592428" },
          }
        );
        const data = await response.json();
        setSuggestions(data.items || []);
      } catch (error) {
        console.error("خطا در جستجو:", error);
      }
    }, 10);

    return () => clearTimeout(debounceTimeout.current);
  }, [searchQuery]);

  const handleSelectSuggestion = (location) => {
    markerRef.current.setLngLat([location.x, location.y]);
    setHandelblock(true);
    setInputLng(location.x);
    setInputLat(location.y);
    mapRef.current.flyTo({ center: [location.x, location.y], zoom: 15 });
    setSearchQuery("");
    setSuggestions([]);
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const response = await fetch(
        `https://api.neshan.org/v1/search?term=${encodeURIComponent(
          searchQuery
        )}&lat=35.700954&lng=51.391173`,
        {
          headers: { "Api-Key": "service.81590f575b4a471c800fd48d30592428" },
        }
      );
      const data = await response.json();

      if (data.count > 0) {
        const result = data.items[0];
        const { location } = result;

        markerRef.current.setLngLat([location.x, location.y]);

        setHandelblock(true);
        setInputLng(location.x);
        setInputLat(location.y);
        mapRef.current.flyTo({ center: [location.x, location.y], zoom: 15 });
      } else {
        alert("مکان مورد نظر پیدا نشد!");
      }
    } catch (error) {
      console.error("خطا در جستجو:", error);
      alert("مشکلی در جستجو به وجود آمد.");
    }
  };

  const handApileNavigate = () => {
    navigate("/Registration", { state: { inputLng, inputLat } });
  };

  const handleNavigate = () => {
    navigate("./Registration");
  };

  return (
    <div>
      <div className="w-full h-[835px]" ref={mapContainerRef} />
      <div className=" absolute top-20 ">
        <div className=" ml-9">
          <div className="bg-white flex rounded-full w-8/12 sm:w-2/3 lg:w-2/3 mx-auto">
            <button onClick={handleSearch}>
              <svg
                className=" ml-2 w-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </button>
            <input
              type="text"
              placeholder="جستجو"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full p-2 pr-5 text-end pl-20 focus:outline-none"
            />
          </div>
          {suggestions.length > 0 && (
            <ul className="bg-white border border-gray-300  w-8/12 mx-auto rounded-md shadow-lg mt-1 max-h-40 overflow-auto text-center ">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelectSuggestion(item.location)}
                >
                  {item.title}
                  <hr className="mt-2" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="absolute bottom-8 flex">
        <div className="flex sm:flex-row  gap-4">
          {handelblock ? (
            <button
              onClick={handApileNavigate}
              className="bg-[#007EA2] p-3 rounded-full text-white px-10 hover:bg-cyan-500 hover:shadow-custom xxs:ml-4  xxs:text-[16px] xxs:px-5 xxs: xs:px-10 xs:text-lg w-auto"
            >
              انتخاب مبدا
            </button>
          ) : (
            <button className="bg-[#007EA2] p-3 rounded-full text-white px-10 opacity-50 cursor-not-allowed  xxs:ml-4 xxs:text-[16px] xxs:px-5 xxs: xs:px-10 xs:text-lg w-auto">
              انتخاب مبدا
            </button>
          )}
          <button
            onClick={handleNavigate}
            className="bg-[#007EA2] p-3 rounded-full text-white px-10 hover:bg-cyan-500 hover:shadow-custom xxs:text-[16px] xxs:px-5 xxs: xs:px-10 xs:text-lg w-auto"
          >
            ارسال توسط خودم
          </button>
        </div>
      </div>
    </div>
  );
};

export default Loc;
