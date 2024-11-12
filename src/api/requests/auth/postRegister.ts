import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "../../getAxiosInstance";
import { Endpoints, ResponseData } from "../../../common/types";
import { AuthType } from "../../../common/types";

export const postRegister = async (params = {}) => {
  try {
    return await axiosInstance.post<ResponseData<AuthType>>(
      Endpoints.PostRegister,
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
