import { query, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import User from '../models/User.js';

export async function index(req, res, next){
    try {
        res.locals.products = await Product.find();

        for (let product of res.locals.products) {
            const ownerId = product.owner.toString();
            const user = await User.findOne({_id: ownerId});
            product.username = user.name
        }

        res.render('home');
    } catch (err) {
        next(err);
    }
}