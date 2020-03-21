const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    //Get token from header
    const token = req.header('x-auth-token');
    //Check if no token
    if (!token)
        return res.status(401).json({
            msg: 'No token, authorization denied'
        })

    //verify token
    try {
        const decoded = jwt.verify(token, process.env.jwtSecret);
        req.user = decoded.user;
        //to use next method after token check
        next();
    } catch (err) {
        res.status(401).json({
            msg: 'Token is not valid'
        });
    }
};