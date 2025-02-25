import React from "react";

const Navbar = () => {
  return (
    <div className="bg-[#D40700] p-3 flex justify-end">
            <a className="text-white flex mr-auto items-center underline" target="_blank" href="https://bijak.ir/%D8%B1%D8%A7%D9%87%D9%86%D9%85%D8%A7/#wz-section-wzs88"> راهنمای استفاده از خدمات بیجک </a>
      <a href="https://bijak.ir/">
        <div className="flex items-center text-white text-lg">
            <p>بیجک</p>
          <img
            className="w-9 "
            src={`${process.env.PUBLIC_URL}/bjak_favicon.png`}
            alt=""
          />
        </div>
      </a>
    </div>
  );
};

export default Navbar;
