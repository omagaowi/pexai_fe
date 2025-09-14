import CentralGrid from "@/components/CentralGrid";
import ImageItem from "@/components/ImageItem";
import Navbar from "@/components/Navbar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { root_uri } from "@/utils/stores/aurhStore";
import { SelectLabel } from "@radix-ui/react-select";
import { useMutationState } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const SearchPage = () => {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const [providers, setProviders] = useState('all')

  const navigate = useNavigate()

  //   useEffect(() => {
  //     const appContainer = parentRef.current;
  //     if (appContainer) {
  //       console.log("ao");
  //       appContainer.addEventListener("scroll", () =>{
  //         console.log('ddefd')
  //       });
  //     }
  //   }, []);

  const location = useLocation();
  const useQueryParams = () => {
    const { search } = useLocation();
    return new URLSearchParams(search);
  };
  const query = useQueryParams();

    const page = "search";
  const mutationKey = ["search", query.get('q')];
  const api_url = `${root_uri}/images/all?query=${ query.get('q') }&provider=${ query.get('p') || 'all' }`;


  return (
    <div className="w-[100vw] h-[100vh]">
      <Navbar />
      <div
        className="w-[100vw] h-[100vh] overflow-y-scroll pt-[100px]"
        ref={parentRef}
      >
        <div className="w-full h-[60px] pr-[20px] flex items-center justify-between mb-[15px]">
          <h1 className="text-[27px] ml-[25px]  text-[#292929]">
            Search results for '{ query.get('q') }'
          </h1>
          <Select value={ query.get('p') || 'all' } onValueChange={ (value) => {
              navigate(`/search?q=${ query.get('q') }&p=${ value }`)
          } }>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent >
              <SelectGroup >
                <SelectLabel>
                  <p className="text-[12px]">Providers</p>
                </SelectLabel>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pxls">Pexels</SelectItem>
                <SelectItem value="upsh">Unsplash</SelectItem>
                <SelectItem value="frepk">Freepik</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* <ImageItem /> */}
        <CentralGrid
            api_url={api_url}
            mutationKey={mutationKey}
            appPage={page}
            parent={parentRef}
          />
      </div>
    </div>
  );
};

export default SearchPage;
