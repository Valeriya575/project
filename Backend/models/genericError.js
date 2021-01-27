class GenericError extends Error {
    constructor(message, description, code) {
        super(message);
        this.description = description;
        this.status = code;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, GenericError);
        }
    }
}

module.exports = GenericError;
