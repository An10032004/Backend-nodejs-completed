module.exports.registerPost = (req,res,next) => {
    if(!req.body.fullName){
        req.flash("error",`Vui long nhap Ten`)
        res.redirect("back")
        return
    }

    next()
}

module.exports.loginPost = (req,res,next) => {
    if(!req.body.password){
        req.flash("error",`Vui long nhap Ten`)
        res.redirect("back")
        return
    }

    next()
}

module.exports.forgotPassword = (req,res,next) => {
    if(!req.body.email){
        req.flash("error",`Vui long nhap Email`)
        res.redirect("back")
        return
    }

    next()
}