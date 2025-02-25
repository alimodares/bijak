import { useEffect, useRef, useState } from "react";
import getService from "../api/Gets";

const Searchbox = ({ setValue, watch }) => {
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const selectedCityId = watch("destination_city_id");

  const getcity = () => {
    getService.getCities().then(
      (res) => {
        setCities(res.data.cities);
        setFilteredCities(res.data.cities);
      },
      (err) => {}
    );
  };

  useEffect(() => {
    getcity();
  }, []);

  const filterCities = (value) => {
    if (!value) {
      setFilteredCities(cities);
      return;
    }
    const newList = cities.filter((x) => x.city_name.includes(value));
    setFilteredCities(newList);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setSearchIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedCity = cities?.find((city) => city.id === selectedCityId);

  return (
    <div className="relative">
      <label className="flex justify-end mt-2">شهر مقصد</label>

      <button
        onClick={(e) => {
          e.preventDefault();
          setSearchIsOpen(!searchIsOpen);
        }}
        className={`mt-2 w-full py-2 border-2 bg-white border-[#C0BFBF] rounded-xl transition duration-300 ${
          selectedCity
            ? "text-gray-600 border-gray-500"
            : "text-gray-400 border-gray-300"
        } hover:border-gray-900 hover: text-gray-900`}
      >
        {selectedCity ? selectedCity.city_name : "انتخاب کنید"}
      </button>

      {searchIsOpen && (
        <div
          ref={dropdownRef}
          className="absolute w-full bg-white border rounded-t-3xl rounded-b-lg shadow-lg z-50 transition-transform duration-200 origin-top transform scale-y-100"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="...جستجو"
            onChange={(e) => filterCities(e.target.value)}
            className="w-full px-3 py-2 border focus:outline-none text-center"
          />

          <ul className="max-h-40 overflow-y-auto text-center">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <li
                  key={city.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setValue("destination_city_id", city.id);
                    setSearchIsOpen(false);
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

export default Searchbox;
