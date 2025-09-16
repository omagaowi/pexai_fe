import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import useAuth, { root_uri } from "@/utils/stores/aurhStore";
import useRemixStore from "@/utils/stores/remixStore";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const RemixPage = () => {
  const { messages, setMessages, setIsGenerating } = useRemixStore();

  const { id } = useParams();

  const location = useLocation();

  const { accessToken } = useAuth();

   const useQueryParams = () => {
      const { search } = useLocation();
      return new URLSearchParams(search);
    };
    const query = useQueryParams();

  const getChatMutation = useMutation({
    mutationKey: ["chats", id],
    mutationFn: () => {
      return axios.get(`${root_uri}/chats/${id}?cf=${ query.get('cf') || false }`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
    onMutate: () => {
      // setIsLoading(true)
    },
    onSuccess: (data) => {
//      console.log(data);
      let dummyMessages = [];
      const chatMessages = data.data.messages;
      chatMessages.forEach((message) => {
        if (message.role == "user") {
          const newMessage = {
            role: "user",
            chat_id: id,
            text: message.text,
            images: message.images.map((file) => ({
              pexai_id: file.file_id,
              origin: origin,
              url: file.url,
              thumbnail: file.url,
            })),
          };
          dummyMessages.push(newMessage);
        } else {
          if (message.status == "pending") {
            const newMessage = {
              role: "assistant",
              refresh: true,
              chat_id: id,
              starting_generation: {
                status: "in progress",
                url: "",
              },
              generating_image: {
                status: "pending",
                url: "",
              },
              saving_image: {
                status: "pending",
                url: "",
              },
              message: {
                status: "pending",
                url: "",
              },
            };
            dummyMessages.push(newMessage);
          } else if (message.status == "completed") {
            const newMessage = {
              role: "assistant",
              chat_id: id,
              starting_generation: {
                status: "completed",
                url: "",
              },
              generating_image: {
                status: "completed",
                url: "",
              },
              saving_image: {
                status: "completed",
                url: message.images[0].url,
              },
              message: {
                status: "completed",
                url: message.images[0].url,
                data: message.text,
              },
            };
            dummyMessages.push(newMessage);
          } else {
            const newMessage = {
              role: "assistant",
              chat_id: id,
              starting_generation: {
                status: "error",
                url: "",
                data: "",
              },
              generating_image: {
                status: "pending",
                url: "",
              },
              saving_image: {
                status: "pending",
                url: "",
              },
              message: {
                status: "pending",
                url: "",
                data: "",
              },
            };
            dummyMessages.push(newMessage);
          }
        }
      });
//      console.log(dummyMessages);
      setMessages([...messages, ...dummyMessages]);
    },
    onError: (error) => {},
  });

  const checkError = (message) => {
    if (message.role == "assistant") {
      if (
        message.starting_generation.status == "error" ||
        message.generating_image.status == "error" ||
        message.saving_image.status == "error" ||
        message.message.status == "error"
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (id) {
      setIsGenerating(true);
    }
    const thisMessages = messages.filter(function (el) {
      return el.chat_id == id;
    });
    if (
      id &&
      thisMessages.length > 0 &&
      thisMessages[thisMessages.length - 1]?.role == "assistant"
    ) {
      const thisMessage = thisMessages[thisMessages.length - 1];
      if (
        thisMessage.saving_image.status == "completed" ||
        thisMessage.message.status == "completed" ||
        checkError(thisMessage)
      ) {
        setIsGenerating(false);
      }
    }
  }, [messages, location]);

  useEffect(() => {
    if (
     id && messages.filter(function (el) {
        return el.chat_id == id;
      }).length == 0
    ) {
      getChatMutation.mutate();
    }
  }, [location]);

  return (
    <div className="w-[100vw] flex items-center justify-center h-[100vh]">
      <Chat />
    </div>
  );
};

export default RemixPage;
