import User from "../models/User.js";

export function index(req, res, next) {
    res.locals.error = '';
    res.locals.email = '';
    res.render('login');
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user || !(await user.comparePassword(password))) {
            res.locals.error = 'Unrecognized address or password';
            res.locals.email = email;
            res.render('login');
            return;
        }

        res.redirect('/');
        
    } catch (err) {
        next(err);
    }
}