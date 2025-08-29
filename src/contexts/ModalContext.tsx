import { ModalContextType } from "@/utils/types";
import React, { createContext, useState, ReactNode, FC } from "react";


const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
  const [modalProps, setModalProps] = useState<any>(false);
  const [modalElement, setModalElement] = useState<ReactNode | false>(false);
  const [open, setOpen] = useState<boolean>(false);

  const openModal = (element: ReactNode, props?: any) => {
    setModalProps(props);
    setModalElement(element);
    setTimeout(() => {
      setOpen(true);
    }, 200);
  };

  const closeModal = () => {
    setOpen(false);
    setTimeout(() => {
      setModalProps(false);
      setModalElement(false);
    }, 100);
  };

  const setProps = (props: any) => {
    setModalProps(props);
  };

  const setElement = (element: ReactNode | false) => {
    setModalElement(element);
  };

return (
    <ModalContext.Provider
      value={{
        modalProps,
        modalElement,
        open,
        openModal,
        closeModal,
        setProps,
        setElement,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export { ModalProvider, ModalContext };