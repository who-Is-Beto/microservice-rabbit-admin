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
exports.logoutUserHandler = exports.refreshAccessTokenHandler = exports.loginUserHandler = exports.registerHandler = void 0;
const config_1 = __importDefault(require("config"));
const user_service_1 = require("../services/user.service");
const user_entity_1 = require("../entities/user.entity");
const appError_1 = __importDefault(require("../utils/appError"));
const jwt_1 = require("../utils/jwt");
const connectRedis_1 = __importDefault(require("../utils/connectRedis"));
const cookiesOptions = {
    httpOnly: true,
    sameSite: "lax"
};
if (process.env.NODE_ENV === "production") {
    cookiesOptions.secure = true;
}
const accessTokenCookieOptions = Object.assign(Object.assign({}, cookiesOptions), { expires: new Date(Date.now() + config_1.default.get("accessTokenExpiresIn") * 60 * 1000), maxAge: config_1.default.get("accessTokenExpiresIn") * 60 * 1000 });
const refreshTokenCookieOptions = Object.assign(Object.assign({}, cookiesOptions), { expires: new Date(Date.now() + config_1.default.get("refreshTokenExpiresIn") * 60 * 1000), maxAge: config_1.default.get("refreshTokenExpiresIn") * 60 * 1000 });
const logout = (res) => {
    res.cookie("access_token", "", {
        maxAge: -1
    });
    res.cookie("refresh_token", "", { maxAge: -1 });
    res.cookie("logged_in", "", { maxAge: -1 });
};
const registerHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        const user = yield (0, user_service_1.createUser)({
            email: email.toLowerCase(),
            password,
            name
        });
        res.status(201).json({
            status: "success",
            data: {
                user
            }
        });
    }
    catch (err) {
        if (err.code === "23505") {
            return res.status(409).json({
                status: "fail",
                message: "User with that email already exist"
            });
        }
        next(err);
    }
});
exports.registerHandler = registerHandler;
const loginUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield (0, user_service_1.findUserByEmail)({ email });
        if (!user || !(yield user_entity_1.User.comparePasswords(password, user.password))) {
            return next(new appError_1.default(400, "Invalid email or password"));
        }
        const { accessToken, refreshToken } = yield (0, user_service_1.signTokens)(user);
        res.cookie("access_token", accessToken, accessTokenCookieOptions);
        res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);
        res.cookie("logged_in", true, Object.assign(Object.assign({}, accessTokenCookieOptions), { httpOnly: false }));
        res.status(200).json({
            status: "success",
            accessToken
        });
    }
    catch (err) {
        next(err);
    }
});
exports.loginUserHandler = loginUserHandler;
const refreshAccessTokenHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.cookies;
        const message = "Could not refresh access token. Please login again.";
        if (!refreshToken) {
            return next(new appError_1.default(403, message));
        }
        const decodedToken = (0, jwt_1.verifyJwt)(refreshToken, "refreshTokenPublicKey");
        if (!decodedToken) {
            return next(new appError_1.default(403, message));
        }
        const session = yield connectRedis_1.default.get(decodedToken.sub);
        if (!session) {
            return next(new appError_1.default(403, message));
        }
        const user = yield (0, user_service_1.findUserById)(JSON.parse(session).id);
        if (!user) {
            return next(new appError_1.default(403, message));
        }
        const { accessToken } = yield (0, user_service_1.signTokens)(user);
        res.cookie("access_token", accessToken, accessTokenCookieOptions);
        res.cookie("logged_in", true, Object.assign(Object.assign({}, accessTokenCookieOptions), { httpOnly: false }));
        res.status(200).json({
            status: "success",
            accessToken
        });
    }
    catch (err) {
        next(err);
    }
});
exports.refreshAccessTokenHandler = refreshAccessTokenHandler;
const logoutUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = res.locals.user;
        yield connectRedis_1.default.del(user.id);
        logout(res);
        res.status(200).json({
            status: "success"
        });
    }
    catch (err) {
        next(err);
    }
});
exports.logoutUserHandler = logoutUserHandler;
