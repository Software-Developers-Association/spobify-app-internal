class APIError extends Error {
	/**
	 * 
	 * @param { number } statusCode 
	 * @param { string | undefined } message 
	 */
	constructor(statusCode, message) {
		super(message);
		this.name = this.constructor.name;
		Error.stackTraceLimit(this, this.constructor);

		this.statusCode = statusCode;
	}
}

class AuthError extends APIError {
	constructor(message) {
		super(401, message);

		this.name = this.constructor.name;

		Error.captureStackTrace(this, this.constructor);
	}
}

class ForbiddenError extends APIError {
	constructor(message) {
		super(403, message);

		this.name = this.constructor.name;

		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = {
	APIError,
	AuthError,
	ForbiddenError
};