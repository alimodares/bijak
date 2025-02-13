import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Dropdown from "../components/Dropdown";
import Apicalculation from "../components/Apicalculation";
import "./../main.css";
import { useNavigate, useLocation } from "react-router-dom";

const Pricing = () => {
  const [clickedInput, setClickedInput] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [invalidFields, setInvalidFields] = useState({}); // ✅ استیت برای مشخص کردن فیلدهای خالی

  const location = useLocation();
  const navigate = useNavigate();

  const [inputLng] = useState(location.state?.inputLng || 0);
  const [inputLat] = useState(location.state?.inputLat || 0);

  useEffect(() => {
    console.log(inputLng, inputLat);
  }, [inputLng, inputLat]);

  const handleNavigate = () => {
    navigate("/");
  };

  const labelItems = [
    "طول (سانتی‌متر)",
    "عرض (سانتی‌متر)",
    "ارتفاع (سانتی‌متر)",
    "وزن (کیلوگرم)",
    "تعداد",
    "ارزش کالا (تومان)",
  ];
  const titleItems = ["length", "width", "height", "weight", "count", "value"];
  const placeholderItems = [
    "مثلاً 50 سانتی‌متر",
    "مثلاً 30 سانتی‌متر",
    "مثلاً 20 سانتی‌متر",
    "مثلاً 10 کیلوگرم",
    "مثلاً 1 عدد",
    "2,500,000",
  ];

  const handleBlur = () => {
    setClickedInput(null);
  };

  const handleInputChange = (e, field) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setInvalidFields((prev) => ({ ...prev, [field]: false })); 
  };

  const handleCalculate = async () => {
    let newInvalidFields = {};
    titleItems.forEach((field) => {
      if (!formData[field]) {
        newInvalidFields[field] = true;
      }
    });

    if (Object.keys(newInvalidFields).length > 0) {
      setInvalidFields(newInvalidFields);
      Swal.fire({
        text: "لطفاً همه فیلدها را پر کنید!",
        icon: "warning",
        confirmButtonText: "باشه",
      });
      return;
    }

    if (!selectedValue) {
      Swal.fire({
        text: "لطفاً یک شهر مقصد انتخاب کنید!",
        icon: "warning",
        confirmButtonText: "باشه",
      });
      return;
    }

    await Apicalculation(
      selectedValue,
      formData,
      setData,
      setLoading,
      setError,
      inputLng,
      inputLat
    );
    setIsOpen(true);
  };

  useEffect(() => {
    if (isOpen) {
      Swal.fire({
        text: data?.prices
          ? ` کرایه حمل :  ${data.prices.amount} تومان`
          : "خطایی رخ داده است!",
        icon: data?.prices ? "success" : "error",
        confirmButtonText: "باشه",
      }).then(() => {
        setIsOpen(false);
      });
    }
  }, [isOpen, data]);

  return (
    <div className="flex items-center mt-28 flex-col">
      <h1 className="text-3xl mb-5">اطلاعات کالا</h1>
      {labelItems.map((label, index) => (
        <div key={index} className="mt-2 w-4/5 flex flex-col items-center">
          <label
            htmlFor={titleItems[index]}
            className="mb-2 text-[13px] text-gray-600"
          >
            {label}
          </label>
          <input
            onClick={() => setClickedInput(titleItems[index])}
            onBlur={handleBlur}
            className={`focus:outline-none p-1.5 rounded-3xl border-2 w-full text-center text-sm ${
              invalidFields[titleItems[index]]
                ? "border-red-500" 
                : clickedInput === titleItems[index]
                ? "border-sky-400 shadow-custom"
                : "border-gray-300"
            }`}
            type="number"
            id={titleItems[index]}
            placeholder={placeholderItems[index]}
            onChange={(e) => handleInputChange(e, titleItems[index])}
          />
        </div>
      ))}

      <label htmlFor="" className="my-2 text-[13px] text-gray-600">
        شهر مقصد
      </label>

      <Dropdown
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
      />

      <button
        onClick={handleCalculate}
        className="w-4/5 flex justify-center mt-5 p-1.5 rounded-3xl border-2 bg-[#b20000] text-white hover:bg-white hover:text-[#b20000] hover:border-[#b20000] transition-colors duration-300"
      >
        {loading ? "در حال محاسبه..." : "محاسبه قیمت"}
      </button>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      <button
        onClick={handleNavigate}
        className="w-4/5 flex justify-center mt-5 p-1.5 rounded-3xl border-2 bg-[#F5FCFF] text-[#17A2B8] border-[#17A2B8] hover:bg-[#17A2B8] hover:text-white transition-colors duration-300"
      >
        انتخاب مجدد مبدا
      </button>
    </div>
  );
};

export default Pricing;
