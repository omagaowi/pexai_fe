import { Send, Shuffle, Sparkles, WandSparkles } from "lucide-react"
import React from "react"
import MessageBox from "./MessageBox"
import Convo from "./Convo"

const Chat = () => {
    return (
        <div className="max-w-[700px] relative w-[96vw] h-full">
            <div className="w-full flex flex-col justify-center items-center" style={ { height: 'calc(100% - 100px)' } }>
                  <Sparkles size={46} className="text-[#4d4d4d]" />
                  <h1 className="text-[30px] text-[#2e2e2e] mt-[10px]">Edit & Remix Photos</h1>
                  <p className="w-[430px] text-[13px] text-[gray] text-center">Remix is powered by AI, so mistakes are possible and remixes can take longer time depending on the image.</p>
                  {/* <Convo /> */}
            </div>
            <MessageBox />
        </div>  
    )
}

export default Chat