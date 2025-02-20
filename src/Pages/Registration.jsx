import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Searchbox from "../components/searchbox";
import { useNavigate, useLocation } from "react-router-dom";
import Pricing from "../components/pricing";
import { AnimatePresence } from "framer-motion";

const schema = Yup.object().shape({
  value: Yup.number()
    .typeError("باید عدد باشد")
    .required("ارزش کل کالا الزامی است")
    .positive("عدد باید مثبت باشد"),
  destination_city_id: Yup.string().required("انتخاب شهر الزامی است"),
  need_packaging: Yup.boolean(),
});

const Registration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [inputLng] = useState(location.state?.inputLng || 0);
  const [inputLat] = useState(location.state?.inputLat || 0);
  const [handlePricing, setHandlePricing] = useState(false);
  const [list, setList] = useState([]);
  const [pricingList, setPricingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [setData] = useState(null);
  const [error, setError] = useState(null);
  const [goods_details, setgoods_details] = useState([{}]);
  const [shouldFetch, setShouldFetch] = useState(false);

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
      need_packaging: false,
    },
    resolver: yupResolver(schema),
  });

  const submitForm = (data) => {
    setList([data]);
    setHandlePricing(true);
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
      }))
    );
  }, [pricingList]);

  useEffect(() => {
    console.log("lisssssss", goods_details);
  }, [goods_details]);

  const fetchPricing = async () => {
    console.log("list before fetch:", list);
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
            goods_details,
            lng: inputLng,
            lat: inputLat,
            destination_city_id: list[0]?.destination_city_id,
            value: list[0]?.value,
            need_packaging: list[0]?.need_packaging,
          }),
        }
      );
      console.log("list", list);

      if (!response.ok) {
        throw new Error("مشکلی در دریافت اطلاعات وجود دارد!");
      }

      if (!list.length || !list[0]?.destination_city_id) {
        console.error("destination_city_id مقدار ندارد!");
        return;
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shouldFetch && goods_details.length && list.length) {
      fetchPricing();
      setShouldFetch(false);
    }
  }, [shouldFetch, goods_details, list, inputLng, inputLat]);

  return (
    <div className="flex items-center justify-center mb-24">
      <div className="justify-center items-center ">
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="flex w-full flex-col">
            <div className="flex flex-col">
              <label className="flex justify-center mt-2 mb-2" htmlFor="value">
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
                <p className="text-red-500 text-sm text-center">
                  {errors.value.message}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <Searchbox setValue={setValue} watch={watch} />
              {errors.destination_city_id && (
                <p className="text-red-500 text-sm text-center">
                  {errors.destination_city_id.message}
                </p>
              )}
            </div>
            <div className="flex mt-6 items-center justify-end">
              <label htmlFor="need_packaging">بسته بندی محصول ارسالی</label>
              <Controller
                name="need_packaging"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={() => field.onChange(!field.value)}
                    className={`ml-2 border-2 w-4 h-4 rounded-full transition-colors duration-300 ${
                      field.value
                        ? "bg-red-600 border-red-600"
                        : "border-gray-700"
                    }`}
                  ></button>
                )}
              />
            </div>
            {errors.need_packaging && (
              <p className="text-red-500 text-sm text-center">
                {errors.need_packaging.message}
              </p>
            )}
          </div>
          {pricingList.length > 0 ? (
            <div className="flex flex-col w-full flex-wrap justify-center mt-5">
              {pricingList.map((p, index) => (
                <div key={index} className="mb-6 rounded-2xl w-full bg-white">
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
                    <div className="flex justify-end">
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

              <div className=" flex justify-center mb-16">
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
            <div className="flex flex-col">
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
                type="submit"
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
          onClick={() => setShouldFetch(true)}
          className="py-2 px-32 text-xl bg-[#D40700] border-2 text-white rounded-full hover:border-2 hover:border-[#D40700] hover:bg-white hover:text-[#D40700] transition-colors duration-300"
        >
          محاسبه قیمت
        </button>
        <button
          type="button"
          onClick={() => {
            reset();
            handleNavigate();
          }}
          className=" mt-5 px-32 py-2 rounded-3xl border-2 bg-[#F5FCFF] text-[#17A2B8] border-[#17A2B8] hover:bg-[#17A2B8] hover:text-white transition-colors duration-300"
        >
          انتخاب مجدد مبدا
        </button>
        <AnimatePresence>
          {handlePricing && (
            <Pricing
              setHandlePricing={setHandlePricing}
              setPricingList={setPricingList}
              pricingList={pricingList}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Registration;
