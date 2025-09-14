import React from "react";
import UserMessage from "./UserMessage";
import { useParams } from "react-router-dom";
import useRemixStore from "@/utils/stores/remixStore";
import AssistantMessage from "./AssistantMessage";

let handleChain

const Convo = () => {
  const { id } = useParams();

  const { messages } = useRemixStore();

 

  return (
    <div className="w-full min-h-full h-fit py-[80px] pb-[90px]">
      {messages.filter(function(el){ return el.chat_id == id }).map((message) => (
        <>
          {message.role == "user" ? <UserMessage message={message} /> : <AssistantMessage message = { message }/>}
        </>
      ))}
      
    </div>
  );
};

export default Convo;
export { handleChain }