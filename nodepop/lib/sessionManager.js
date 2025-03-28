import MongoStore from "connect-mongo";
import session from "express-session";

const INACTIVITY_EXPIRATION_2_DAYS = (1000 * 60 * 60 * 24) * 2;

export const userSession = session({
    name: 'nodepop-session',
    secret: 'WMgwSHu%/bE3;_4#v,@<(^4ZrIM##bmSG',
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: INACTIVITY_EXPIRATION_2_DAYS },
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/nodepopdb'
    })
});

export function setSessionInViews(req, res, next) {
    res.locals.session = req.session;
    next();
}

export function guard(req, res, nexr) {
    if (!req.session.userId) {
        res.redirect(`/login?redir=${req.url}`);
    }

    next();
}