import React from "react"

const ImageItem = ({ data }) => {
    console.log(data)
    return (
        <div className="w-[385px] bg-[#cbcbcb] rounded-lg mb-[20px] h-fit min-h-[250px]">
            <img src={ data } className="w-full rounded-lg" alt="" />
        </div>
    )
}

export default ImageItem