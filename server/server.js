const uuid = require("uuid");
const base64url = require("base64url").default;

const id = "76a64eb2-fb48-43a7-969c-c08290930f66";
const buffer = uuid.parse(id);
const bid = base64url.encode(buffer);

console.log(id, bid, buffer);