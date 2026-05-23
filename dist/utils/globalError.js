const globalErrorhandler = (err, req, res, next) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || err.stack || null,
    });
};
export default globalErrorhandler;
//# sourceMappingURL=globalError.js.map