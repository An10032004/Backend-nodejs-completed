const Role = require("../../models/role.model")
const systemConfig = require("../../config/system")
module.exports.index= async (req, res) => {  
    let find = {
        deleted:false,
    }   

    const records = await Role.find(find)

    res.render("admin/pages/roles/index", {
        pageTitle: "Nhom Quyen",
        records: records
    }) 
}

module.exports.create= async (req, res) => {  


    res.render("admin/pages/roles/create", {
        pageTitle: "Tao Nhom Quyen",
    }) 
}

module.exports.createPost= async (req, res) => { 
    console.log(req.body) 

    const  record = new Role(req.body)

    record.save()

    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}
module.exports.edit= async (req, res) => {  
    try {
        const id = req.params.id
    
        let find = {
            _id : id,
            deleted: false
        }
    
        const data = await Role.findOne(find)
    
        res.render("admin/pages/roles/edit", {
            pageTitle: "Sua Nhom Quyen",
            data:data
        }) 
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }
}

module.exports.editPatch= async (req, res) => { 
    try {
        const id = req.params.id
    
        await Role.updateOne({ _id : id},req.body)
    
        req.flash("success","Success")
    } catch (error) {
        req.flash("error","fail")

    }
    res.redirect("back")

}

module.exports.permissions= async (req, res) => { 
    let find = {
        deleted:false,
    }

    const records = await Role.find(find)

    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phan Quyen",
        records:records
    })

}

module.exports.permissionsPatch= async (req, res) => { 
    const permissions = JSON.parse(req.body.permissions)

    for (const item of permissions) {
        await Role.updateOne({_id: item.id},{permissions:item.permissions})
    }
    req.flash("success","cap nhat thanh cong")

    res.redirect("back")
}

