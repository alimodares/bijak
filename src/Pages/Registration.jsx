import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Searchbox from "../components/searchbox";
import { useNavigate, useLocation } from "react-router-dom";
import Pricing from "../components/pricing";
import { AnimatePresence } from "framer-motion";
import { fetchPricing } from "../api/Posts/pricingAPI";

const schema = Yup.object().shape({
  value: Yup.number()
    .typeError("ارزش کل کالا الزامی است")
    .required("ارزش کل کالا الزامی است")
    .positive("عدد باید مثبت باشد"),
  destination_city_id: Yup.string().required("انتخاب شهر الزامی است"),
});

const Registration = () => {
  const isCalculatingRef = useRef(false);
  const popupRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [inputLng] = useState(location.state?.inputLng || 0);
  const [inputLat] = useState(location.state?.inputLat || 0);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [list, setList] = useState([]);
  const [pricingList, setPricingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [goods_details, setgoods_details] = useState([{}]);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [finalPrice, setFinalPrice] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
    watch,
  } = useForm({
    defaultValues: {
      value: "",
      destination_city_id: "",
      needs_packaging: false,
    },
    resolver: yupResolver(schema),
  });

  const submitForm = (data) => {
    setList([data]);
  };


  const handleNavigate = () => {
    navigate("/");
  };

  const formatNumber = (num) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  useEffect(() => {
    setgoods_details(
      pricingList.map((item) => ({
        title: String(item.titel),
        length: Number(item.length),
        width: Number(item.width),
        height: Number(item.height),
        weight: Number(item.weight),
        goods_count: Number(item.goods_count),
        needs_packaging: Boolean(item.needs_packaging),
      }))
    );
  }, [pricingList]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPricingModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (shouldFetch && goods_details.length && list.length) {
      fetchPricing({
        goods_details,
        inputLng,
        inputLat,
        destination_city_id: list[0]?.destination_city_id,
        value: list[0]?.value,
        setLoading,
        isCalculatingRef,
        setData,
        setFinalPrice,
        setError,
      });
      setShouldFetch(false);
    }
  }, [shouldFetch, goods_details, list, inputLng, inputLat]);


  const handleRemoveItem = (id) => {
    const updatedList = pricingList.filter((item) => item.id !== id);
    setPricingList(updatedList);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowPricingModal(true);
  };

  const handleUpdateItem = (updatedItem) => {
    const updatedList = pricingList.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setPricingList(updatedList);
    setEditingItem(null);
  };

  return (
    <div className="flex items-center justify-center  mb-24 ">
      <div className="justify-center items-center w-full mx-6">
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="flex w-full flex-col">
            <div className="flex flex-col">
              <label className="flex justify-end mt-2 mb-2" htmlFor="value">
                {" "}
                ارزش کل
              </label>
              <input
                className="border-2 border-[#C0BFBF] p-2 rounded-xl w-full text-end"
                type="text"
                placeholder=" ارزش کالا را وارد کنید "
                value={
                  watch("value") ? formatNumber(watch("value").toString()) : ""
                }
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, "");
                  if (/^\d*$/.test(rawValue)) {
                    setValue("value", rawValue === "" ? "" : Number(rawValue), {
                      shouldValidate: true,
                    });
                  }
                }}
              />
              {errors.value && (
                <p className="text-red-500 text-sm text-center mt-2">
                  {errors.value.message}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <Searchbox setValue={setValue} watch={watch} />
              {errors.destination_city_id && (
                <p className="text-red-500 text-sm text-center mt-2">
                  {errors.destination_city_id.message}
                </p>
              )}
            </div>
            {errors.needs_packaging && (
              <p className="text-red-500 text-sm text-center mt-2">
                {errors.needs_packaging.message}
              </p>
            )}
          </div>
          {pricingList.length > 0 ? (
            <div className="flex max-w-96 flex-col w-full mt-5">
              {pricingList.map((p) => (
                <div key={p.id} className="mb-6 rounded-2xl w-full bg-white">
                  <div className="bg-[#E9F8FF] w-full flex rounded-t-xl p-4 items-center">
                    <button onClick={() => handleRemoveItem(p.id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-600 hover:text-red-800 "
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m5 0H6"
                        />
                      </svg>
                    </button>
                    <button onClick={() => handleEditItem(p)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-orange-600 w-5 h-5 ml-4"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path
                          fill-rule="evenodd"
                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                        />
                      </svg>
                    </button>
                    <p className=" flex w-full justify-end ">جزیات کالا</p>
                    <img className="ml-2" src="/box.svg" alt="dehdfg" />
                  </div>
                  <div className="p-4 ">
                    <div className="flex items-end flex-col border-b-2">
                      <p className="text-[#8D8C8C]">عنوان کالا</p>
                      <p className="my-2 whitespace-normal break-words text-right">
                        {p.titel}
                      </p>
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
                          <p className="text-[#8D8C8C] mr-2">kg</p>
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
                    <div className="flex w-full ">
                      <div className="flex w-1/2 items-center  p-1 border-r-2 py-3">
                        {p.needs_packaging ? (
                          <p className=" mr-2">دارد</p>
                        ) : (
                          <p className=" mr-2">ندارد</p>
                        )}
                        <p className="text-[#8D8C8C] ml-auto mr-2">
                          {" "}
                          بسته بندی
                        </p>
                      </div>
                      <div className="flex w-1/2 items-center  p-1">
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
              <div className=" flex justify-center mb-36">
                <div>
                  <button
                    onClick={() => {
                      setShowPricingModal(true);
                    }}
                    className="flex  py-2 px-6 border-2 border-[#007EA2] text-lg bg-[#F5FCFF] text-[#007EA2] rounded-full hover:bg-cyan-100 transition-colors duration-300"
                  >
                    <img
                      className="mr-2"
                      src="/box-add.svg"
                      alt="sgsdg"
                      width={24}
                      height={24}
                    />
                    ثبت کالا جدید
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <img
                src="/Empty States.svg"
                alt="sgsg"
                width={260}
                height={150}
              />
              <p className="text-[#007EA2] mt-4 justify-center flex">
                .کالایی اضافه نشده است
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowPricingModal(true);
                }}
                className="flex items-center justify-center mt-6 py-2 px-6 border-2 border-[#007EA2] text-lg bg-[#F5FCFF] text-[#007EA2] rounded-full hover:bg-cyan-100 transition-colors duration-300"
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
        </form>
      </div>
      <div className=" fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md flex flex-col items-center">
        <button
          type="button"
          onClick={handleSubmit((formData) => {
            submitForm(formData);
            if (!isCalculatingRef.current) {
              setShouldFetch(true);
            }
          })}
          disabled={isCalculatingRef.current}
          className={`py-2 px-20 xs:px-32 text-xl sm:text-xl rounded-full border-2 border-[#D40700] transition-colors duration-300 ${
            isCalculatingRef.current
              ? "bg-gray-400 text-xl px-16 xs:px-28 xs:py-2 text-white cursor-not-allowed"
              : "bg-[#D40700] text-white hover:border-[#D40700] hover:bg-white hover:text-[#D40700]"
          }`}
        >
          {isCalculatingRef.current ? " ...در حال محاسبه" : "محاسبه قیمت"}
        </button>
        <button
          type="button"
          onClick={() => {
            reset();
            handleNavigate();
          }}
          className="py-2 mt-2  px-20 xs:px-32 rounded-3xl border-2 bg-[#F5FCFF] text-[#17A2B8] border-[#17A2B8] hover:bg-[#17A2B8] hover:text-white transition-colors duration-300"
        >
          انتخاب مجدد مبدا
        </button>
        <AnimatePresence>
          {showPricingModal && (
            <div ref={popupRef}>
              <Pricing
                setShowPricingModal={setShowPricingModal}
                setPricingList={setPricingList}
                pricingList={pricingList}
                editingItem={editingItem}
                setEditingItem={setEditingItem}
              />
            </div>
          )}
        </AnimatePresence>
        {finalPrice && (
          <div className="mt-2 p-2.5 px-9 xs:px-20  flex items-center bg-green-100 text-green-700 rounded-full shadow-md text-center">
            <p className="text-xl font-bold">
              {formatNumber(finalPrice.toString())} تومان
            </p>
            <p className="ml-4 "> : مبلغ نهایی</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Registration;
