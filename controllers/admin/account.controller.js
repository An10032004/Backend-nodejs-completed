//ok
const md5 = require('md5');
const Account = require("../../models/account.model")
const Role = require("../../models/role.model")
const systemConfig = require("../../config/system")
module.exports.index= async (req, res) => {  
    let find = {
        deleted:false,
    }   

    const records = await Account.find(find).select("-password -token")
    
    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted:false,
        })

        record.role = role

    }
    

    res.render("admin/pages/account/index", {
        pageTitle: "Danh Sach Tai Khoan",
        records: records
    }) 
}
module.exports.create= async (req, res) => {  
    const roles = await Role.find({
        deleted:false
    })


    res.render("admin/pages/account/create", {
        pageTitle: "Them Tai Khoan",
        roles : roles
    }) 
}

module.exports.createPost= async (req, res) => {  
    const emailExist = await Account.findOne({  
        email:req.body.email,
        deleted:false,
    })

    if(emailExist){
        req.flash("error",`${req.body.email} has existed`)
        res.redirect("back")
    }else{
      req.body.password = md5(req.body.password)
        const record = new Account(req.body)
        await record.save() 
        res.redirect(`${systemConfig.prefixAdmin}/account`) 
    }

    
}

module.exports.edit= async (req, res) => {  
    let find = {
        _id : req.params.id,
        deleted: false
    }

    try {
        const data = await Account.findOne(find)

        const roles = await Role.find({
            deleted:false
        })
        res.render("admin/pages/account/edit", {
            pageTitle: "Cap nhat Tai Khoan",
            roles : roles,
            data:data
        }) 

    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/account`)
    }
}

module.exports.editPatch= async (req, res) => {
    const id = req.params.id
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
