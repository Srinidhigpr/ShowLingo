import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "../../getAxiosInstance";
import { Endpoints, ResponseData } from "../../../common/types";
import { AuthType } from "../../../common/types";

export const postLogin = async (params = {}) => {
  try {
    return await axiosInstance.post<ResponseData<AuthType>>(
      Endpoints.PostLogin,
      {
        ...params,
      }
    );
  } catch (error) {
    return (error as AxiosError).response as AxiosResponse<
      ResponseData<AuthType>
    >;
  }
};
