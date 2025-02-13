import React from "react";

const Navbar = () => {
  return (
    <div className="bg-[#D40700] p-3 flex justify-end">
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
