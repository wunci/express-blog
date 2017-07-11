var config = require('config-lite')(__dirname);
var mongoose=require('mongoose')
mongoose.Promise = global.Promise;  
mongoose.connect(config.mongodb);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('succuss')
});


var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var users=new Schema({
	categoryId  : ObjectId ,
	name: String,
	password: String,
	avator:String,
	posts : [{ type: Schema.Types.ObjectId, ref: 'Posts' }]
})

exports.User= mongoose.model('User',users)

// exports.User.index({name:1},{unique:true}).exec();


// function lastModifiedPlugin (schema, options) {
//   schema.add({ comment: abc })
  
//   schema.pre('save', function (next) {
//     this.comment = new abc
//     next()
//   })
  
  
// }

var posts=new Schema({
	categoryId  : ObjectId ,
	author: String,
	title: String,
	content:String,
	avator:String,
	date:String,
	pv:Number,
	comments : [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
	user : [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

exports.Posts= mongoose.model('Posts',posts)

var comments=new Schema({
	categoryId  : ObjectId ,
	author:String,
	postId:String,
	content:String,
	username:String,
	avator:String,
	posts : [{ type: Schema.Types.ObjectId, ref: 'Posts' }],
	user : [{ type: Schema.Types.ObjectId, ref: 'User' }]
})
// var deepPopulate = require('mongoose-deep-populate')(mongoose);
// posts.plugin(deepPopulate, [])
exports.Comments=mongoose.model('Comments',comments)

