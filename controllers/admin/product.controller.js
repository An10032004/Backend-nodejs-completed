const Product = require("../../models/product.model")
const Account = require("../../models/account.model")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")

const systemConfig = require("../../config/system")
const ProductCategory = require("../../models/product-category.model")
const createTreeHelper = require("../../helpers/createTree")

//[GET] /admin/products
module.exports.index= async (req, res) => { 
    
    const filterStatus = filterStatusHelper(req.query)

    let find = {
        deleted: false,
      
    }
    const objectSearch = searchHelper(req.query)
    
    if(objectSearch.regex){
        find.title = objectSearch.regex
    }


    if(req.query.status){
        find.status = req.query.status;
    }
    const countProducts = await Product.countDocuments(find)

    let objectPagination = paginationHelper(
    {
        currentPage: 1,
        limitItems:4
    },
    req.query,
    countProducts
)

//sort
let sort = {}

if(req.query.sortKey && req.query.sortValue){
    sort[req.query.sortKey] = req.query.sortValue
}else{
    sort.position = "desc"
}

//sort


    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)
    
    for (const product of products) {
        const user = await Account.findOne({
            _id: product.createdBy.account_id
        })
        if(user){
            product.accountFullname = user.fullName
        }
    }

    

    res.render("admin/pages/products/index", {
        pageTitle: "Danh Sach San pham",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    }) 
}

//[Patch]/admin/change-status
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status
    const id = req.params.id
     await Product.updateOne({_id: id},{status: status})

     req.flash('success', 'Update success');

    res.redirect("back")
}

//[Patch]/admin/change-multi
module.exports.changeMulti = async (req, res) => {
   const type = req.body.type
   const ids = req.body.ids.split(", ")

    switch (type) {
        case "active":
            await Product.updateMany({ _id:  { $in: ids} },{ status : "active" } )
            req.flash('success', `Update status ${ids.length} products success`);
            break;
        case "inactive":
            await Product.updateMany({ _id:  { $in: ids} },{ status : "inactive" } )    
            req.flash('success', `Update status ${ids.length} products success`);    
            break;
        case "delete-all":
            await Product.updateMany(
                { _id:  { $in: ids} },
                {
                    deleted:true,
                    deletedBy:{
                        account_id: res.locals.user.id,
                        deletedAt: new Date(),
                    },
                } )    
                req.flash('success', `delete  ${ids.length} products success`);    
            break;
        case "change-position":
            for (const item of ids) {
                let [id,position] = item.split("-")
                position = parseInt(position)
                await Product.updateOne({_id: id},{position:position})
            }
            req.flash('success', `Change ${ids.length} products Position success`); 
            break;
        default:
            break;
    }
    res.redirect("back")
}

//[Delete]/admin/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id
     await Product.updateOne({_id: id}, {
        deleted: true,
        // deletedAt:new Date()
        deletedBy:{
            account_id: res.locals.user.id,
            deletedAt: new Date(),
        },
     }) 
    req.flash('success', `delete products success`); 
    res.redirect("back")
}
//[GET] /admin/products/create
module.exports.create= async (req, res) => { 
    
    let find = {
        deleted :false,

    }


    const category = await ProductCategory.find(find)

    const newCategory = createTreeHelper.tree(category);

    res.render("admin/pages/products/create", {
        pageTitle: "Them moi San pham",
        category:newCategory
    }) 
}
//[post] /admin/products/create
module.exports.createPost= async (req, res) => { 
    
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)

    if(req.body.position == ""){
        const countProducts = await Product.countDocuments()
        req.body.position =countProducts + 1
    }else{
        req.body.position = parseInt(req.body.position)
    }

    // if(req.file){
    // req.body.thumbnail = `/uploads/${req.file.filename}`
    // }
    req.body.createdBy = {
        account_id: res.locals.user.id
    }
    const product = new Product(req.body)
    await product.save()

    res.redirect(`${systemConfig.prefixAdmin}/products`)
}

//[GET] /admin/products/edit/"id"
module.exports.edit= async (req, res) => { 
    try {
        const find = {
        deleted: false,
        _id: req.params.id
    }
    const category = await ProductCategory.find({
        deleted: false,
    })

    const newCategory = createTreeHelper.tree(category);

    const product = await Product.findOne(find)

    res.render("admin/pages/products/edit", {
        pageTitle: "Sua San pham",
        product: product,
        category:newCategory
    })  
    } catch (error) {
        req.flash("error",`San pham khong hop le`)
        res.redirect(`${systemConfig.prefixAdmin}/products`)       
    }
   
}

//[PATCH] /admin/products/edit/"id"
module.exports.editPatch = async (req,res) => {
    const id = req.params.id

    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position)

    if(req.file){
    req.body.thumbnail = `/uploads/${req.file.filename}`
    }

    try {
        await Product.updateOne({_id: id},req.body)
        req.flash("success",`Cap nhat thanh cong`)
    } catch (error) {
        req.flash("error",`cap nhat khong thanh cong`)
    }

   res.redirect("back")
}

//[GET] /admin/products/detail/"id"
module.exports.detail= async (req, res) => { 
    try {
        const find = {
        deleted: false,
        _id: req.params.id
    }

    const product = await Product.findOne(find)

    res.render("admin/pages/products/detail", {
        pageTitle: product.title,
        product: product
    })  
    } catch (error) {
        req.flash("error",`San pham khong hop le`)
        res.redirect(`${systemConfig.prefixAdmin}/products`)       
    }
   
}

