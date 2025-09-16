import { ReactNode } from "react";


export interface IPhoto {
	id: string;
  pexai_id: string,
  origin: string,
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: string;
  photographer_username: string;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
  saved: boolean;
  status: string;
  liked: boolean;
}

export interface IMasonryGridProps {
	photos: IPhoto[];
	minColumnWidth: number;
  columns: number,
	cellGap: number;
	overscanCount: number;
	scrollTop: number;
	containerSize: {
		width: number;
		height: number;
	};
	isLoading: boolean;
	onNeedMore: () => void;
}

export interface IPhotoProps {
	photo: IPhoto;
	width: number;
  detail: boolean;
  orientation: string;
}

export interface UserObject {
  email: string,
  first_name: string,
  last_name: string,
  profile_pic: string,
  time_added: string,
  user_id: string,
  google_id: string
}

export interface ModalContextType {
  modalProps: any;
  modalElement: ReactNode | false;
  open: boolean;
  openModal: (element: ReactNode, props?: any) => void;
  closeModal: () => void;
  setProps: (props: any) => void;
  setElement: (element: ReactNode | false) => void;
}
