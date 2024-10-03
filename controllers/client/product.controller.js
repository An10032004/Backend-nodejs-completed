const Product = require("../../models/product.model")
const ProductCategory = require("../../models/product-category.model")
const productsCategoryHelper = require("../../helpers/product-category");
const productsHelper = require("../../helpers/products");
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }
  ).sort({position: "desc"})

    const newProducts = products.map(item =>{
      item.priceNew = (item.price*(100 - item.discountPercentage) / 100).toFixed(0)
      return item
    })

    console.log(newProducts)

    res.render("client/pages/products/index", {
      pageTitle: "Danh sách sản phẩm",
      products: newProducts
    });
  
  }

module.exports.detail = async (req, res) => {
    try {
      const find = {
      deleted: false,
      slug: req.params.slugProduct,
      status:"active"
  }

  const product = await Product.findOne(find)

  if(product.product_category_id){
    const category = await ProductCategory.findOne({
      _id:product.product_category_id,
      status:"active",
      deleted:false,
    })

    product.category = category
  }

  product.priceNew = productsHelper.priceNewProduct(product)

  res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product
  })  
  } catch (error) {
      res.redirect(`/products`)       
  }
}

module.exports.category = async (req, res) => {
    const category = await ProductCategory.findOne({
      slug: req.params.slugCategory,
      deleted:false,
    })
    const listSubCategory = await productsCategoryHelper.getSubCategory(category.id);

    const listSubCategoryId = listSubCategory.map(item => item.id);

    const products = await Product.find({
      product_category_id: { $in: [category.id, ...listSubCategoryId]},
      deleted:false,
    }).sort({position : "desc"})

    const newProducts = products.map(item =>{
      item.priceNew = (item.price*(100 - item.discountPercentage) / 100).toFixed(0)
      return item
    })
    
    res.render("client/pages/products/index", {
      pageTitle: category.title,
      products: newProducts
    });
}
   
    
  
  
  

   

