const Product = require('../../models/product.model')
const productsHelper = require('../../helpers/products')
module.exports.index = async (req, res) => {
    const productFeatured = await Product.find({
        featured: "1",
        deleted:false,
        status:"active"
    }).limit(6)
    

    const newProductsFeatured = productsHelper.priceNewProducts(productFeatured)

    const productsNew = await Product.find({
        deleted:false,
        status:"active"
    }).sort({ position: "desc" }).limit(6)
    
    const newProductsNew = productsHelper.priceNewProducts(productsNew)
    res.render("client/pages/homes/index", {
        pageTitle: "Trang chủ",
        productFeatured:newProductsFeatured,
        productsNew:newProductsNew
    }) 
}