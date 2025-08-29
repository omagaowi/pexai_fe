import React from "react";
import { Button } from "./ui/button";
import {
  Heart,
  Layers,
  LogOut,
  RotateCcw,
  Search,
  Shuffle,
} from "lucide-react";
import useAuth from "@/utils/stores/aurhStore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useMutationState } from "@tanstack/react-query";
import CircularLoader from "./LoaderCircular";

const Navbar = () => {
  const { accessToken, userData } = useAuth();

  const mutationKey = ["user"];

  const userMutationState = useMutationState({
    filters: { mutationKey },
    select: (mutation) => ({
      status: mutation.state.status,
      data: mutation.state.data,
      error: mutation.state.error,
    }),
  });

  const userLatest =
    userMutationState.length > 0
      ? userMutationState[userMutationState.length - 1]
      : null;

  console.log(userLatest?.status);

  return (
    <div className="w-full h-[80px] bg-[#fff] z-9999 fixed flex navbar justify-between items-center border-b-[1px] border-[#f2f2f2]">
      <div className="w-[105px] ml-[15px]">
        <img src="/assets/logo/logo1.png" className="w-full" />
      </div>
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="max-w-[540px] flex items-center h-[55px] rounded-lg nav-search bg-[#f5f5f5] w-[90%]">
          {/* <div className="w-[50px] flex items-center justify-center h-[50px] mx-[5px] rounded-lg bg-[#fff] shadow-xsm">
                        <Search className="text-[#4c4c4c]"/>
                    </div> */}
          <div className="flex-1 flex ml-[20px] items-center h-full">
            <input
              type="text"
              placeholder="Search pexai for photos ...."
              className="w-full placeholder:text-[#9a9a9a] h-full placeholder:text-[17px] outline-none"
            />
            <button className="w-[50px] transition-all ease-in-out  cursor-pointer duration-200 hover:bg-[#dedcdc] rounded-lg hover:text-[#4e4e4e] flex mr-[10px] items-center justify-center text-[gray] h-[44px]">
              <Search />
            </button>
          </div>
        </div>
      </div>
      <div className="w-[200px] flex flex-row-reverse cursor-pointer mr-[20px] items-center h-full">
        {accessToken ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="w-[53px] h-[53px] cursor-pointer outline-none">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {userData ? (
                      `${userData.first_name.split("")[0]}${
                        userData.last_name.split("")[0]
                      }`
                    ) : (
                      <>
                        {userLatest?.status == "pending" ? (
                          <CircularLoader
                            size={21}
                            strokeWidth={2}
                            color="#4d4d4d"
                            bgColor="#d5d5d5"
                            duration={2}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-exclamation-lg w-[24px] h-[24px]"
                              viewBox="0 0 16 16"
                            >
                              <path d="M7.005 3.1a1 1 0 1 1 1.99 0l-.388 6.35a.61.61 0 0 1-1.214 0zM7 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0" />
                            </svg>
                          </div>
                        )}
                      </>
                    )}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[250px] min-h-[270px] mx-[10px] z-9999">
              {userData ? (
                <>
                  <div className="w-full flex-col">
                    <h3 className="font-semibold text-[#333333] mt-[10px] ml-[10px]">
                      Omaga David
                    </h3>
                    <p className="font-semibold text-[#818181] text-[11px] ml-[10px]">
                      omagadvd@gmail.com
                    </p>
                  </div>
                  <ul className="w-full flex flex-col items-center mt-[15px]">
                    <li className="w-[95%] h-[43px] rounded-md my-[4px] transition-all duration-200 cursor-pointer hover:bg-[#e8e7e7] font-semibold text-[#101828] flex items-center">
                      <Shuffle size={19} className="mx-[10px]" />
                      <p className="text-[13px]">My Remixes</p>
                    </li>
                    <li className="w-[95%] h-[43px] rounded-md  my-[4px] transition-all duration-200 cursor-pointer hover:bg-[#e8e7e7] font-semibold text-[#101828] flex items-center">
                      <Layers size={19} className="mx-[10px]" />
                      <p className="text-[13px]">My Collections</p>
                    </li>
                    <li className="w-[95%] h-[43px] rounded-md  my-[4px] transition-all duration-200 cursor-pointer hover:bg-[#e8e7e7] font-semibold text-[#101828] flex items-center">
                      <Heart size={19} className="mx-[10px]" />
                      <p className="text-[13px]">Liked Photos</p>
                    </li>
                  </ul>
                </>
              ) : (
                <div className="w-full h-[200px] flex flex-col justify-center items-center">
                  {userLatest?.status == "pending" ? (
                    <>
                      <CircularLoader
                        size={61}
                        strokeWidth={2}
                        color="#000"
                        bgColor="#fff"
                        duration={2}
                      />
                    </>
                  ) : (
                    <>
                      <h2 className="font-bold">An Error Occured</h2>
                      <p className="text-[11px]">{userLatest?.error.response?.data}</p>
                    </>
                  )}
                </div>
              )}
              <div className="w-[98%] mt-[6px] h-[1px] bg-[#d3d1d1]"></div>
              <ul className="w-full flex flex-col items-center mt-[4px]">
                <li className="w-[95%] h-[43px] rounded-md my-[4px] transition-all duration-200 cursor-pointer hover:bg-[#e8e7e7] font-semibold text-[#101828] flex items-center">
                  <LogOut size={19} className="mx-[10px]" />
                  <p className="text-[13px]">Log out</p>
                </li>
              </ul>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button className="w-[90px] cursor-pointer text-[14px] h-[40px]">
            Sign in
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
