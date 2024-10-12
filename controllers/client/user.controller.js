const User = require("../../models/user.model")
const Cart = require("../../models/cart.model")
const ForgotPassword = require("../../models/forgot-password.model")
const md5 = require("md5")
const generateHelper = require("../../helpers/generate")
const sendMailHelper = require("../../helpers/sendMail")
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
    const cart = await Cart.findOne({
        user_id : user.id
    })

    if(cart){
        res.cookie("cartId",cart.id)
    }else{

    await Cart.updateOne({
        _id: req.cookies.cartId
        },{
            user_id:user.id
        })
    }
    res.cookie("tokenUser",user.tokenUser)
    res.redirect("/")
}

module.exports.logout = async (req,res) => {
    res.clearCookie("tokenUser")
    res.clearCookie("cartId")
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
    // generateHelper.generateRandomNumber(5)
    const objectForgotPassword = {
        email:email,
        otp : otp,
        expireAt: Date.now() + 1000
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save()

    const subject = "mã Otp xác minh Mật khẩu"
    const html = ` mã otp của bạn là <b>${otp}</b> . Thời hạn sử dụng 2p`
    sendMailHelper.sendMail(email,subject,html)
    res.redirect(`/user/password/otp?email=${email}`)
}

module.exports.otpPassword = async (req,res) => {

    const email = req.query.email
    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhap Otp",
        email:email
    });
}

module.exports.otpPasswordPost = async (req,res) => {
    const email = req.body.email
    const otp = req.body.otp
    
    const result = await ForgotPassword.findOne({
        email:email,

        otp:otp
    })

    if(!result){
        req.flash("error","OTP khong hop le")
        res.redirect("back")
        return
    }

    const user = await User.findOne({
        email : email
    })

    res.cookie("tokenUser",user.tokenUser)

    res.redirect("/user/password/reset")
}

module.exports.resetPassword = async (req,res) => {

    res.render("client/pages/user/reset-password", {
        pageTitle: "Doi Mat khau"
    });
}

module.exports.resetPasswordPost = async (req,res) => {
    const password = req.body.password
    const tokenUser = req.cookies.tokenUser
    
    await User.updateOne({
        tokenUser:tokenUser
    },{ password: md5(password )}
    )

    res.redirect("/")
}

module.exports.info = async (req,res) => {
    const tokenUser = req.cookies.tokenUser

    const user = await User.findOne({
        tokenUser:tokenUser
    }).select("-password")
    res.render("client/pages/user/info", {
        pageTitle: "Thong tin Tai khoan",
        infoUser : user
    });
}