import { Gender } from "../../enum/gender";

export interface RegisterRequest {
    name: string;
    gender: Gender;
    dob: string;
    email: string;
    password: string;
}
