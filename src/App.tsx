import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import PhotoDetailsPage from "./pages/PhotoDetails";
import SigninPage from "./pages/Signin";
import { Toaster } from "sonner";
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

function App() {
  const mutationKey = ["user"];
  const { accessToken, setUserData, userData } = useAuth();

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
      //  console.log(data)
      setUserData(data.data);
    },
    onError: (error) => {
      console.log(error);
      // setIsLoading(true)
    },
  });

  useEffect(() => {
    if (!userData) {
      getUserDataMutation.mutate();
    }
  }, []);

  return (
    <div className="w-[100vw] h-[100vh]">
      {/* <QueryClientProvider client={ queryClient }> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/photo/:id" element={<PhotoDetailsPage />} />
          <Route path="/collections" element={<AllCollectionsPage />} />
          <Route path="/collections/:id" element={<ViewCollectionPage />} />
          <Route path="/likes" element={<AllLikesPage />} />
          <Route path="/auth/signin" element={<SigninPage />} />
           <Route path="/remix" element={<RemixPage />} />
            <Route path="/motion" element={<MotionTest />} />
        </Routes>
      </BrowserRouter>
      {/* </QueryClientProvider> */}
      <Modal />
      <Toaster />
      <SelectedImages />
      <FileInput id={ `files_input` }/>
    </div>
  );
}

export default App;
