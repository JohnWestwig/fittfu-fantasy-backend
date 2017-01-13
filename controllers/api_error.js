exports.send = function (res, errorInfo, errorCode) {
    var responseCode = ((errorCode / 1000) == 4) ? 400 : 500;
    res.status(responseCode).json({
        errorCode: errorCode,
        message: errorInfo.message,
        description: errorInfo.errors[errorCode]
    });
};