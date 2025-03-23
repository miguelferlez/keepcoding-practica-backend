import { query, validationResult } from 'express-validator';
import Product from '../models/Product.js';

export async function index(req, res, next){
    try {
        res.render('home');
    } catch (err) {
        next(err);
    }
}