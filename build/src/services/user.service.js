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
exports.signTokens = exports.findUser = exports.findUserById = exports.findUserByEmail = exports.createUser = void 0;
const config_1 = __importDefault(require("config"));
const user_entity_1 = require("../entities/user.entity");
const connectRedis_1 = __importDefault(require("../utils/connectRedis"));
const data_source_1 = require("../utils/data-source");
const jwt_1 = require("../utils/jwt");
const userRepository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
const createUser = (input) => __awaiter(void 0, void 0, void 0, function* () {
    return userRepository.save(userRepository.create(input));
});
exports.createUser = createUser;
const findUserByEmail = ({ email }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userRepository.findOneBy({ email });
});
exports.findUserByEmail = findUserByEmail;
const findUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userRepository.findOneBy({ id: userId });
});
exports.findUserById = findUserById;
const findUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userRepository.findOneBy(query);
});
exports.findUser = findUser;
const signTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    connectRedis_1.default.set(user.id, JSON.stringify(user), {
        EX: config_1.default.get("redisCacheExpiresIn") * 60
    });
    const accessToken = (0, jwt_1.signJWT)({ sub: user.id }, "accessTokenPrivateKey", {
        expiresIn: `${config_1.default.get("accessTokenExpiresIn")}m`
    });
    const refreshToken = (0, jwt_1.signJWT)({ sub: user.id }, "refreshTokenPrivateKey", {
        expiresIn: `${config_1.default.get("refreshTokenExpiresIn")}m`
    });
    return { accessToken, refreshToken };
});
exports.signTokens = signTokens;
