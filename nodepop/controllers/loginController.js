import User from "../models/User.js";

export function index(req, res, next) {
    res.locals.error = '';
    res.locals.email = '';
    res.render('login');
}