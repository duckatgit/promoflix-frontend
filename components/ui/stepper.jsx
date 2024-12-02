import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";

const Stepper = ({ activeStep, setActiveStep, steps }) => {
    const { toast } = useToast();
    // const steps = [
    //     { title: "Step 1", icon: "icon1" },
    //     { title: "Step 2", icon: "icon2" },
    //     { title: "Step 3", icon: "icon3" },
    // ];

    // const handleNext = () => {

    //     if ((segmentArray?.length == 0 && activeStep == 0) || (!hasFile && activeStep == 1)) {
    //         toast({
    //             type: "warning",
    //             description: activeStep == 0 ? "before going to next step Please choose segment!" : "before going to next step Please choose file",
    //         });
    //     }
    //     else {
    //         if (activeStep < steps.length - 1) {
    //             setActiveStep((prev) => prev + 1);
    //         }
    //     }

    // };

    //     const handlePrev = () => {
    //         if (activeStep > 0) {
    //             setActiveStep((prev) => prev - 1);
    //         }
    // };

    return (
        <div className="w-full px-24 py-4 mb-8">
            {/* Stepper Line */}
            <div className="relative flex items-center justify-between w-full">
                {/* Background Line */}
                <div className="absolute left-0 top-2/4 h-0.5 w-full -translate-y-2/4 bg-gray-300"></div>

                {/* Progress Bar */}
                <div
                    className={`absolute left-0 top-2/4 h-0.5 -translate-y-2/4 transition-all duration-500 ${activeStep > 0 ? "bg-gray-900" : "bg-transparent"
                        }`}
                    style={{
                        width: `${(activeStep / (steps.length - 1)) * 100}%`, // Updated calculation
                    }}
                ></div>

                {/* Dynamic Steps */}
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className={`relative z-10 grid w-10 h-10 font-bold rounded-full place-items-center transition-all duration-300 ${index <= activeStep
                            ? "bg-gray-900 text-white"
                            : "bg-gray-300 text-gray-900"
                            }`}
                    >
                        <span>{index + 1}</span>
                        <div className="absolute -bottom-[2rem] w-max text-center">
                            <h6
                                className={`block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal ${index <= activeStep ? "text-gray-700" : "text-gray-400"
                                    }`}
                            >
                                {step.title}
                            </h6>
                            <p
                                className={`block font-sans text-base antialiased font-normal leading-relaxed ${index <= activeStep ? "text-gray-700" : "text-gray-400"
                                    }`}
                            >
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            {/* <div className="flex justify-between mt-32">
                <button
                    className={`select-none rounded-lg py-3 px-6 text-center font-bold uppercase shadow-md transition-all ${activeStep === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-900 text-white hover:shadow-lg"
                        }`}
                    onClick={handlePrev}
                    disabled={activeStep === 0}
                >
                    Prev
                </button>
                <button
                    className={`select-none rounded-lg py-3 px-6 text-center font-bold uppercase shadow-md transition-all ${activeStep === steps.length - 1
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-900 text-white hover:shadow-lg"
                        }`}
                    onClick={handleNext}
                    disabled={activeStep === steps.length - 1}
                >
                    Next
                </button>
            </div> */}
        </div>
    );
};

export default Stepper;
