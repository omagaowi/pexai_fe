import { Button } from "@/components/ui/button";
import { Key, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import InviteCode from "./InviteCode";
import React from "react";
import ApiKey from "./ApiKey";

const RemixOptions = () => {
  const [status, setStatus] = useState("default");

  const useQueryParams = () => {
    const { search } = useLocation();
    return new URLSearchParams(search);
  };
  const query = useQueryParams();

  const navigate = useNavigate();

  return (
    <div className="w-[100vw] pt-[30px] min-h-[100vh] h-fit auth-bg flex flex-col items-center justify-center">
      <div className="flex w-full h-fit justify-center max-[700px]:items-center max-[700px]:flex-col">
        <div
          className={` ${
            query.get("s") == "byok"
              ? "w-[0px] h-[0px] opacity-0"
              : query.get("s") == "invite"
              ? "w-[420px] mx-[30px] max-[700px]:max-w-[400px] max-[700px]:w-[90vw] max-[700px]:my-[15px] max-[700px]:mx-[10px] h-[260px] flex-col bg-[#fff] shadow-sm"
              : "w-[390px] mx-[30px] max-[700px]:max-w-[400px] max-[700px]:w-[90vw] max-[700px]:my-[15px] max-[700px]:mx-[10px] h-[260px] flex-col bg-[#fff] shadow-sm"
          } transition-all duration-200 overflow-hidden rounded-md flex `}
        >
          <div
            className={`w-full h-full shrink-0 flex flex-col items-center transition-all duration-200     justify-center ${
              !query.get("s") ? "mt-[0px]" : "mt-[-260px]"
            }`}
          >
            <UserPlus size={40} className="text-[#646464]" />
            <h1 className="text-[25px] mt-[10px] text-[#383838]">
              Invite Code
            </h1>
            <p className="text-[12px] mt-[7px] w-[90%] text-center">
              Access to remix is still very limited but you can use it via an
              exclusive invite code
            </p>
            <Button
              className="w-[145px] cursor-pointer text-[13px] mt-[15px] h-[40px]"
              onClick={() => {
                navigate("/auth/options?s=invite");
              }}
            >
              Use Invite Code
            </Button>
          </div>
          <InviteCode />
        </div>
        <div
          className={` ${
            query.get("s") == "invite"
              ? "w-[0px] h-[0px] opacity-0"
              : query.get("s") == "byok"
              ? "w-[420px] mx-[30px] max-[700px]:max-w-[400px] max-[700px]:w-[90vw] max-[700px]:my-[15px] max-[700px]:mx-[10px] h-[260px] flex-col bg-[#fff] shadow-sm"
              : "w-[390px] mx-[30px] max-[700px]:max-w-[400px] max-[700px]:w-[90vw] max-[700px]:my-[15px] max-[700px]:mx-[10px] h-[260px] flex-col bg-[#fff] shadow-sm"
          } transition-all duration-200 overflow-hidden rounded-md flex `}
        >
          <div
            className={`w-full h-full shrink-0 flex flex-col items-center transition-all duration-200     justify-center ${
              !query.get("s") ? "mt-[0px]" : "mt-[-260px]"
            }`}
          >
            <Key size={40} className="text-[#646464]" />
            <h1 className="text-[25px] mt-[10px] text-[#383838]">API Keys</h1>
            <p className="text-[11px] mt-[7px] w-[90%] text-center">
              Remix is powered by <b>Gemini 2.5 Image</b> you can also gain
              access <b> by bringing your own gemini or open router API key</b>
            </p>
            <Button
              className="w-[145px] cursor-pointer text-[13px] mt-[15px] h-[40px]"
              onClick={() => {
                navigate("/auth/options?s=byok");
              }}
            >
              Add Api Key
            </Button>
          </div>
          <ApiKey />
        </div>
      </div>
      <h3 className="absolute font-semibold hover:underline top-[10px] cursor-pointer right-[10px]" onClick={ () => {
        navigate(`/`)
      } }>
        Skip and continue without membership
      </h3>
    </div>
  );
};

export default RemixOptions;
