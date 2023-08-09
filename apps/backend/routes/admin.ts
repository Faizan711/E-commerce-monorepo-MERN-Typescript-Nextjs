import jwt from 'jsonwebtoken';
import express from 'express';
import { authenticateJwt, SECRET } from '../middleware';
import { Request, Response } from 'express';
import { signupInput } from 'common';

import { Admin, Product } from '../db';

const router = express.Router();

router.get("/", async (req, res) => {
  res.json({message: "hello to admin routes"});
})

router.get("/me", authenticateJwt, async (req , res) => {
    const adminId = req.headers["Id"];
    const admin = await Admin.findOne({_id: adminId});

    if(admin){
        res.json({Username: admin.username});
    }
    else{
        res.status(403).json({message: "Admin not logged in!"});
    }
});

router.post("/signup", async (req , res) => { 
    let parsedInput = signupInput.safeParse(req.body)
    if (!parsedInput.success) {
      return res.status(403).json({
        msg: "invalid limit of username or password!"
      });
    }
    const username = parsedInput.data.username;
    const password = parsedInput.data.password;
    
    const admin = await Admin.findOne({ username: parsedInput.data.username });
    if (admin) {
      res.status(403).json({ message: 'Admin already exists' });
    } else {
      const newAdmin = new Admin({ username, password });
      await newAdmin.save();
      const token = jwt.sign({ id: newAdmin._id }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Admin created successfully', token });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username, password });
    
    if(admin){
        const token = jwt.sign({id: admin._id}, SECRET, { expiresIn: '1h'});
        res.json({message: "Logged in successfully", token})
    }
    else{
        res.status(403).json({message: "Invalid Admin username or password"});
    }
});

//routes for product 

router.get("/products", authenticateJwt, async (req,res) => {

  const products = await Product.find({});
  if(products){
    res.json({ products });
  }
  else{
    res.status(403).json({message: "No product in DB!"});
  }

});

router.get("/product/:productId", authenticateJwt, async (req, res) => {

  const productId = req.params.productId;
  const product = await Product.findById(productId);
  if(product){
    res.json({ product });
  }
  else{
    res.status(403).json({message: "product not found!"});
  }

});

  router.post('/products', authenticateJwt, async (req, res) => {

    const product = new Product(req.body);
    await product.save();
    res.json({ message: 'Product added successfully', productId: product.id });

  });
  
  router.put('/products/:productId', authenticateJwt, async (req, res) => {

    const product = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
    if (product) {
      res.json({ message: 'Product updated successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }

  });



export default router;