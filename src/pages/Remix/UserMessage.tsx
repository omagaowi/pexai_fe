import React from "react";

const UserMessage = ({ message }) => {
  return (
    <div className="w-full h-fit flex items-center justify-end">
      <div className="min-w-[220px] max-w-[270px] px-[16px] flex flex-col bg-[#f6f6f6]  h-fit rounded-md">
        <div className="w-fit min-h-[50px] h-fit flex items-center">
          <p className="text-[14px] text-[#3a3a3a]">{message.text}</p>
        </div>
        <div className="w-full h-fit flex flex-wrap">
          {message.images.map((image) => (
            <div className="w-[50px] h-[50px] mb-[10px] bg-[#fff] flex mr-[10px] items-center justify-center rounded-md">
              <img
                src={ image.thumbnail }
                className="w-[85%] rounded-md h-[85%] object-cover"
                alt=""
              />        
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
