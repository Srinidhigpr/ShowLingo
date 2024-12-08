export type UserType = {
  _id: string;
  name: string;
};

export type ResponseData<T> = {
  data: T & { message?: string };
  error: boolean;
  totalAmount?: { count?: number };
};

export enum QueryKeys {
  GetUser = "get_user",
}

export type AuthType = {
  user: {
    name: string;
    _id: string;
  };
  token?: string;
};

export enum Env {
  Production = "production",
  Development = "development",
  Test = "test",
}

export enum Endpoints {
  PostRegister = "/register",
  PostLogin = "/login",
  GetUser = "/user",
  PostLogout = "/logout",
}
