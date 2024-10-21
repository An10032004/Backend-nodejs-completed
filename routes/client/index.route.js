const categoryMiddleware = require("../../middlewares/client/category.middleware")
const cartMiddleware = require("../../middlewares/client/cart.middleware")
const userMiddleWare = require("../../middlewares/client/user.middleware");
const settingMiddleWare = require("../../middlewares/client/setting.middleware");
const authMiddleWare = require("../../middlewares/client/auth.middleware");



const homeRoutes = require("./home.route");
const productRoutes = require("./product.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");
const chatRoutes = require("./chat.route");
module.exports = (app) => {
    app.use(categoryMiddleware.category)
    app.use(cartMiddleware.cartId)
    app.use(userMiddleWare.infoUser)
    app.use(settingMiddleWare.settingGeneral)
    app.use('/', homeRoutes)

    app.use('/products', productRoutes);

    app.use('/search', searchRoutes);


    app.use('/cart', cartRoutes);


    app.use('/checkout', checkoutRoutes);


    app.use('/user', userRoutes);
    app.use('/chat',authMiddleWare.requireAuth, chatRoutes);


} 