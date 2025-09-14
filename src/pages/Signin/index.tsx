import CircularLoader from "@/components/LoaderCircular";
import { Button } from "@/components/ui/button";
import handleError from "@/utils/handleErrors";
import useAuth, { root_uri } from "@/utils/stores/aurhStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Cookies from 'js-cookie'

const SigninPage = () => {
  const useQueryParams = () => {
    const { search } = useLocation();
    return new URLSearchParams(search);
  };

  const query = useQueryParams();

  const navigate = useNavigate()

  const { setAccessToken, setUserData } =useAuth()

  const getGoogleAuthURLMutation = useMutation({
    mutationKey: ["getGoogleURL"],
    mutationFn: () => {
      return axios.get(`${root_uri}/auth/google/signin`);
    },
    onSuccess: (data) => {
      window.location.href = data.data.url;
    },
    onError: (error: any) => {
      if (error.response) {
        toast.error("An Error Occured");
        toast.error("An Error Occured", {
          description: error.response.data.message,
        });
      } else {
        toast.error("An Error Occured", {
          description: "Please check your internet connection",
        });
      }
    },
  });

  const signinMutation = useMutation({
    mutationKey: ["signInKey"],
    mutationFn: () => {
      return axios.get(
        `${root_uri}/auth/signin?code=${query.get("code")}`
      );
    },
    onSuccess: (data) => {
      setAccessToken(data.data.token)
       Cookies.set('accessToken', data.data.token, { expires: 28 })
       const { token, ...user } = {...data.data }
      setUserData(user)
 
      if(user.membership_status == 'active'){
        navigate(`/`)
      }else{
        navigate('/auth/options')
      }
      
    }
  });

  const fetchGoogleLink = () => {
    if (!getGoogleAuthURLMutation.isPending && !signinMutation.isPending) {
      getGoogleAuthURLMutation.mutate();
    }
  };

  useEffect(() => {
    if (query.get("code")) {
      signinMutation.mutate();
    }
  }, []);

 

  return (
    <div className="w-[100vw] min-h-[100vh] h-fit auth-bg flex items-center justify-center">
      {/* <div className="fixed top-0 left-0 bottom-0 right-0 auth-grad"></div> */}
      <div className="w-[94vw] max-w-[400px] rounded-md h-[260px] bg-[#fff] shadow-sm">
        {signinMutation.isError ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-exclamation-circle w-[60px] h-[60px]"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
            </svg>
            <h2 className="font-semibold mt-[16px]">An Error Occured</h2>
            <p className="text-[gray]">{ handleError(signinMutation.error) }</p>
            <Button className="w-[90px] mt-[15px] cursor-pointer text-[14px] h-[40px]" onClick={ () => {
              if(!getGoogleAuthURLMutation.isPending){
                 fetchGoogleLink()
              }
            } }>
              {
                getGoogleAuthURLMutation.isPending? (
                 <CircularLoader
                    size={21}
                    strokeWidth={2}
                    color="#fff"
                    bgColor="#000"
                    duration={2}
                  />
                ):(
                  <>Retry</>
                )
              }
            </Button>
          </div>
        ) : (
          <div className="w-full h-full pl-[20px]">
            <img src="/assets/logo/logo1.png" className="w-[110px] mt-[30px]" />
            <div className="mt-[30px]">
              <h2 className="font-bold">Sign in</h2>
              <p className="text-[15px] text-[#6b6b6b]">
                to continue to <b>pexai</b>
              </p>
            </div>
            <button
              className={`flex items-center rounded-md mt-[20px] ${
                !signinMutation.isPending ? "cursor-pointer" : ""
              } justify-center w-[90%] h-[43px] border-[1px] border-[#e2e2e2]`}
              onClick={() => {
                fetchGoogleLink();
              }}
            >
              {signinMutation.isPending ? (
                <>
                  <CircularLoader
                    size={21}
                    strokeWidth={2}
                    color="#000"
                    bgColor="#fff"
                    duration={2}
                  />
                  <p className="ml-[10px] text-[#6f6f6f]">Signing in...</p>
                </>
              ) : (
                <>
                  {getGoogleAuthURLMutation.isPending ? (
                    <CircularLoader
                      size={21}
                      strokeWidth={2}
                      color="#000"
                      bgColor="#fff"
                      duration={2}
                    />
                  ) : (
                    <img
                      src="/assets/logo/google.png"
                      className="w-[23px]"
                      alt=""
                    />
                  )}
                  <p className="ml-[10px] text-[#6f6f6f]">
                    Sign in with Google
                  </p>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SigninPage;
