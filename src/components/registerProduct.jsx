import { Controller, useForm } from "react-hook-form"



const RegisterProduct =({setList,list})=>{


const {
    handleSubmit,
    control,
    resset,
    formState:{errors},
    register
} = useForm()



const submitForm =(data)=>{

    setList([...list,data])
}

    return(

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
              placeholder="CM مثلا 500 "
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
              placeholder="CM مثلا 500 "
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
              placeholder="CM مثلا 500 "
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
              placeholder=" مثلا 10 کیلو گرم"
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
              بسته بندی محصول ارسالی
            </p>
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-red-500 text-white rounded-lg"
        >
          ثبت کالا
        </button>
      </form>



    )
}


export default RegisterProduct