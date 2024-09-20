const ProductCategory = require("../../models/product-category.model")
const createTreeHelper = require("../../helpers/createTree")
const systemConfig = require("../../config/system")
//[GET] /admin/product-category
module.exports.index= async (req, res) => { 
      
    res.render("admin/pages/product-category/index", {
        pageTitle: "Danh Sach San pham",
       
    }) 
}

module.exports.create= async (req, res) => { 
    let find = {
        deleted :false,

    }


    const records = await ProductCategory.find(find)

    const newRecords = createTreeHelper.tree(records);

    

    res.render("admin/pages/product-category/create", {
        pageTitle: "Tao Moi Danh Muc San pham",
       records: newRecords
    }) 
}

module.exports.createPost= async (req, res) => { 

    if(req.body.position == ""){
        const count = await ProductCategory.countDocuments()
        req.body.position =count + 1
    }else{
        req.body.position = parseInt(req.body.position)
    }


    const record = new ProductCategory(req.body)
    await record.save()

    res.redirect(`${systemConfig.prefixAdmin}/product-category`)


}

module.exports.index= async (req, res) => { 
    
    
    let find = {
        deleted: false,
      
    }



    const records = await ProductCategory.find(find)

    const newRecords = createTreeHelper.tree(records);

    
    res.render("admin/pages/product-category/index", {
        pageTitle: "Danh Muc San pham",
        records : newRecords
    }) 
}

module.exports.edit= async (req, res) => { 
    try {
        const id = req.params.id;
    let find = {
        deleted :false,

    }
    const data = await ProductCategory.findOne({
        deleted: false,
        _id : id,
    })

    const records = await ProductCategory.find(find)

    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/product-category/edit", {
        pageTitle: "Chinh sua Danh Muc San pham",
        data:data,
        records: newRecords
    }) 
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/product-category`)
    }
}

module.exports.editPatch= async (req, res) => { 
    const id = req.params.id;
    
    req.body.position = parseInt(req.body.position)

    await ProductCategory.updateOne({_id : id},req.body)
    res.redirect("back")
}

module.exports.detail= async (req, res) => { 
   const id = req.params.id

   const find = {
    deleted:false,
    _id:id,
   }
   const newRecords = await ProductCategory.findOne(find)

   res.render("admin/pages/product-category/detail", {
    pageTitle: "Chi tiet Danh Muc San pham",
    records : newRecords
}) 
}

module.exports.deleteItem= async (req, res) => { 
    const id = req.params.id

    await ProductCategory.updateOne({_id:id},{
        deleted:true,
        deletedAt:new Date()})

        req.flash('success', `delete products success`); 
        res.redirect("back")
}

