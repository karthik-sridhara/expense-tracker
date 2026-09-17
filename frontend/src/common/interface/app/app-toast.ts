import { ToastType } from "../../enum/dialog";

export interface AppToast {
    message: string;
    duration: number;
    dismissible: boolean;
    type: ToastType;
    id: string;
    timer: ReturnType<typeof setTimeout> | null;
}