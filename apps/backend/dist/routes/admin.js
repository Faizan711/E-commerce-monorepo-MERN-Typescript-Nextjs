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
    const adminId = req.headers["Id"];
    const admin = yield db_1.Admin.findOne({ _id: adminId });
    if (admin) {
        res.json({ Username: admin.username });
    }
    else {
        res.status(403).json({ message: "Admin not logged in!" });
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
    const admin = yield db_1.Admin.findOne({ username: parsedInput.data.username });
    if (admin) {
        res.status(403).json({ message: 'Admin already exists' });
    }
    else {
        const newAdmin = new db_1.Admin({ username, password });
        yield newAdmin.save();
        const token = jsonwebtoken_1.default.sign({ id: newAdmin._id }, middleware_1.SECRET, { expiresIn: '1h' });
        res.json({ message: 'Admin created successfully', token });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const admin = yield db_1.Admin.findOne({ username, password });
    if (admin) {
        const token = jsonwebtoken_1.default.sign({ id: admin._id }, middleware_1.SECRET, { expiresIn: '1h' });
        res.json({ message: "Logged in successfully", token });
    }
    else {
        res.status(403).json({ message: "Invalid Admin username or password" });
    }
}));
//routes for product 
router.get("/products", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield db_1.Product.find({});
    if (products) {
        res.json({ products });
    }
    else {
        res.status(403).json({ message: "No product in DB!" });
    }
}));
router.get("/product/:productId", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    const product = yield db_1.Product.findById(productId);
    if (product) {
        res.json({ product });
    }
    else {
        res.status(403).json({ message: "product not found!" });
    }
}));
router.post('/products', middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = new db_1.Product(req.body);
    yield product.save();
    res.json({ message: 'Product added successfully', productId: product.id });
}));
router.put('/products/:productId', middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield db_1.Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
    if (product) {
        res.json({ message: 'Product updated successfully' });
    }
    else {
        res.status(404).json({ message: 'Product not found' });
    }
}));
exports.default = router;
