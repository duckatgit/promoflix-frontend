import React from "react";

const PasswordDesign = ({ type }) => {
    const isForgot = type === "forgot";
    return (
        <div
            style={{
                backgroundImage: `url(${isForgot ? `/assets/backgroundImg1.png` : `/assets/backgroundImg3.png`})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "90vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div className="w-[335px] h-[335px]"> <img src="/assets/lock.png" alt="" /></div>
        </div>
    );
};

export default PasswordDesign;
