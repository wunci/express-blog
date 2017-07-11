var path=require('path')
var express=require('express');
var sha1=require('sha1')
var mongoose=require('mongoose')
var router=express.Router();
var checkNotLogin=require('../middlewares/check.js').checkNotLogin;
var UserModel=require('../lib/mongo.js').User
// var moment=require('moment')
router.get('/',function(req,res,next){
	res.render('signup')
})
router.post('/',function(req,res,next){
	console.log(req.fields)
	var name=req.fields.name;
	var password=req.fields.password
	var repassword=req.fields.repassword;
	var avator=req.files.avatar.path.split(path.sep).pop();

	// password=sha1(password)

	
	// var id1 = new ObjectId;
	var user = {
		// _id:new Date().getTime(),
		// _id:mongoose.Types.ObjectId(),
		 // _id:id1,
	    name: name,
	    password: sha1(password),
	    avator:avator
	 };

	  var userData = new UserModel(user);

	  try{
	  	if (!(name.length>1 && name.length<10)) {
	  		throw new Error("名字限制在1到10个字符")
	  	}

	  	if(password.length<6) {
	  		throw new Error('密码至少为6个字符')
	  	}
	  }
	  catch(e){
	  	req.flash('error',e.message)
	  	res.redirect('/signup')
	  }

	  userData.save()
		.then(function(doc){
			 user=doc;
			 console.log('user,'+doc)
			 delete doc.password;
			 req.session.user = user;
			 req.flash('success', '注册成功');
			// console.log(user)
			res.redirect('/posts');
		}).catch(function(e){

		if (e.message.match("E11000 duplicate key")) {
			req.flash('error','用户名被占用')
			res.redirect('/signup')
		}
	})
	 // UserModel.create(user,function(a){
	 // 	console.log(a)
		// 	res.redirect('/posts');
	 // })
	 // .then(function(result){
	 // 	 user = result.ops[0];
	 // 	   delete user.password;
	 // 	     req.session.user = user;
	 // 	      req.flash('success', '注册成功');
	 	         
	 // }).catch(function(e){
	 // 	console.log('注册失败')
	 // 	next(e)
	 // })
})


module.exports=router