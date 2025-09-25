export interface SignIn {
  email: string;
  password: string;
}

export interface SignUp {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export interface UserView {
  id: string;
  name: string;
  authorities: string[];
}
