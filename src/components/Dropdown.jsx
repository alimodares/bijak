import React, { useState, useRef, useEffect } from "react";

const Dropdown = ({ selectedValue, setSelectedValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(selectedValue || "");

  const items = [
    { id: 1, name: "اصفهان" },
    { id: 2, name: "تهران" },
    { id: 12, name: "مشهد" },
    { id: 4, name: "قم" },
    { id: 5, name: "مازندران" },
    { id: 6, name: "کرج" },
    { id: 7, name: "شیراز" },
    { id: 8, name: "ساری" },
    { id: 9, name: "کردان" },
    { id: 10, name: "تبریز" },
    { id: 11, name: "قشم" },
  ];

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
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

          <ul className="max-h-40 overflow-y-auto flex items-center flex-col">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <li
                  key={item.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedItem(item.name);
                    setSelectedValue(item.id);
                    setIsOpen(false);
                  }}
                >
                  {item.name}
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
