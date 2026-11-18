import { Gender } from '../../enum/gender';

export interface Profile {
    name: string;
    gender: Gender | null;
    dob: string | null;
    income: number | null;
    currency: string;
    timezone: string;
}

export type ProfileUpdateRequest = Profile;
