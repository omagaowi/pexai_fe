import CircularLoader from "@/components/LoaderCircular";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth, { root_uri } from "@/utils/stores/aurhStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { FormEvent, FormEventHandler } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const InviteCode = () => {
  const { accessToken } = useAuth();

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
    <form
      className="w-full h-[260px] shrink-0 flex flex-col items-center justify-center"
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        const code = e.target.code.value as string;
        if (code) {
          verifyInviteCode.mutate(code);
        }
      }}
    >
      <h1 className="text-[25px] mt-[10px] text-[#383838]">
        Enter Invite Code
      </h1>
      <Input
        type="text"
        className="w-[90%] placeholder:text-[13px] text-[13px] h-[46px] mt-[20px]"
        placeholder="Invite Code"
        name="code"
      />
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
  );
};

export default InviteCode;
