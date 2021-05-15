const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db; 
const mongoConnect = (callBack) => {
  MongoClient.connect('mongodb+srv://rajeevmehta:Ilovemyasus2189@cluster0.7wo0n.mongodb.net/shop?retryWrites=true', {
    useUnifiedTopology: true
  })
    .then((client) => {
      _db = client.db(); 
      callBack(); 
    }).catch((err) => {
      throw err;
    });
}


const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found';
}
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;