"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.signJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const signJWT = (payload, keyName, options) => {
    const privateKey = Buffer.from(config_1.default.get(keyName), "base64").toString("ascii");
    return jsonwebtoken_1.default.sign(payload, privateKey, Object.assign(Object.assign({}, (options && options)), { algorithm: "RS256" }));
};
exports.signJWT = signJWT;
const verifyJwt = (token, keyName) => {
    try {
        const publicKey = Buffer.from(config_1.default.get(keyName), "base64").toString("ascii");
        const decoded = jsonwebtoken_1.default.verify(token, publicKey);
        return decoded;
    }
    catch (error) {
        return null;
    }
};
exports.verifyJwt = verifyJwt;
