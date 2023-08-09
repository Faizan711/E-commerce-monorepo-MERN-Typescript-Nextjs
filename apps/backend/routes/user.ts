import jwt from 'jsonwebtoken';
import express from 'express';
import { authenticateJwt, SECRET } from '../middleware';
import { Request, Response } from 'express';
import { signupInput } from 'common';

import { User, Product } from '../db';

const router = express.Router();

router.get("/", async (req, res) => {
  res.json({message: "hello to admin routes"});
})

router.get("/me", authenticateJwt, async(req,res)=> {
    const userId = req.headers["Id"];
    const user = await User.findOne({_id: userId});

    if(user){
        res.json({Username: user.username});
    }
    else{
        res.status(403).json({message: "User not logged in!"});
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
    
    const user = await User.findOne({ username: parsedInput.data.username });
    if (user) {
      res.status(403).json({ message: 'User already exists' });
    } else {
      const newUser = new User({ username, password });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'User created successfully', token });
    }
});


router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    
    if(user){
        const token = jwt.sign({id: user._id}, SECRET, { expiresIn: '1h'});
        res.json({message: "Logged in successfully", token})
    }
    else{
        res.status(403).json({message: "Invalid User username or password"});
    }
});

//routes for products


router.get("/products", authenticateJwt, async (req,res) => {
  const products = await Product.find({inStock: true});
  if(products){
    res.json({ products });
  }
  else{
    res.status(403).json({message: "no products in stock currently!"});
  }
});


router.post("/products/:productId", authenticateJwt , async (req,res) => {


  const productId = req.params.productId;
  const product = await Product.findById(productId);
  // console.log(product);

  if (product) {
    const userId = req.headers["Id"];
    const user = await User.findOne({_id: userId});
    if (user) {
      user.purchasedProducts.push(product.toJSON());
      await user.save();
      res.json({ message: 'Product purchased successfully' });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
  } else {
    res.status(404).json({ message: 'Product not found' });
  }

});


router.get('/purchasedProducts', authenticateJwt, async (req, res) => {
  const user = await User.findOne({ username: req.body.username }).populate('purchasedProducts');
  if (user) {
    res.json({ purchasedCourses: user.purchasedProducts || [] });
  } else {
    res.status(403).json({ message: 'User not found' });
  }
});



export default router;