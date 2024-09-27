const md5 = require('md5');
const Account = require("../../models/account.model")
module.exports.index = (req,res) => {
    res.render("admin/pages/my-account/index", {
        pageTitle: "My account",    
    })
}

module.exports.edit = (req,res) => {
    res.render("admin/pages/my-account/edit", {
        pageTitle: "Chinh sua thong tin ca nhan",    
    })
}

module.exports.editPatch = async (req,res) => {
    const id = res.locals.user.id
    const emailExist = await Account.findOne({  
        _id: { $ne:id},
        email:req.body.email,
        deleted:false,
    })


    if(req.body.password){
        req.body.password = md5(req.body.password)
    }else{
        delete req.body.password
    }
    

    if(emailExist){
        req.flash("error",`${req.body.email} has existed`)
        
    }else{
        await Account.updateOne({_id:id },req.body)
        req.flash("success","update success ")
    }
    
    res.redirect("back")
}
