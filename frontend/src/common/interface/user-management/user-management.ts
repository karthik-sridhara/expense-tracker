export interface UserRole {
  id: string;
  name: string;
}

export interface User {
  createdAt: string;
  createdBy: number | null;
  dob: string;
  email: string;
  gender: string;
  id: number;
  modifiedAt: string | null;
  modifiedBy: number | null;
  name: string;
  role: UserRole;
}