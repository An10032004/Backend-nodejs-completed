const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const productsHelper = require("../../helpers/products")

module.exports.add = async (req,res) => {
    const id = req.params.productId
    const quantity = parseInt(req.body.quantity)
    const cartId = req.cookies.cartId

    // console.log(id)
    // console.log(quantity)
    // console.log(cartId)
    const cart = await Cart.findOne({
        _id : cartId
    })

    const existCart = cart.products.find(item => item.product_id == id)

    if(existCart){
        const quantityNew = quantity + existCart.quantity
        await Cart.updateOne({
            _id : cartId,
            "products.product_id":id
        },{
            $set:{
                "products.$.quantity":quantityNew
            }
        })
    }else{

        const objectId = {
            product_id:id,
            quantity:quantity,
        }
    
        await Cart.updateOne(
            {
                _id : cartId
            },
            {
                $push:{ products : objectId}
            }
        )
    
    }
    
    req.flash("success","added")
    res.redirect("back")
}

module.exports.index = async (req,res) => {
    const cartId = req.cookies.cartId

    const cart = await Cart.findOne({
        _id:cartId
    })

    if(cart.products.length > 0){
        for (const item of cart.products) {
            const product_id = item.product_id
            const productInfor = await Product.findOne({
                _id:product_id
            }).select("title thumbnail price discountPercentage")

            productInfor.priceNew = productsHelper.priceNewProduct(productInfor)

            item.productInfor = productInfor
        }
    }
    cart.totalPrice = cart.products.reduce((sum,item) => sum + item.quantity * item.productInfor.priceNew,0)

    res.render("client/pages/cart/index",{
        pageTitle:"Gio Hang",
        cartDetail: cart
    })
}

module.exports.delete = async (req,res) => {
    const productId = req.params.productId
    const cartId = req.cookies.cartId

    await Cart.updateOne({
        _id:cartId
    },{
        $pull : { products : { product_id :productId}}})
    req.flash("success","deleted successful")

    res.redirect("back")
}

module.exports.update = async (req,res) => {
    const productId = req.params.productId
    const quantity = req.params.quantity
    const cartId = req.cookies.cartId

    await Cart.updateOne({
        _id : cartId,
        "products.product_id":productId
    },{
        $set:{
            "products.$.quantity":quantity
        }
    })

    req.flash("success","cap nhat so luong thanh cong")

    res.redirect("back")
}