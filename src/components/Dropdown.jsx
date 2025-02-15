import React, { useState, useRef, useEffect } from "react";

const Dropdown = ({ selectedValue, setSelectedValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(selectedValue || "");
  const [cities, setCities] = useState([]); 

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          "https://test-bjakapi.liara.run/utils/get_cities"
        );
        const data = await response.json();
        if (data.success && Array.isArray(data.cities)) {
          setCities(data.cities);
        } else {
          console.error("داده‌های نامعتبر دریافت شد:", data);
          setCities([]);
        }
      } catch (error) {
        console.error("خطا در دریافت اطلاعات شهرها:", error);
      }
    };
    fetchCities();
  }, []);

  const filteredCities = Array.isArray(cities)
  ? cities.filter((city) => city.city_name && city.city_name.toLowerCase().includes(searchTerm.toLowerCase()))
  : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-4/5 relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-3xl border-2 w-full bg-white text-sm border-gray-300 flex justify-center"
      >
        {selectedItem ? selectedItem : "انتخاب کنید"}
        <span
          className={`ml-2 text-gray-400 transition-transform duration-500 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute w-full bottom-full mb-2 bg-white border rounded-t-3xl rounded-b-lg shadow-lg z-10 transition-transform duration-200 origin-bottom transform scale-y-100">
          <input
            ref={inputRef}
            type="text"
            placeholder="جستجو..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border focus:outline-none text-center"
          />

          <ul className="max-h-40 overflow-y-auto text-center">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <li
                  key={city.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedItem(city.city_name);
                    setSelectedValue(city.id);
                    setIsOpen(false);
                  }}
                >
                  {city.city_name}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">!موردی یافت نشد</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
