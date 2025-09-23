import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import React from "react";

const WelcomeGuide = () => {
  const [active, setActive] = useState(0);
  const [show, setShow] = useState(false);

  console.log(active);

  const videoRef = useRef(null);

  const tips = [
    {
      title: "Welcome to pexai !",
      sub: "Here are key features & tips to help you take full advantage of what pexai has to offer",
      vid: "/assets/videos/guide1.mp4",
    },
    {
      title: "Select multiple images",
      sub: "pexai allows you to select and combine multiple images into one remix",
      vid: "/assets/videos/guide1.mp4",
    },
    {
      title: "An endless search",
      sub: "pexai leverages images from multiple stock providers. during search you can choose specifically which to search from.",
      vid: "/assets/videos/guide2.mp4",
    },
    {
      title: "Remix external images",
      sub: "pexai allows you to upload images from your device and add them to the mix",
      vid: "/assets/videos/guide3.mp4",
    },
  ];

  useEffect(() => {
    if (videoRef && videoRef.current) {
      videoRef.current.play();
    }
    setTimeout(() => {
      setShow(localStorage.getItem("guide") ? false : true);
    }, 2000);
  }, [active]);

  return (
    <div
      className="w-[100vw] h-[100vh] transition-all duration-200 fixed top-0 left-0 z-9999"
      style={{
        backdropFilter: show ? "blur(4px)" : "blur(0px)",
        background: show ? "rgba(255, 255, 255, .4)" : "transparent",
        pointerEvents: show? 'all' : 'none'
      }}
    >
      <div
        className={`w-[90%] fixed top-[50%] border-1 border-t-[rgb(236,236,236)] left-[50%] flex flex-col items-center rounded-sm translate-x-[-50%] translate-y-[-50%] max-w-[600px] transition-all duration-200 ${
          show ? "opacity-100 scale-[1]" : "opacity-0 scale-[0.5]"
        }  h-[510px] bg-[#fff] shadow-xl`}
      >
        <div className="w-[96%] aspect-video  mt-[2%] rounded-sm">
          <video
            src={tips[active].vid}
            ref={videoRef}
            autoPlay
            loop
            muted
          ></video>
        </div>
        <div className="flex-1 mb-[1%] relative w-full items-center flex flex-col justify-center">
          <div className="w-full h-fit flex overflow-hidden">
            {tips.map((tip, index: number) => (
              <div
                className={`w-full h-fit shrink-0 flex flex-col transition-all duration-200 items-center ${
                  index == 0 ? `` : ""
                } `}
                style={{
                  marginLeft: index == 0 ? `-${active * 100}%` : 0,
                }}
              >
                <h2 className="text-[29px] font-semibold text-[#343434]">
                  {tip.title}
                </h2>
                <p className="max-w-[420px] w-[96%] text-[13px] text-center">
                  {tip.sub}
                </p>
              </div>
            ))}
          </div>
          <div className="flex mt-[10px]">
            <Button
              className={`w-[90px] mx-[5px] bg-[gray] cursor-pointer text-[14px] h-[40px]`}
              onClick={() => {
                if (active > 0) {
                  setActive((prev) => (prev -= 1));
                }
              }}
            >
              back
            </Button>
            <Button
              className={`w-[90px]  mx-[5px] cursor-pointer text-[14px] h-[40px]`}
              onClick={() => {
                if (active < 3) {
                  setActive((prev) => (prev += 1));
                }else{
                  localStorage.setItem('guide', true)
                  setShow(false)
                }
              }}
            >
              {active == 3 ? <>finish</> : <>next</>}
            </Button>
          </div>
          <div className="w-[96%] flex justify-center h-[5px]  absolute bottom-0 left-[50%] translate-x-[-50%]">
            {tips.map((tip, index) => (
              <div
                className={`w-[25%] h-full mx-[3px] ${
                  active >= index ? "bg-[#000000] " : "bg-[#dcd9d9] "
                } `}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeGuide;
