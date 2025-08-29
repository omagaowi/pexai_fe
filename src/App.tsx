import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import PhotoDetailsPage from "./pages/PhotoDetails";
import SigninPage from "./pages/Signin";
import { Toaster } from "sonner";
import axios from "axios";
import useAuth, { root_uri } from "./utils/stores/aurhStore";
import Modal from "./components/Modal";

function App() {
  const mutationKey = ['user']
  const { accessToken, setUserData, userData } = useAuth() 
  


    const getUserDataMutation = useMutation({
    mutationKey: mutationKey,
    mutationFn: () => {
      return axios.get(`${ root_uri }/auth/user`, {headers: {
        'Authorization': `Bearer ${ accessToken }`
      } });
    },
    onSuccess: (data) => {
    //  console.log(data)
      setUserData(data.data)
    },
    onError: (error) => {
      console.log(error)
      // setIsLoading(true)
    },
  });

  useEffect(()=> {
    if(!userData){
        getUserDataMutation.mutate()
    }
  }, [])

  return (
    <div className="w-[100vw] h-[100vh]">
      {/* <QueryClientProvider client={ queryClient }> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/photo/:id" element={<PhotoDetailsPage />} />
          <Route path="/auth/signin" element={<SigninPage />} />
        </Routes>
      </BrowserRouter>
      {/* </QueryClientProvider> */}
      <Modal />
      <Toaster />
    </div>
  );
}

export default App;
