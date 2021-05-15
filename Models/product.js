const getDb = require('../util/database').getDb;
const mongoDb = require('mongodb');
class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = (id)  ? new mongoDb.ObjectID(id): null;
    this.userId = new mongoDb.ObjectID(userId)
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db.collection('products').updateOne({
        _id: new mongoDb.ObjectID(this._id)
      }, {
        $set: this
      });
    } else {
      dbOp = db.collection('products').insertOne(this);
    }

    return dbOp;

  }

  static fetchAll() {
    const db = getDb();
    return db.collection('products').find().toArray().then((products) => products).catch((err) => console.log(err));
  }

  static findById(prodId) {
    const db = getDb();
    return db.collection('products').findOne({
      _id: new mongoDb.ObjectID(prodId)
    }).then((product) => product).catch((err) => console.log(err));
  }

  static deleteById(prodId) {
    const db = getDb();
    return db.collection('products').deleteOne({
      _id: new mongoDb.ObjectID(prodId)
    }).then((result) => result).catch((err) => console.log(err));
  }
}
module.exports = Product;