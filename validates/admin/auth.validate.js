module.exports.loginPost= async (req, res,next) => {  
    if(!req.body.email){
        req.flash("error","Nhap email ?")
        res.redirect("back")
        return
    }
    if(!req.body.password){
        req.flash("error","Nhap password ?")
        res.redirect("back")
        return
    }
    next()
}
