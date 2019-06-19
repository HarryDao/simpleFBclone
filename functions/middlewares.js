const functions = require('firebase-functions');
const { checkAuthentication } = require('./funcs/user');
const CORS = require('cors');


const applyMiddlewares = (req, res, next) => {
    CORS()(req, res, () => {
        checkAuthentication(req, (user) => {
              
            if (!user) {
                return res.status(401).send({ error: 'Forbidden!' });
            }
            req.user = user;
            next(req, res);
        });
    })
}

const onAuthenticatedRequest = (requestHandler) => {
    return functions.https.onRequest((req, res) => {
        return applyMiddlewares(req, res, requestHandler); 
    });
}

const onExpressRequest = (app, path, handler) => {
    app.use(`/api${path}`, (req, res) => {
        return applyMiddlewares(req, res, handler);
    });
}

exports.onAuthenticatedRequest = onAuthenticatedRequest;
exports.onExpressRequest = onExpressRequest;
