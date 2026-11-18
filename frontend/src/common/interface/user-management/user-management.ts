export interface UserRole {
  id: string;
  name: string;
}

export interface User {
  createdAt: string;
  dob: string;
  email: string;
  gender: string;
  id: number;
  modifiedAt: string | null;
  name: string;
  role: UserRole;
  version: number;
}