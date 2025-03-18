import React, { useState, useRef } from "react";

const FormDesign = ({ type }) => {
    const isLogin = type === "login";
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    };
    const handleVideoEnd = () => {
        videoRef.current.pause();
        setIsPlaying(false);
    };
    return (
        <div
            style={{
                backgroundImage: `url(${isLogin ? `/assets/backgroundImg1.png` : `/assets/backgroundImg2.png`})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: isLogin ? "83vh" : "93vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "30px"
            }}
        >
            <div
                style={{
                    width: "400px",
                    height: "220px",
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "20px",
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                    border: "2px solid #dba400"
                }}
            >
                <video
                    ref={videoRef}
                    loop={false}
                    onClick={handleVideoEnd}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                >
                    <source src="/assets/testVid.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {!isPlaying && (
                    <div
                        onClick={handlePlayPause}
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "60px",
                            height: "60px",
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="white"
                            width="30px"
                            height="30px"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormDesign;
