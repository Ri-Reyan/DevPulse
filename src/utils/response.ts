import { type Response } from "express";
import type { resDataType } from "../types/allTypes";

const responseHandler = (res: Response, payload: resDataType) => {
  const responseObj: any = {
    success: payload.success,
  };

  if (payload.message) responseObj.message = payload.message;
  if (payload.data !== undefined) responseObj.data = payload.data;

  res.status(payload.statusCode).json(responseObj);
};

export default responseHandler;
