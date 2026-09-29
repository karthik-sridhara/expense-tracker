export interface UserUpsertRequest {
  name: string;
  gender: string;
  dob: string;
  email: string;
  role: string;
  password?: string;
}