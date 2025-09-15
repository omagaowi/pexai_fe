import {
  handleChain,
  handleConnectError,
  handleImageAlerts,
  handleSubError,
  onConnect,
} from "@/App";
import { data } from "react-router-dom";
import { Socket } from "socket.io-client";

type StartAck = { status: "ok" };

export const Events = (clientSocket: Socket) => {
  clientSocket.on("connect_error", (data) => {
    handleConnectError(data);
  });
  clientSocket.on("start", (data, ack: (response: StartAck) => void) => {
    onConnect(data);
    ack({ status: "ok" });
  });
  clientSocket.on("chain", (data, ack: (response: StartAck) => void) => {
//    //    console.log("chain", data);
    ack({ status: "ok" });
    handleChain(data);
  });
  clientSocket.on("image", (data, ack: (response: StartAck) => void) => {
    ack({ status: "ok" });
//    //    console.log("alert", data);
    handleImageAlerts(data);
  });
  clientSocket.on("raw", (data, ack: (response: StartAck) => void) => {
    ack({ status: "ok" });
//    //    console.log("raw", data);
  });
  clientSocket.on("sub_error", (data, ack: (response: StartAck) => void) => {
    ack({ status: "ok" });
    handleSubError(data);
//    //    console.log("sub_error", data);
  });

  clientSocket.on("context", (data, ack: (response: StartAck) => void) => {
    ack({ status: "ok" });
//    console.log("context", data);
    //  handleSubError(data)
//    //    console.log("sub_error", data);
  });
};
