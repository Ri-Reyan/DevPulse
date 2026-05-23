import {} from "express";
const responseHandler = (res, payload) => {
    const responseObj = {
        success: payload.success,
    };
    if (payload.message)
        responseObj.message = payload.message;
    if (payload.data !== undefined)
        responseObj.data = payload.data;
    res.status(payload.statusCode).json(responseObj);
};
export default responseHandler;
//# sourceMappingURL=response.js.map