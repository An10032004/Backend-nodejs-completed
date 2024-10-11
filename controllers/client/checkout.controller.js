const Cart = require("../../models/cart.model")
const Order = require("../../models/order.model")
const Product = require("../../models/product.model")
const productsHelper = require("../../helpers/products")
module.exports.index = async (req, res) => {   
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
    res.render("client/pages/checkout/index", {
        pageTitle: "Dat hang",
        cartDetail :cart
    });
  
  }

  module.exports.order = async (req, res) =>{
    const cartId = req.cookies.cartId
    const userInfor = req.body

    const cart = await Cart.findOne({
        _id : cartId
    })
    const products = []
    for (const product of cart.products) {
        let objectProduct = {
            product_id:product.product_id,
            price:0,
            discountPercentage:0,
            quantity:product.quantity
        }

        const productInfor = await Product.findOne({
            _id : product.product_id,
        }).select("price discountPercentage")

        objectProduct.price = productInfor.price
        objectProduct.discountPercentage = productInfor.discountPercentage

        products.push(objectProduct)

        
    }
    const objectOrder = {
        cart_id: cartId,
        userInfor: userInfor,
        products: products
    };

    const order = new Order(objectOrder);
    await order.save();

    await Cart.updateOne({
        _id: cartId
    }, {
        products: []
    });

    res.redirect(`/checkout/success/${order.id}`);
  }

  module.exports.success = async (req, res) =>{
    
    const order = await Order.findOne({
        _id: req.params.orderId
    })
    console.log(order)
    for (const product of order.products ) {
        const productInfor = await Product.findOne({
            _id: product.product_id
        }).select("title thumbnail")

        product.productInfor = productInfor

        product.priceNew = productsHelper.priceNewProduct(product)

        product.totalPrice = product.priceNew * product.quantity
    }
    order.totalPrice = order.products.reduce((sum,item) => sum + item.totalPrice,0)

    res.render("client/pages/checkout/success", {
        pageTitle: "Dat hang Thanh cong",
        order:order
    });
  }