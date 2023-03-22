const uuid = require("uuid");
const base64url = require("base64url").default;

const asBase64url = () => {
	return base64url.encode(
		uuid.parse(create())
	);
};

const create = () => {
	return uuid.v4();
}

module.exports = {
	asBase64url,
	create
};