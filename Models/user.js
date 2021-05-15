const getDb = require("../util/database").getDb;
const mongoDb = require("mongodb");
class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection("users").insertOne(this);
    }

    static findById(userId) {
        const db = getDb();
        return db.collection("user").findOne({
            _id: new mongoDb.ObjectID(userId),
        });
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex((cp) => {
            console.log(cp.productId);

            return cp.productId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                productId: new mongoDb.ObjectID(product._id),
                quantity: newQuantity,
            });
        }
        const updatedCart = {
            items: updatedCartItems,
        };
        const db = getDb();
        return db.collection("user").updateOne({
            _id: new mongoDb.ObjectID(this._id),
        }, {
            $set: {
                cart: updatedCart,
            },
        });
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map((item) => item.productId);
        return db
            .collection("products")
            .find({
                _id: {
                    $in: productIds,
                },
            })
            .toArray()
            .then((products) => {
                return products.map((p) => {
                    return {
                        ...p,
                        quantity: this.cart.items.find((i) => {
                            return i.productId.toString() === p._id.toString();
                        }).quantity,
                    };
                });
            })
            .catch((err) => console.log(err));
    }

    deleteItemFromCart(productId) {
        const db = getDb();
        const updatedCartItems = this.cart.items.filter(
            (item) => item.productId.toString() !== productId.toString()
        );
        return db.collection("user").updateOne({
            _id: new mongoDb.ObjectID(this._id),
        }, {
            $set: {
                cart: {
                    items: updatedCartItems,
                },
            },
        });
    }

    addOrder() {
        const db = getDb();
        return this.getCart().then((products) => {
            const order = {
                items: products,
                user: {
                    _id: new mongoDb.ObjectID(this._id),
                    name: this.username
                }
            };
            return db.collection("orders")
                .insertOne(order);
        }).then((result) => {
            this.cart = {
                items: [],
            };
            db.collection("user").updateOne({
                _id: new mongoDb.ObjectID(this._id),
            }, {
                $set: {
                    cart: {
                        items: [],
                    },
                },
            });
        });
    }

    getOrders() {
        const db = getDb();
        return db.collection('orders').find({'user._id': new mongoDb.ObjectID(this._id)}).toArray();
    }
}

module.exports = User;