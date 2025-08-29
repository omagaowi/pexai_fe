import React from "react";

import { useContext } from "react";
import { ModalContext } from "@/contexts/ModalContext";

const Modal = () => {
  const { open, modalElement, closeModal } = useContext(ModalContext)
  return (
    <div
      className={`w-[100vw] h-[100vh] fixed top-0 left-0 ${ open? 'pointer-events-all bg-[rgba(0,0,0,.4)]' : 'pointer-events-none bg-transparent]'  }  z-99999`}
      onClick={() => open && closeModal()}
    >
      <div
        className={`w-fit h-fit bg-boxdark transition-all duration-200 fixed top-[50%] left-[50%]  ${ open? 'pointer-events-all opacity-100' : 'opacity-0 pointer-events-none scale-[0.7]' } translate-x-[-50%] translate-y-[-50%]`}
        onClick={e => e.stopPropagation()}
      >
          { modalElement }
      </div>
    </div>
  );
};

export default Modal;
