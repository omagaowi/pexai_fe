import React, { useEffect, useState } from "react";
import CircularLoader from "@/components/LoaderCircular";
import { AiSparkles } from "@/components/ui/ai-sparkles";
import { ArrowDown, Check, CircleAlert, Download } from "lucide-react";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { downloadImage } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

export async function fetchImageAsBase64(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer", // ensures we get binary data
    });

    // Convert to base64
    const base64 = Buffer.from(response.data, "binary").toString("base64");

    // Try to extract content-type (fallback to image/png)
    const contentType = response.headers["content-type"] || "image/png";

    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error("Error fetching image:", error);
    throw error;
  }
}

export async function fetchAndConvertToBase64(url, callback) {
  try {
    const response = await axios.get(url, { responseType: "blob" });
    const file = response.data;

    const reader = new FileReader();
    reader.onloadend = () => {
      callback({
        data: reader.result,
      });
    };
    reader.readAsDataURL(file);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

const AssitantImage = ({ message }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [url, setUrl] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(false);
    fetchAndConvertToBase64(message.saving_image.url, ({ data }) => {
      setUrl(data);
      setIsLoaded(true);
      // console.log(data)
    }).catch((error) => {
      console.log(error);
    });
  }, [message]);

  return (
    <div
      className="w-[270px] relative min-h-[150px] h-fit bg-[#111111] mt-[5px] rounded-md"
      onClick={() => {
        // if(message.saving_image.status == 'completed'){
        //     navigate(`/photo/`)
        // }
      }}
    >
      <img
        src={
          message.saving_image.url
            ? url
            : message.generating_image.url
            ? message.generating_image.url
            : ``
        }
        className="w-full rounded-md"
        alt=""
      />
      {message.saving_image.url ? (
        <div className="absolute w-[45px] h-[45px] cursor-pointer bg-[rgb(0,0,0,.5)] flex items-center justify-center rounded-full bottom-[10px] right-[10px]" onClick={ () => {
          downloadImage(message.saving_image.url, `pexai_remix_${ uuidv4() }.png`)
        } }>
          <ArrowDown size={22} className="text-[#fff]" />
        </div>
      ) : (
        <></>
      )}
      {message.saving_image.status == "completed" && isLoaded ? (
        <></>
      ) : (
        <div
          className="absolute top-0 left-0 bottom-0 right-0 rounded-md"
          style={{
            background: "rgba(255, 255, 255, .5)",
            backdropFilter: `blur(13px)`,
          }}
        >
          {message.saving_image.status == "error" ||
          message.generating_image.status == "error" ? (
            <></>
          ) : (
            <AiSparkles className="rounded-md" />
          )}
        </div>
      )}
    </div>
  );
};

const AssistantMessage = ({ message }) => {
  const ErrorMsg = ({ error }) => {
    return (
      <div className="w-[220px] h-[100px] flex flex-col items-center justify-center rounded-md bg-[#ffecec] mt-[5px]">
        <CircleAlert className="text-[#c60404]" />
        <h3 className="text-[#790000]">An Error Occured</h3>
        <p className="text-[9px]">{error?.message || ""}</p>
      </div>
    );
  };

  return (
    <div className="w-full h-fit flex my-[10px] flex-col items-start">
      {message.refresh ? (
        <div className="min-w-[220px] max-w-[270px]  flex items-center bg-[#f6f6f6] h-[50px] rounded-md">
          <div className="h-fit flex-1">
            <p className="ml-[10px] text-[14px] text-[#4f4f4f]">
              generating_image
            </p>
          </div>
          <div className="w-[50px] flex items-center justify-center h-full">
            {message.starting_generation.status == "in progress" ? (
              <CircularLoader
                size={21}
                strokeWidth={1}
                color="#4f4f4f"
                bgColor="transparent"
                duration={2}
              />
            ) : (
              <>
                {message.starting_generation.status == "completed" ? (
                  <Check className="text-[#004700]" />
                ) : (
                  <CircleAlert className="text-[red]" />
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          {message.starting_generation.status == "in progress" ||
          message.starting_generation.status == "error" ||
          message.starting_generation.status == "completed" ? (
            <div className="min-w-[220px] max-w-[270px]  flex items-center bg-[#f6f6f6] h-[50px] rounded-md">
              <div className="h-fit flex-1">
                <p className="ml-[10px] text-[14px] text-[#4f4f4f]">
                  starting generation
                </p>
              </div>
              <div className="w-[50px] flex items-center justify-center h-full">
                {message.starting_generation.status == "in progress" ? (
                  <CircularLoader
                    size={21}
                    strokeWidth={1}
                    color="#4f4f4f"
                    bgColor="transparent"
                    duration={2}
                  />
                ) : (
                  <>
                    {message.starting_generation.status == "completed" ? (
                      <Check className="text-[#004700]" />
                    ) : (
                      <CircleAlert className="text-[red]" />
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <></>
          )}

          {message.starting_generation.status == "error" ? (
            <ErrorMsg error={message.starting_generation.data} />
          ) : (
            <></>
          )}

          {message.generating_image.status == "in progress" ||
          message.generating_image.status == "error" ||
          message.generating_image.status == "completed" ? (
            <AssitantImage message={message} />
          ) : (
            <></>
          )}

          {message.generating_image.status == "error" ? (
            <ErrorMsg error={message.generating_image.data} />
          ) : (
            <></>
          )}

          {message.saving_image.status == "in progress" ||
          message.saving_image.status == "error" ||
          message.saving_image.status == "completed" ? (
            <div className="min-w-[220px] max-w-[270px] mt-[5px]  flex items-center bg-[#f6f6f6] h-[50px] rounded-md">
              <div className="h-fit flex-1">
                <p className="ml-[10px] text-[14px] text-[#4f4f4f]">
                  saving image
                </p>
              </div>
              <div className="w-[50px] flex items-center justify-center h-full">
                {message.saving_image.status == "in progress" ? (
                  <CircularLoader
                    size={21}
                    strokeWidth={1}
                    color="#4f4f4f"
                    bgColor="transparent"
                    duration={2}
                  />
                ) : (
                  <>
                    {message.saving_image.status == "completed" ? (
                      <Check className="text-[#004700]" />
                    ) : (
                      <CircleAlert className="text-[red]" />
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <></>
          )}

          {message.saving_image.status == "error" ? (
            <ErrorMsg error={message.saving_image.data} />
          ) : (
            <></>
          )}

          {message.message.status == "in progress" ||
          message.message.status == "error" ||
          message.message.status == "completed" ? (
            <div className="w-[90%] mt-[7px] max-w-[400px]">
              <p className=" text-[13px] text-[#4e4e4e]">
                {message.message.data || "Image generated"}
              </p>
            </div>
          ) : (
            <></>
          )}

          {message.message.status == "error" ? (
            <ErrorMsg error={message.message.data} />
          ) : (
            <></>
          )}
          {/* {message.message.status == "completed" ? (
            <div className="w-[200px] flex items-center mt-[15px]">
              <h4 className="text-[13px] mr-[5px]">Public Image</h4>
              <Switch className="cursor-pointer" />
            </div>
          ) : (
            <></>
          )} */}
        </>
      )}
    </div>
  );
};

export default AssistantMessage;
