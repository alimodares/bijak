import { useEffect, useRef, useState } from "react";

const Searchbox = ({ setValue, watch }) => {
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const selectedCityId = watch("destination_city_id");

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("https://test-bjakapi.liara.run/utils/get_cities");
        const data = await response.json();
        if (data.success && Array.isArray(data.cities)) {
          setCities(data.cities);
          setFilteredCities(data.cities);
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

  const filterCities = (value) => {
    if (!value) {
      setFilteredCities(cities);
      return;
    }
    const newList = cities.filter((x) => x.city_name.includes(value));
    setFilteredCities(newList);
  };

    const selectedCity = cities.find(city => city.id === selectedCityId);

  return (
    <div className="relative">
      <label className="flex justify-center mt-2">شهر مقصد</label>

      <button
        onClick={(e) => {
          e.preventDefault();
          setSearchIsOpen(!searchIsOpen);
        }}
        className={`mt-2 w-full py-2 border-2 rounded-xl transition duration-300 ${
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
            placeholder="جستجو..."
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
