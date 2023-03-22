const express = require("express");
const JWT = require("../common/jwt");
const { AuthError } = require("../common/errors");
const { default: base64url } = require("base64url");
const dayjs = require("dayjs");
const uuid = require("../common/uuid");

/**
 * 
 * @param { express.Request } req 
 * @param { express.Response } res 
 * @param { express.NextFunction } next 
 */
const authenticate = (req, res, next) => {
	const { authorization = null } = req.headers;

	if(authorization == null) {
		return next(new AuthError(`Authentication header is required`));
	}
	
	// <auth_scheme> <credentials>
	const [ scheme = null, credentials = null ] = authorization.split(" ");

	if(scheme == null || credentials == null) {
		return next(new AuthError(`Authentication credential is required`))
	}

	switch(scheme) {
		case AUTH_SCHEME.BEARER: {
			let jwt = null;

			try {
				const unverifiedJWT = JWT.decode(credentials);
				
				if(unverifiedJWT.signiture == null) {
					return next(new AuthError(`Unsigned JWTs are not supported`));
				}

				if(JWT.verify(credentials, { secret: "password" }) == false) {
					return next(new AuthError(`JWT signiture could not be verified`));
				}

				jwt = unverifiedJWT;

				const now = dayjs();
				const expiry = dayjs(jwt.header.exp || Number.MIN_SAFE_INTEGER);

				if(expiry.unix() - now.unix() <= 0) {
					return next(new AuthError(`JWT has expired`));
				}
			} catch(e) {
				console.error(e);

				return next(new AuthError(`Invalid JWT recieved`));
			}

			res.locals.jwt = jwt;
		} break;
		case AUTH_SCHEME.BASIC: {
			// <identity>:<password>
			const [ identity = null, pwd = null ] = base64url.decode(credentials).split(":");

			if(identity == null || pwd == null) {
				return next(new AuthError(`Missing credentials`));
			}

			res.locals.jwt = {
				header: {
					alg: JWT.SUPPORTED_ALGORITHMS.HS265.ID,
					typ: "JWT",
					jti: uuid.asBase64url(),
					exp: dayjs().add(1, "day").valueOf()
				},
				payload: {
					
				}
			}
		} break;
		default: {
			return next(new AuthError(`Unsupported authentication scheme`));
		}
	}

	next();
};

/**
 * 
 * @param { express.Request } req 
 * @param { express.Response } res 
 * @param { express.NextFunction } next 
 */
const authorization = (req, res, next) => { };

const AUTH_SCHEME = {
	BASIC: "Basic",
	BEARER: "Bearer",
	DIGEST: "Digest"
};

module.exports = {
	authenticate,
	authorization
};