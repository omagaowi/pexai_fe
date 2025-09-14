import React, { useContext, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import PhotoDetailsPage from "./pages/PhotoDetails";
import SigninPage from "./pages/Signin";
import { toast, Toaster, useSonner } from "sonner";
import axios from "axios";
import useAuth, { root_uri } from "./utils/stores/aurhStore";
import Modal from "./components/Modal";
import AllCollectionsPage from "./pages/AllCollections";
import ViewCollectionPage from "./pages/ViewCollection";
import AllLikesPage from "./pages/AllLikes";
import RemixPage from "./pages/Remix";
import FileInput from "./utils/useFiles";
import SelectedImages from "./components/SelectedImages";
import MotionTest from "./pages/MotionTest";
import { Events } from "./utils/events";
import { io } from "socket.io-client";
import useRemixStore from "./utils/stores/remixStore";
import AllRemixesPage from "./pages/AllRemixes";
import useImageStore from "./utils/stores/imageStore";
import SearchPage from "./pages/Search";
import RemixOptions from "./pages/Options";
import { ModalContext } from "./contexts/ModalContext";
import SubscriptionError from "./components/SubscriptionError";

let onConnect;
let handleImageAlerts;
let handleChain;
let handleConnectError;
let handleSubError;

function App() {
  const mutationKey = ["user"];

  const { openModal } = useContext(ModalContext);

  const {
    accessToken,
    setUserData,
    userData,
    clientSocket,
    isConnected,
    setClientSocket,
    setIsConnected,
  } = useAuth();

  const { toasts } = useSonner();

  const { messages, setMessages, setAlerts, alerts } = useRemixStore();

  const getUserDataMutation = useMutation({
    mutationKey: mutationKey,
    mutationFn: () => {
      return axios.get(`${root_uri}/auth/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
    onSuccess: (data) => {
 
      setUserData(data.data);
    },
    onError: (error) => {
 
      // setIsLoading(true)
    },
  });

  const { photos, setPhotos } = useImageStore();

  onConnect = (data) => {
 
    setIsConnected(true);
    toast.success("Connected", {
      id: "connect",
      position: "bottom-right",
      duration: 1000,
    });
  };

 

  handleChain = (data) => {
    if (data.user_id == userData.user_id) {
      const chatMessages = messages.filter(function (el) {
        return el.chat_id == data.chat_id;
      });
      const lastMessage = chatMessages[chatMessages.length - 1];
      if (chatMessages.length > 0) {
        if (lastMessage && lastMessage.role == "assistant") {
          const { user_id, ...thisMessage } = { ...data };
          const dummyMesssages = [...messages];
          dummyMesssages[dummyMesssages.indexOf(lastMessage)] = {
            ...thisMessage,
            role: "assistant",
          };
          setMessages(dummyMesssages);
        } else {
          const { user_id, ...thisMessage } = { ...data };
          setMessages([...messages, { ...thisMessage, role: "assistant" }]);
        }
      }
    }
  };

  handleSubError = (data) => {
    openModal(<SubscriptionError data={data} />, {});
  };

  handleImageAlerts = (data) => {
 
    if (data.status == "pending") {
      setAlerts([...alerts, data]);
    } else {
      setAlerts([
        ...alerts.filter(function (el) {
          return el.chat_id != data.chat_id;
        }),
      ]);
      toast.dismiss(data.chat_id);
      if (data.status == "completed") {
        toast.success("image generation complete", {
          position: "top-right",
        });
        const path = window.location.href.split("/")[3];

        if (path == "remixes") {
          if (photos.length > 0) {
            const dummyPhotos = [...photos];
            const thisPhoto = photos.find(function (el) {
              return el.id == data.image_id;
            });
            if (thisPhoto) {
              dummyPhotos[dummyPhotos.indexOf(thisPhoto)] = data.data;
              setPhotos([...dummyPhotos]);
            }
          }
        }
      } else {
        toast.error("Error generating image", {
          position: "bottom-right",
        });
      }
    }
  };

 

  handleConnectError = (data) => {
    setIsConnected(false);
    if (accessToken && accessToken != 'undefined') {
      toast.loading("Reconnecting..", {
        id: "connect",
        position: "bottom-right",
        duration: Infinity,
      });
    }
  };

  useEffect(() => {
    if (!userData) {
      getUserDataMutation.mutate();
    }

    if (!clientSocket && accessToken) {
      const thisSocket = io("http://localhost:4000", {
        auth: {
          token: accessToken,
        },
      });

      setClientSocket(thisSocket);
      Events(thisSocket);

      return () => {
        thisSocket.off("connect_error");
        thisSocket.off("chain");
        thisSocket.off("image");
        thisSocket.off("start");
        thisSocket.disconnect();
      };
    }
  }, [accessToken]); // remove isConnected dependency


 

  return (
    <div className="w-[100vw] h-[100vh]">
      {/* <QueryClientProvider client={ queryClient }> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/photo/:id" element={<PhotoDetailsPage />} />
          <Route path="/collections" element={ accessToken? <AllCollectionsPage /> : <Navigate to={ '/auth/signin' }  /> } />
          <Route path="/collections/:id" element={ accessToken? <ViewCollectionPage /> : <Navigate to={ '/auth/signin' }  /> } />
          <Route path="/likes" element={ accessToken? <AllLikesPage /> : <Navigate to={ '/auth/signin' }  /> } />
          <Route path="/auth/signin" element={<SigninPage />} />
          <Route path="/auth/options" element={ accessToken? <RemixOptions /> : <Navigate to={ '/auth/signin' }  /> } />
          <Route path="/remix" element={ accessToken? <RemixPage /> : <Navigate to={ '/auth/signin' }  /> } />
          <Route path="/remix/:id"  element={ accessToken? <RemixPage /> : <Navigate to={ '/auth/signin' }  /> } />
          <Route path="/remixes"  element={ accessToken? <AllRemixesPage /> : <Navigate to={ '/auth/signin' }  /> } />
          <Route path="/search" element={<SearchPage />} />
          {/* <Route path="/motion" element={<MotionTest />} /> */}
        </Routes>
        <Modal />
        <Toaster />
        <SelectedImages />
      </BrowserRouter>
      {/* </QueryClientProvider> */}
      <FileInput id={`files_input`} />
    </div>
  );
}

export {
  onConnect,
  handleChain,
  handleImageAlerts,
  handleConnectError,
  handleSubError,
};

export default App;
