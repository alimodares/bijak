import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";

const schema = Yup.object().shape({
  titel: Yup.string().required(" عنوان کالا الزامی است"),
  width: Yup.number()
    .typeError(" عرض کالا الزامی است")
    .required(" عرض کالا الزامی است")
    .positive("عدد باید مثبت باشد"),
  length: Yup.number()
    .typeError(" طول کالا الزامی است")
    .required(" طول کالا الزامی است")
    .positive("عدد باید مثبت باشد"),
  weight: Yup.number()
    .typeError("وزن کالا الزامی است")
    .required(" وزن کالا الزامی است")
    .positive("عدد باید مثبت باشد"),
  height: Yup.number()
    .typeError("ارتفاع کالا الزامی است")
    .required(" ارتفاع کالا الزامی است")
    .positive("عدد باید مثبت باشد"),
  goods_count: Yup.number()
    .typeError("تعداد کالا الزامی است")
    .required(" تعداد کالا الزامی است")
    .positive("عدد باید مثبت باشد"),
  needs_packaging: Yup.boolean(),
});

const Pricing = ({
  setShowPricingModal,
  setPricingList,
  pricingList,
  editingItem,
  setEditingItem,
}) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
    control,
  } = useForm({
    defaultValues: {
      needs_packaging: false,
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (editingItem) {
      reset(editingItem);
    }
  }, [editingItem, reset]);

  const submitForm = (data) => {
    if (editingItem) {
      const updatedList = pricingList.map((item) =>
        item.id === editingItem.id ? { ...data, id: editingItem.id } : item
      );
      setPricingList(updatedList);
      setEditingItem(null);
    } else {
      setPricingList([...pricingList, { ...data, id: uuidv4() }]);
    }

    reset({});
    setShowPricingModal(false);
  };

  const closemenuall = () => {
    setShowPricingModal(false);
  };

  return (
    <div className="fixed inset-0 max-w-[425px] ml-auto mr-auto flex justify-center items-end bg-black/50">
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <div className="bg-white rounded-t-3xl p-4 shadow-lg transform transition-all duration-300 ">
          <div className="flex justify-center mb-5 ">
            <button onClick={closemenuall} className="mr-auto">
              <img src="/Vector.svg" alt="dsfgsg" width={15} height={12} />
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
          <div>
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
                  tabIndex={1}
                />
                {errors.titel && (
                  <p className="text-red-500 text-end">
                    {errors.titel.message}
                  </p>
                )}
              </div>
              <div className="flex flex-row mt-2">
                <div className="flex flex-col mr-5">
                  <label className="flex justify-end mb-2" htmlFor="width">
                    عرض
                  </label>
                  <input
                    className="border-2 border-[#C0BFBF] p-2 rounded-xl w-full text-end"
                    type="number"
                    placeholder="cm مثلا 50"
                    {...register("width")}
                    tabIndex={3}
                  />
                  {errors.width && (
                    <p className="text-red-500 text-end">
                      {errors.width.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="flex justify-end mb-2" htmlFor="length">
                    {" "}
                    طول
                  </label>
                  <input
                    className="border-2 border-[#C0BFBF] p-2 rounded-xl w-full text-end"
                    type="number"
                    placeholder="cm مثلا 50"
                    {...register("length")}
                    tabIndex={2}
                  />
                  {errors.length && (
                    <p className="text-red-500 text-end">
                      {errors.length.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-row mt-3">
                <div className="flex flex-col mr-5">
                  <label className="flex justify-end mb-2" htmlFor="weight">
                    وزن
                  </label>
                  <input
                    className="border-2 border-[#C0BFBF] p-2 rounded-xl w-full text-end"
                    type="number"
                    placeholder="مثلا 10 کیلوگرم"
                    {...register("weight")}
                    tabIndex={5}
                  />
                  {errors.weight && (
                    <p className="text-red-500 text-end">
                      {errors.weight.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="flex justify-end mb-2" htmlFor="height">
                    {" "}
                    ارتفاع
                  </label>
                  <input
                    className="border-2 border-[#C0BFBF] p-2 rounded-xl w-full text-end"
                    type="number"
                    placeholder="cm مثلا 50"
                    {...register("height")}
                    tabIndex={4}
                  />
                  {errors.height && (
                    <p className="text-red-500 text-end">
                      {errors.height.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col mt-2 mb-6">
                <label className="flex justify-end mb-2" htmlFor="goods_count">
                  تعداد
                </label>
                <input
                  className="border-2 border-[#C0BFBF] p-2 rounded-xl w-full text-end"
                  type="number"
                  placeholder=" تعداد کالا را وارد کنید "
                  {...register("goods_count")}
                  tabIndex={6}
                />
                {errors.goods_count && (
                  <p className="text-red-500 text-end">
                    {errors.goods_count.message}
                  </p>
                )}
              </div>
              <div className="flex flex-row my-6 items-center justify-end">
                <label htmlFor="needs_packaging" className="flex items-center">
                  <Controller
                    name="needs_packaging"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        id="needs_packaging"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="sr-only peer"
                      />
                    )}
                  />
                  <p className="ms-3  text-sm font-medium mr-3">
                    از خدمات بسته بندی بیجک استفاده میکنم
                  </p>
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#D40700] text-white rounded-xl"
              >
                ثبت کالا
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Pricing;
