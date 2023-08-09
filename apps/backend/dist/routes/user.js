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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const common_1 = require("common");
const db_1 = require("../db");
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: "hello to admin routes" });
}));
router.get("/me", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers["Id"];
    const user = yield db_1.User.findOne({ _id: userId });
    if (user) {
        res.json({ Username: user.username });
    }
    else {
        res.status(403).json({ message: "User not logged in!" });
    }
}));
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let parsedInput = common_1.signupInput.safeParse(req.body);
    if (!parsedInput.success) {
        return res.status(403).json({
            msg: "invalid limit of username or password!"
        });
    }
    const username = parsedInput.data.username;
    const password = parsedInput.data.password;
    const user = yield db_1.User.findOne({ username: parsedInput.data.username });
    if (user) {
        res.status(403).json({ message: 'User already exists' });
    }
    else {
        const newUser = new db_1.User({ username, password });
        yield newUser.save();
        const token = jsonwebtoken_1.default.sign({ id: newUser._id }, middleware_1.SECRET, { expiresIn: '1h' });
        res.json({ message: 'User created successfully', token });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield db_1.User.findOne({ username, password });
    if (user) {
        const token = jsonwebtoken_1.default.sign({ id: user._id }, middleware_1.SECRET, { expiresIn: '1h' });
        res.json({ message: "Logged in successfully", token });
    }
    else {
        res.status(403).json({ message: "Invalid User username or password" });
    }
}));
//routes for products
router.get("/products", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield db_1.Product.find({ inStock: true });
    if (products) {
        res.json({ products });
    }
    else {
        res.status(403).json({ message: "no products in stock currently!" });
    }
}));
router.post("/products/:productId", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    const product = yield db_1.Product.findById(productId);
    // console.log(product);
    if (product) {
        const userId = req.headers["Id"];
        const user = yield db_1.User.findOne({ _id: userId });
        if (user) {
            user.purchasedProducts.push(product.toJSON());
            yield user.save();
            res.json({ message: 'Product purchased successfully' });
        }
        else {
            res.status(403).json({ message: 'User not found' });
        }
    }
    else {
        res.status(404).json({ message: 'Product not found' });
    }
}));
router.get('/purchasedProducts', middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.User.findOne({ username: req.body.username }).populate('purchasedProducts');
    if (user) {
        res.json({ purchasedCourses: user.purchasedProducts || [] });
    }
    else {
        res.status(403).json({ message: 'User not found' });
    }
}));
exports.default = router;
