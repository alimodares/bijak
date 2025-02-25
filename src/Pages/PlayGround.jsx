import { useEffect, useState } from "react"
import RegisterProduct from "../components/registerProduct"
import { useForm } from "react-hook-form"


const PlayGround =()=>{


const [list,setList]=useState([])

const {
    handleSubmit,
    control,
    resset,
    formState:{errors},
    register
    ,
    watch,
    setValue
} = useForm()






useEffect(()=>{
    console.log(list);
    
},[
    list
])


const func=(data)=>{

console.log(list.length);
console.log(list.length);




    if (!data) {
        alert('data')
        return
    }

    if (list.length<1) {
        alert('list')
        return
    }

    const command= {
        listItem:[...list],
        ...data
    }


    console.log(command);
    
}


const formatNumber = (num) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

    return(



        <div className="h-screen">
        {/* <div  className="flex flex-col  gap-3  h-[50%]">

        {
            list?.map(item=>(
                
                
                <h1>{item.title}</h1>
                
            ))
           
        }
         </div> */}


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







         <div className="mt-5 h-[50%] " >
            <RegisterProduct  list={list} setList={setList} />
         </div>





         <button  className = 'mt-10 'onClick={handleSubmit(func)} >submit</button>
        
        </div>
    )
}

export default PlayGround