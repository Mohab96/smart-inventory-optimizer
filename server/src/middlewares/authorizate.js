// Middleware to check the authorized level of the user
// notice that this middleware gets executed after the authenticate function meaning we already validated and extracted the data from the JWT
module.exports = (req, res, next) => {
    if(!req.user.isAdmin)return res.status(403).json({message: 'Access denied'});
    next();
  };