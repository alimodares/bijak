import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { DevTool } from "@hookform/devtools";
import { title } from "framer-motion/client";

const Registration = () => {
  const [clickedInput, setClickedInput] = useState(false);
  const [handlePricing, setHandlePricing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [inputLng] = useState(location.state?.inputLng || 0);
  const [inputLat] = useState(location.state?.inputLat || 0);
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [handleEmailInput, setHandleEmailInput] = useState(false);
  const [isOpenListPricingForm, setIsOpenListPricingForm] = useState(false);
  const [valueiner, setValueiner] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedItemApi, setSelectedItemApi] = useState("");
  const [titels, setTitels] = useState("");
  const [goods_details, setgoods_details] = useState([{}]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    context: { handleEmailInput },
    defaultValues: {},
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
        goods_count: Yup.number()
          .typeError("باید عدد باشد")
          .required("تعداد کالا الزامی است"),
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

  const func = (value) => {
    if (!value) {
      setFilteredCities(cities);
      return;
    }
    const newList = cities.filter((x) => x.city_name.includes(value));
    setFilteredCities(newList);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSearchIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [searchIsOpen]);
  const handleNavigate = () => {
    navigate("/");
  };

  const closemenu = () => {
    setHandlePricing(false);
    setClickedInput(true);
    setIsOpenListPricingForm(true);
  };

  const closemenuall = () => {
    setHandlePricing(false);
    reset();
  };

  const [list, setList] = useState([]);
  const [listIner, setListIner] = useState([]);

  const submitforminer = (data) => {
    console.log(data);
    setSelectedItemApi(selectedItem);

    setListIner([...listIner, { ...data }]);
    reset({});
  };

  const submitForm = (data) => {
    console.log("formData", data);

    setList([...list, { ...data, value: parseFloat(data.value) || 0 }]);

    reset({});

    closemenu();
  };

  useEffect(() => {
    const fetchPricing = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://192.168.11.30:8001/utils/single_pricing",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              destination_city_id: list[0].destination_city_id,
              lng: inputLng,
              lat: inputLat,
              goods_details,
              value: list[0].value,
              need_packaging: true,
            }),
          }
        );
        console.log("list", list);

        if (!response.ok) {
          throw new Error("مشکلی در دریافت اطلاعات وجود دارد!");
        }

        if (selectedItem) {
          fetchPricing();
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedItem) {
      fetchPricing();
    }
  }, [goods_details, inputLng, inputLat, selectedItem, list]);

  useEffect(() => {
    const extractedTitles = list.map((item) => item.titel);
    setTitels(extractedTitles);
  }, [list]);

  useEffect(() => {
    setgoods_details(
      list.map((item) => ({
        title: String(item.titel),
        length: Number(item.length),
        width: Number(item.width),
        height: Number(item.height),
        weight: Number(item.weight),
        goods_count: Number(item.goods_count),
      }))
    );
  }, [list]);

  useEffect(() => {
    console.log(goods_details);
  }, [goods_details]);

  return (
    <div className=" inset-0 flex flex-col justify-between items-center p-6">
      <div>
        {list.length > 0 ? (
          <div className="flex">
            <p className="mr-2">{valueiner}</p>
            <p> : ارزش کل کالاها</p>
            <p className="px-2 pl-4">{selectedItem}</p>
            <p> : شهر مقصد</p>
          </div>
        ) : (
          <p></p>
        )}
      </div>
      {list.length > 0 ? (
        <div className="flex flex-col w-full flex-wrap justify-center">
          {list.map((p, index) => (
            <div key={p.index} className="mb-6 rounded-2xl w-full bg-white">
              <div className="bg-[#E9F8FF] w-full flex rounded-t-xl p-4">
                <p className=" flex w-full justify-end ">جزیات کالا</p>
                <img className="ml-2" src="/box.svg" alt="dehdfg" />
              </div>
              <div className="p-4">
                <div className="flex items-end flex-col border-b-2">
                  <p className="text-[#8D8C8C]">عنوان کالا</p>
                  <p className="my-2">{p.titel}</p>
                </div>
                <div className="flex">
                  <div className="flex items-center w-1/2 border-r-2 p-1">
                    <div className="flex py-2">
                      <p className="text-[#8D8C8C] mr-2">cm</p>
                      <p>{p.width}</p>
                    </div>
                    <p className="text-[#8D8C8C] ml-auto mr-2">عرض</p>
                  </div>
                  <div className="flex items-center w-1/2 p-1">
                    <div className="flex py-2">
                      <p className="text-[#8D8C8C] mr-2 ml-2">cm</p>
                      <p>{p.length}</p>
                    </div>
                    <p className="text-[#8D8C8C] ml-auto">طول</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex items-end w-1/2 border-r-2 border-y-2 p-1 py-3">
                    <div className="flex ">
                      <p className="text-[#8D8C8C] mr-2">گرم</p>
                      <p>{p.weight}</p>
                    </div>
                    <p className="text-[#8D8C8C] ml-auto mr-2">وزن</p>
                  </div>
                  <div className="flex w-1/2 border-y-2 p-1 items-center">
                    <div className="flex">
                      <p className="text-[#8D8C8C] mr-2 ml-2">cm</p>
                      <p>{p.height}</p>
                    </div>
                    <p className="text-[#8D8C8C] ml-auto">ارتفاع</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex items-center w-1/2 border-r-2  p-1 py-3">
                    <div className="flex ">
                      <p>{p.destination_city_id}</p>
                    </div>
                    <p className="text-[#8D8C8C] ml-auto mr-2">شهر مقصد</p>
                  </div>
                  <div className="flex items-center w-1/2  p-1">
                    <div className="flex">
                      <p className="text-[#8D8C8C] mr-2 ml-2">عدد</p>
                      <p>{p.goods_count}</p>
                    </div>
                    <p className="text-[#8D8C8C] ml-auto">تعداد</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-40 left-0 right-0 flex flex-col items-center">
            <div>
              <button
                onClick={() => {
                  setHandlePricing(true);
                }}
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
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center flex-grow justify-center">
          <form onSubmit={handleSubmit(submitforminer)}>
            <div>
              <div className="flex flex-col my-2 ">
                <label className="flex justify-center mb-2" htmlFor="value">
                  ارزش کل
                </label>
                <input
                  className="border-2 border-[#C0BFBF] p-2 rounded-xl w-full text-end"
                  type="number"
                  placeholder=" ارزش کالا را وارد کنید "
                  {...register("value")}
                  onChange={(e) => {
                    setValueiner(e.target.value);
                    setValue("value", e.target.value);
                  }}
                />
              </div>
              <label className="flex justify-center" htmlFor="">
                شهر مقصد
              </label>
              {selectedItem ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchIsOpen(!searchIsOpen);
                  }}
                  value={selectedItem}
                  className="mt-2 w-full py-2 bg-white text-gray-500 border-2 border-gray-500 rounded-xl hover:text-gray-900 hover:border-gray-900 "
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
                >
                  انتخاب کنید
                </button>
              )}

              {searchIsOpen && (
                <div className=" absolute bg-white border rounded-t-3xl rounded-b-lg shadow-lg z-50 transition-transform duration-200 origin-bottom transform scale-y-100">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="جستجو..."
                    onChange={(e) => func(e.target.value)}
                    className="w-full px-3 py-2 border focus:outline-none text-center"
                  />

                  <ul className="max-h-40 overflow-y-auto text-center">
                    {filteredCities.length > 0 ? (
                      filteredCities?.map((city) => (
                        <li
                          key={city.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedItem(city.city_name);
                            setSelectedValue(city.id);
                            setValue("destination_city_id", city.id);
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
            </div>
          </form>
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
      )}

      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center">
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
          className=" mt-5 px-32 py-3 rounded-3xl border-2 bg-[#F5FCFF] text-[#17A2B8] border-[#17A2B8] hover:bg-[#17A2B8] hover:text-white transition-colors duration-300"
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
                  <button onClick={closemenuall} className="mr-auto">
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
                <form onSubmit={handleSubmit(submitForm)}>
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
                        placeholder=" مثلا 500 گرم"
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
                    <label
                      className="flex justify-end mb-2"
                      htmlFor="goods_count"
                    >
                      تعداد
                    </label>
                    <input
                      className="border-2 border-[#C0BFBF] p-2 rounded-xl w-full text-end"
                      type="number"
                      placeholder=" تعداد کالا را وارد کنید "
                      {...register("goods_count")}
                    />
                    {errors.goods_count && (
                      <p className="text-red-500 text-end">
                        {errors.goods_count.message}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
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
