import { ModalContext } from "@/contexts/ModalContext"
import { CircleAlert, X } from "lucide-react"
import React, { useContext } from "react"
import { useNavigate } from "react-router-dom"

const SubscriptionError = ( { data } ) => {

    const { closeModal } = useContext(ModalContext)

    const navigate = useNavigate()

//    console.log(data)

    return (
        <div className="w-[370px] flex flex-col items-center relative rounded-md justify-center h-[300px] bg-[#fff]">
            <div className="absolute top-[10px] cursor-pointer right-[10px]" onClick={ () => {
                closeModal()
            } }>
                <X className="text-[red]"/>
            </div>
            <CircleAlert size={ 50 }/>
            <h1 className="text-[20px] font-semibold">Unable to use Remix</h1>
            <p className="w-[95%] text-[12px] text-center">{ data.message }</p>
            <div className="w-full h-fit flex flex-col items-center mt-[15px]" >
                <button className="w-[90%] cursor-pointer h-[45px] bg-[#212122] my-[5px] text-[15px] text-[#fff] rounded-md" onClick={ () => {
                closeModal()
                navigate('/auth/options?s=byok')
            } }>Bring your API key</button>
                 <button className="w-[90%] cursor-pointer h-[45px] bg-[#212122] my-[5px] text-[15px] text-[#fff] rounded-md" onClick={ () => {
                closeModal()
                navigate('/auth/options?s=invite')
            } }>Use an invite code</button>
            </div>
        </div>
    )
}

export default SubscriptionError