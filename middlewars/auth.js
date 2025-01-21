
var auth = function(req,res,next){
    if (req.session && req.session.loggedin) {
        return next();
    } else{
        return res.redirect('/auth/login')
    }
};

module.exports = auth