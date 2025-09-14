import CircularLoader from "@/components/LoaderCircular";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { detectApiKeyType, encryptData } from "@/lib/utils";
import { formatDate } from "@/utils/dateFormat";
import useAuth, { root_uri } from "@/utils/stores/aurhStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Key } from "lucide-react";
import React, { FormEvent, FormEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ApiKey = () => {
  const { accessToken } = useAuth();

  const [update, setUpdate] = useState(localStorage.getItem('key') ? false : true)

  const navigate = useNavigate();

  const verifyInviteCode = useMutation({
    mutationKey: ["verifyInvite"],
    mutationFn: (code: string) => {
      const body = {
        code: code,
      };
      return axios.post(`${root_uri}/subs/codes/use`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
    onSuccess: (data) => {
      toast.success("Subscription Activated", {
        description: "Welcome to pexai!!",
        position: "top-right",
      });
      navigate("/");
    },
    onError: (error: any) => {
      if (error.response) {
        toast.error("An Error Occured", {
          description: error.response.data,
        });
      } else {
        toast.error("An Error Occured", {
          description: "Please check your internet connection",
        });
      }
    },
  });

  return (
    <>
      {!update ? (
        <div className="w-full h-[260px] shrink-0 flex flex-col items-center justify-center">
          <Key size={40} className="text-[#646464]" />
          <h1 className="text-[25px] mt-[10px] text-[#383838]">
            API Key detected
          </h1>
          <p className="text-[11px] mt-[7px] w-[90%] text-center">
            Due to security you can't view the api key last updated on{" "}
            <b> { JSON.parse(localStorage.getItem('key'))? formatDate(JSON.parse(localStorage.getItem('key')).date).fullLong : '' } </b> at <b>{ JSON.parse(localStorage.getItem('key'))? formatDate(JSON.parse(localStorage.getItem('key')).date).time : '' }</b> but you can choose to
            update it
          </p>
          <div className="flex">
             <Button
            className="w-[145px] mx-[7px] cursor-pointer text-[13px] mt-[15px] h-[40px]"
            onClick={() => {
             setUpdate(true)
            }}
          >
            Update Api Key
          </Button>
          <Button
            className="w-[145px] mx-[7px] bg-[red] hover:bg-[#410000] cursor-pointer text-[13px] mt-[15px] h-[40px]"
            onClick={() => {
             localStorage.removeItem('key')
             toast.success('API key removed', {
                position: 'top-right'
             })
             setUpdate(true)
            }}
          >
            Remove Key
          </Button>
          </div>
         
        </div>
      ) : (
        <form
          className="w-full h-[260px] shrink-0 flex flex-col items-center justify-center"
          onSubmit={(e: any) => {
            e.preventDefault();
            if (e.target.key.value && detectApiKeyType(e.target.key.value)) {
              const newKey = {
                date: Date.now(),
                key: e.target.key.value,
                service: detectApiKeyType(e.target.key.value),
              };
              localStorage.setItem("key", JSON.stringify(newKey));
              toast.success("API key has been updated!", {
                position: "top-right",
              });
              navigate("/");
            } else {
              toast.error("Invalid API Key");
            }
          }}
        >
          <h1 className="text-[25px] mt-[10px] text-[#383838]">
            Enter API Key
          </h1>
          <Input
            type="text"
            className="w-[90%] placeholder:text-[11px] text-[13px] h-[46px] mt-[20px]"
            placeholder="Enter an open router or google gemini api key"
            name="key"
            autoComplete="false"
          />
          <p className="text-[10px] mt-[7px]">
            <b>PS</b>: API keys are secured stored on your device and never on
            our servers
          </p>
          <Button
            className="w-[105px] outline-none  cursor-pointer text-[13px] mt-[20px] h-[40px]"
            onClick={() => {
              // navigate("/auth/options?s=invite");
            }}
          >
            {verifyInviteCode.status == "pending" ? (
              <CircularLoader
                size={21}
                strokeWidth={2}
                color="#fff"
                bgColor="#000"
                duration={2}
              />
            ) : (
              <> Done</>
            )}
          </Button>
        </form>
      )}
    </>
  );
};

export default ApiKey;
