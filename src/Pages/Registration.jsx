import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, data } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { DevTool } from "@hookform/devtools";
import { div } from "framer-motion/client";

const Registration = () => {
  const [clickedInput, setClickedInput] = useState(false);
  const [handlePricing, setHandlePricing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [inputLng] = useState(location.state?.inputLng || 0);
  const [inputLat] = useState(location.state?.inputLat || 0);
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [handleEmailInput, setHandleEmailInput] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    context: { handleEmailInput },
    resolver: yupResolver(
      Yup.object().shape({
        titel: Yup.string().required("عنوان کالا الزامی است"),
        length: Yup.number()
          .typeError("باید عدد باشد")
          .required("طول الزامی است"),
        width: Yup.number()
          .typeError("باید عدد باشد")
          .required("عرض الزامی است"),
        height: Yup.number()
          .typeError("باید عدد باشد")
          .required("ارتفاع الزامی است"),
        weight: Yup.number()
          .typeError("باید عدد باشد")
          .required("وزن الزامی است"),
        count: Yup.number()
          .typeError("باید عدد باشد")
          .required("تعداد کالا الزامی است"),
        value: Yup.number()
          .typeError("باید عدد باشد")
          .required("ارزش کالا الزامی است"),
        email: Yup.string().when("$handleEmailInput", {
          is: true,
          then: (schema) =>
            schema.required("ایمیل الزامی است").email("ایمیل معتبر نیست"),
          otherwise: (schema) => schema.notRequired(),
        }),
      })
    ),
  });

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
    ? cities.filter(
        (city) =>
          city.city_name &&
          city.city_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSearchIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchIsOpen]);

  const handleNavigate = () => {
    navigate("/");
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-between items-center p-6">
      <div className="flex flex-col items-center flex-grow justify-center">
        <img src="/Empty States.svg" alt="sgsg" width={260} height={150} />
        <p className="text-[#007EA2] mt-4">.کالایی اضافه نشده است</p>
        <button
          onClick={() => setHandlePricing(true)}
          className="flex mt-6 py-2 px-6 border-2 border-[#007EA2] text-lg bg-[#F5FCFF] text-[#007EA2] rounded-full hover:bg-cyan-100 transition-colors duration-300"
        >
          <img
            className="mr-2"
            src="/box-add.svg"
            alt="sgsdg"
            width={24}
            height={24}
          />
          ثبت کالا
        </button>
      </div>
      <div className=" flex flex-col justify-center ">
        {clickedInput ? (
          <button className="py-2 px-32 text-xl bg-[#D40700] border-2 text-white rounded-full hover:border-2 hover:border-[#D40700] hover:bg-white hover:text-[#D40700] transition-colors duration-300">
            محاسبه قیمت
          </button>
        ) : (
          <button className="py-2 px-32 text-xl  border-2 border-[#C0BFBF] text-[#C0BFBF] rounded-full  cursor-not-allowed">
            محاسبه قیمت
          </button>
        )}
        <button
          onClick={handleNavigate}
          className=" mt-5 p-1.5 rounded-3xl border-2 bg-[#F5FCFF] text-[#17A2B8] border-[#17A2B8] hover:bg-[#17A2B8] hover:text-white transition-colors duration-300"
        >
          انتخاب مجدد مبدا
        </button>
      </div>
      <AnimatePresence>
        {handlePricing && (
          <div className="fixed inset-0 max-w-[425px] ml-auto mr-auto flex justify-center items-end bg-black/50">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <div className="bg-white w-full max-w-md rounded-t-3xl p-6 shadow-lg transform transition-all duration-300">
                <div className="flex justify-center mb-5">
                  <button
                    onClick={() => setHandlePricing(false)}
                    className="mr-auto"
                  >
                    <img
                      src="/Vector.svg"
                      alt="dsfgsg"
                      width={15}
                      height={12}
                    />
                  </button>
                  <h2 className="text-lg mb-2"> ثبت کالا</h2>
                  <img
                    className="ml-auto"
                    src="/box-add.svg"
                    alt="dsfghdg"
                    width={24}
                    height={24}
                  />
                </div>
                <form
                  onSubmit={handleSubmit(
                    (data) => {
                      setHandlePricing(false);
                      setClickedInput(true);
                    },
                    (errors) => {
                      console.log("Errors:", errors);
                      setHandlePricing(true);
                    }
                  )}
                >
                  <div className="flex flex-col">
                    <label className="flex justify-end mb-2" htmlFor="titel">
                      عنوان کالا
                    </label>
                    <input
                      className="border-2 border-[#C0BFBF] p-2 rounded-xl w-full text-end"
                      type="text"
                      placeholder=" عنوان کالا را وارد کنید"
                      {...register("titel")}
                    />
                    {errors.titel && (
                      <p className="text-red-500 text-end">
                        {errors.titel.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-row mt-2">
                    <div className="flex flex-col mr-5">
                      <label className="flex justify-end mb-2" htmlFor="length">
                        طول
                      </label>
                      <input
                        className="border-2 border-[#C0BFBF] p-2 rounded-xl w-full text-end"
                        type="number"
                        placeholder="CM مثلا 500 "
                        {...register("length")}
                      />
                      {errors.length && (
                        <p className="text-red-500 text-end">
                          {errors.length.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label className="flex justify-end mb-2" htmlFor="width">
                        {" "}
                        عرض
                      </label>
                      <input
                        className="border-2 border-[#C0BFBF] p-2 rounded-xl w-full text-end"
                        type="number"
                        placeholder="CM مثلا 500 "
                        {...register("width")}
                      />
                      {errors.width && (
                        <p className="text-red-500 text-end">
                          {errors.width.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row mt-3">
                    <div className="flex flex-col mr-5">
                      <label className="flex justify-end mb-2" htmlFor="length">
                        ارتفاع
                      </label>
                      <input
                        className="border-2 border-[#C0BFBF] p-2 rounded-xl w-full text-end"
                        type="number"
                        placeholder="CM مثلا 500 "
                        {...register("height")}
                      />
                      {errors.height && (
                        <p className="text-red-500 text-end">
                          {errors.height.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label className="flex justify-end mb-2" htmlFor="width">
                        {" "}
                        وزن
                      </label>
                      <input
                        className="border-2 border-[#C0BFBF] p-2 rounded-xl w-full text-end"
                        type="number"
                        placeholder="CM مثلا 500 "
                        {...register("weight")}
                      />
                      {errors.weight && (
                        <p className="text-red-500 text-end">
                          {errors.weight.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col mt-2">
                    <label className="flex justify-end mb-2" htmlFor="count">
                      تعداد
                    </label>
                    <input
                      className="border-2 border-[#C0BFBF] p-2 rounded-xl w-full text-end"
                      type="number"
                      placeholder=" تعداد کالا را وارد کنید "
                      {...register("count")}
                    />
                    {errors.count && (
                      <p className="text-red-500 text-end">
                        {errors.count.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col my-2 ">
                    <label className="flex justify-end mb-2" htmlFor="value">
                      ارزش کالا
                    </label>
                    <input
                      className="border-2 border-[#C0BFBF] p-2 rounded-xl w-full text-end"
                      type="number"
                      placeholder=" ارزش کالا را وارد کنید "
                      {...register("value")}
                    />
                    {errors.value && (
                      <p className="text-red-500 text-end">
                        {errors.value.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col mb-3 ">
                    <label className="flex justify-end" htmlFor="city">
                      شهر مقصد
                    </label>
                    {selectedItem ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSearchIsOpen(!searchIsOpen);
                        }}
                        className="mt-2 w-full py-2 bg-white text-gray-500 border-2 border-gray-500 rounded-xl hover:text-gray-900 hover:border-gray-900 "
                        {...register("city")}
                      >
                        {selectedItem}
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSearchIsOpen(!searchIsOpen);
                        }}
                        className="mt-2 w-full py-2 bg-white text-[#C0BFBF] border-2 border-[#C0BFBF] rounded-xl hover:text-gray-900 hover:border-gray-900"
                        {...register("city")}
                      >
                        انتخاب کنید
                      </button>
                    )}

                    {searchIsOpen && (
                      <div className="absolute bottom-36  w-[380px] bg-white border rounded-t-3xl rounded-b-lg shadow-lg z-50 transition-transform duration-200 origin-bottom transform scale-y-100">
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
                                  setSearchIsOpen(false);
                                }}
                              >
                                {city.city_name}
                              </li>
                            ))
                          ) : (
                            <li className="px-4 py-2 text-gray-500">
                              !موردی یافت نشد
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                    <div className="flex justify-end items-center mt-2">
                      <p>اطلاع از وضعیت سفارش با ایمیل</p>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setHandleEmailInput(!handleEmailInput);
                        }}
                        className={` ml-2 border-2 w-4 h-4 rounded-full transition-colors duration-300 ${
                          handleEmailInput
                            ? "bg-red-600 border-red-600"
                            : "border-gray-700"
                        }`}
                      ></button>
                    </div>
                    {handleEmailInput && (
                      <div className="flex flex-col my-2 ">
                        <input
                          className="border-2 border-[#C0BFBF] p-2 rounded-xl w-full text-end"
                          type="text"
                          placeholder=" ایمیل خود را وارد کنید "
                          {...register("email")}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-end">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    onClick={() => (
                      setHandlePricing(true), setClickedInput(true)
                    )}
                    className=" w-full py-2 bg-red-500 text-white rounded-lg"
                  >
                    ثبت کالا
                  </button>
                </form>
              </div>
            </motion.div>
            <DevTool control={control} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Registration;
