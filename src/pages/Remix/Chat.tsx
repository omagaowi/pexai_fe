import { LayoutGrid, Plus, Send, Shuffle, Sparkles, WandSparkles } from "lucide-react";
import React from "react";
import MessageBox from "./MessageBox";
import Convo from "./Convo";
import useRemixStore from "@/utils/stores/remixStore";
import { useNavigate, useParams } from "react-router-dom";
import { useMutationState } from "@tanstack/react-query";
import CircularLoader from "@/components/LoaderCircular";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import useAuth from "@/utils/stores/aurhStore";


const Chat = () => {
  const { id } = useParams();

  const mutationKey = ["chats", id];

  const { userData } = useAuth()

  const navigate = useNavigate()

  const getChatMutationState = useMutationState({
    filters: { mutationKey },
    select: (mutation) => ({
      status: mutation.state.status,
      data: mutation.state.data,
      error: mutation.state.error,
    }),
  });

  const chatLatest =
    getChatMutationState.length > 0
      ? getChatMutationState[getChatMutationState.length - 1]
      : null;

 
 

  return (
    <div className="max-w-[700px] relative w-[96vw] overflow-hidden h-full">
      <div
        className={`w-full flex overflow-hidden relative`}
        style={{ height: "calc(100% - 100px)" }}
      >
        <div className="max-w-[700px] fixed w-[96vw] h-[60px] flex justify-between items-center bg-[#fff] z-9999 top-0">
           <Tooltip>
            <TooltipTrigger className="w-[40px]   h-[40px]">
              <button
                className="cursor-pointer w-full h-full transition-all duration-200  hover:bg-[#dedede]  rounded-sm flex items-center justify-center"
                onClick={() => {
                  navigate('/')
                }}
              >
                <LayoutGrid size={26} className="text-[#484848]" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="z-9999">
              <p className="text-[9px]">Home</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger className="w-[40px]   h-[40px]">
              <button
                className="cursor-pointer w-full h-full transition-all duration-200  hover:bg-[#dedede]  rounded-sm flex items-center justify-center"
                onClick={() => {
                  navigate('/remix')
                }}
              >
                <Plus size={26} className="text-[#484848]" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="z-9999">
              <p className="text-[9px]">New Chat</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div
          className={`w-full h-full transition-all duration-300  flex flex-col shrink-0 items-center justify-center ${
            !id ? "ml-[0px]" : "ml-[-100%]"
          } `}
        >
          <Sparkles size={46} className="text-[#4d4d4d]" />
          <h1 className="text-[30px] text-[#2e2e2e] mt-[10px]">
            Edit & Remix Photos
          </h1>
          <p className="w-[430px] text-[13px] text-[gray] text-center">
            Remix is powered by AI, so mistakes are possible and remixes can
            take longer time depending on the image.
          </p>
        </div>
        <div className="w-full h-full overflow-x-hidden no-scrollbar">
          {chatLatest?.status == "pending" ? (
            <div className="w-full flex items-center justify-center h-full">
              <CircularLoader
                size={81}
                strokeWidth={1}
                color="#000"
                bgColor="transparent"
                duration={2}
              />
            </div>
          ) : (
            <>
              {chatLatest?.status == "error" ? (
                <div className="w-full flex flex-col  items-center justify-center h-full">
                  <h2 className="text-[20px]">An Error Occured</h2>
                  <p className="text-[12px]">
                    {" "}
                    {chatLatest?.error?.response?.data ||
                      "Unable to load conversation"}
                  </p>
                </div>
              ) : (
                <Convo />
              )}
            </>
          )}
        </div>
      </div>
      <MessageBox active = { id && chatLatest?.data? chatLatest?.data?.data?.chat?.user_id == userData.user_id? true : false : true }/>
    </div>
  );
};

export default Chat;
