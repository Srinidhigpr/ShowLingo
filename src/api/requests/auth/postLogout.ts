import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "../../getAxiosInstance";
import { Endpoints, ResponseData } from "../../../common/types";

export const postLogout = async () => {
  try {
    return await axiosInstance.post<ResponseData<{}>>(Endpoints.PostLogout);
  } catch (error) {
    return (error as AxiosError).response as AxiosResponse<ResponseData<{}>>;
  }
};
