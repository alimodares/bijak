import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = Yup.object().shape({
  titel: Yup.string().required(" عنوان کالا الزامی است"),
  width: Yup.number()
    .typeError("باید عدد باشد")
    .required(" عرض کالا الزامی است")
    .positive("عدد باید مثبت باشد"),
  length: Yup.number()
    .typeError("باید عدد باشد")
    .required(" طول کالا الزامی است")
    .positive("عدد باید مثبت باشد"),
  weight: Yup.number()
    .typeError("باید عدد باشد")
    .required(" وزن کالا الزامی است")
    .positive("عدد باید مثبت باشد"),
  height: Yup.number()
    .typeError("باید عدد باشد")
    .required(" ارتفاع کالا الزامی است")
    .positive("عدد باید مثبت باشد"),
  goods_count: Yup.number()
    .typeError("باید عدد باشد")
    .required(" تعداد کالا الزامی است")
    .positive("عدد باید مثبت باشد"),
});

const Pricing = ({ setHandlePricing , setPricingList , pricingList}) => {

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitForm = (data) => {
    console.log("formtwo", pricingList);
  
    const { value, ...restData } = data; 
  
    setPricingList(prev => [...prev, restData]);
  
    reset({});
    setHandlePricing(false);
  };

  const closemenuall = () => {
    setHandlePricing(false);
  };

  return (
    <div className="fixed inset-0 min-w-[425px] max-w-[425px] ml-auto mr-auto flex justify-center items-end bg-black/50">
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <div className="bg-white rounded-t-3xl p-6 shadow-lg transform transition-all duration-300 min-w-[425px]">
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
            {/* استفاده از onSubmit برای فرم */}
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
              <div className="flex flex-col mt-2 mb-6">
                <label className="flex justify-end mb-2" htmlFor="goods_count">
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
                className="w-full py-2 bg-red-500 text-white rounded-lg"
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
