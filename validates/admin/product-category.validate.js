module.exports.createPost = (req,res,next) => {
    if(!req.body.title){
        req.flash("error",`Vui long nhap title`)
        res.redirect("back")
        return
    }

    next()
}