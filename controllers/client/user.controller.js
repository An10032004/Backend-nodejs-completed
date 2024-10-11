const User = require("../../models/user.model")
const ForgotPassword = require("../../models/forgot-password.model")
const md5 = require("md5")
const generateHelper = require("../../helpers/generate")
module.exports.register = async (req,res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Dang Ky Tai Khoan",
    });
}

module.exports.registerPost = async (req,res) => {
    const existEmail = await User.findOne({
        email: req.body.email
    })

    if(existEmail){
        req.flash("error","email existed")
        res.redirect("back")
        return
    }

    req.body.password = md5(req.body.password)

    const user = new User(req.body)
    await user.save()

    res.cookie("tokenUser",user.tokenUser)

    res.redirect("/")
}

module.exports.login = async (req,res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Dang Nhap",
    });
}

module.exports.loginPost = async (req,res) => {
    const email = req.body.email
    const password = req.body.password
    
    const user = await User.findOne({
        email:email,
        deleted:false
    })

    if(!user){
        req.flash("error","Tai Khoan Khong ton tai")
        res.redirect("back")
        return
    }

    if( md5(password) !== user.password){
        req.flash("error","sai Mat Khau")
        res.redirect("back")
        return
    }

    if( user.status === "inactive"){
        req.flash("error","Tai Khoan dang Bi khoa")
        res.redirect("back")
        return
    }


    res.cookie("tokenUser",user.tokenUser)
    res.redirect("/")
}

module.exports.logout = async (req,res) => {
    res.clearCookie("tokenUser")
    res.redirect("/")
}

module.exports.forgotPassword = async (req,res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Get Password",
    });
}

module.exports.forgotPasswordPost = async (req,res) => {
    const email = req.body.email

    const user = await User.findOne({
        email : email,
        deleted:false
    })

    if(!user){
        req.flash("error","Email khong ton tai")
        res.redirect("back")
        return
    }
    const otp = generateHelper.generateRandomNumber(5)
    const objectForgotPassword = {
        email:email,
        otp : otp,
        expireAt: Date.now() + 300
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save()
    res.send("OK")
}