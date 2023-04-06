"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeUser = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const jwt_1 = require("../utils/jwt");
const user_service_1 = require("../services/user.service");
const connectRedis_1 = __importDefault(require("../utils/connectRedis"));
const deserializeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let accessToken = "";
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")) {
            accessToken = req.headers.authorization.split(" ")[1];
        }
        else if (req.cookies.access_token) {
            accessToken = req.cookies.access_token;
        }
        if (!accessToken) {
            return next(new appError_1.default(401, "You are not logged in. Please log in to get access."));
        }
        const decodedToken = (0, jwt_1.verifyJwt)(accessToken, "accessTokenPublicKey");
        if (!decodedToken)
            return next(new appError_1.default(401, "Invalid token or session expired. Please log in again."));
        const session = yield connectRedis_1.default.get(decodedToken.sub);
        if (!session) {
            return next(new appError_1.default(401, "Invalid token or session expired. Please log in again."));
        }
        const user = yield (0, user_service_1.findUserById)(JSON.parse(session).userId);
        if (!user) {
            return next(new appError_1.default(401, "Invalid token or session expired. Please log in again."));
        }
        res.locals.user = user;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.deserializeUser = deserializeUser;
