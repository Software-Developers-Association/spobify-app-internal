const { default: base64url } = require("base64url");
const crypto = require("crypto");

/**
 * 
 * @param {{ alg: string }} header 
 * @param { object } payload 
 * @param {{ secret: string | null }} options 
 * @returns 
 */
const encode = (header, payload, options = { }) => {
	const segments = [
		base64url.encode(JSON.stringify(header)),
		base64url.encode(JSON.stringify(payload))
	];

	if(options.secret) {
		const signiture = createSigniture(header, payload, { secret: options.secret });

		segments.push(signiture);
	}

	return segments.join(".");
}

/**
 * 
 * @param { string } str 
 * @returns {{ header: object, payload: object, signiture: string | null }}
 */
const decode = (str) => {
	const [ header = null, payload = null, signiture = null ] = str.split(".");

	header = JSON.parse(base64url.decode(header));
	payload = JSON.parse(base64url.decode(payload));

	return {
		header,
		payload,
		signiture
	};
};

/**
 * 
 * @param { string } str 
 * @param {{ secret: string | null }} options 
 */
const verify = (str, options = { }) => {
	const jwt = decode(str);
	const signiture = createSigniture(jwt.header, jwt.payload, { secret: options.secret});

	return signiture == jwt.signiture
};

/**
 * 
 * @param {{ alg: string }} header 
 * @param { object } payload 
 * @param {{ secret: string | null }} options 
 */
const createSigniture = (header, payload, options = { }) => {
	const segments = [
		base64url.encode(JSON.stringify(header)),
		base64url.encode(JSON.stringify(payload))
	];

	if(options.secret) {
		switch(header.alg) {
			case SUPPORTED_ALGORITHMS.HS265.ID: {
				const hash = crypto.createHmac(SUPPORTED_ALGORITHMS.HS265.ALG, options.secret);
				hash.update(segments.join("."));

				const signiture = hash.digest("base64url");
				
				return signiture;
			}
		}
	}

	return null;
};

const SUPPORTED_ALGORITHMS = {
	HS265: {
		ID: "HS256",
		ALG: "sha256"
	}
};

module.exports = {
	encode,
	decode,
	verify,
	SUPPORTED_ALGORITHMS
};