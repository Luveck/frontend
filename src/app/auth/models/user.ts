import { Role } from './role';

export class User {
  email: string;
  password: string;
  name: string;
  lastName: string;
  //avatar: string;
  role?: Role;
  token?: string;
}
