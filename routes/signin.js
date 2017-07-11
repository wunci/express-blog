var express=require('express');
var sha1=require('sha1');
var router=express.Router();
var UserModel=require('../lib/mongo.js').User
var checkNotLogin=require('../middlewares/check.js').checkNotLogin
router.get('/',function(req,res,next){
	res.render('signin')
})
router.post('/',checkNotLogin,function(req,res,next){
	var name=req.fields.name
	var password=req.fields.password;

	
	// var userData=new UserModel(user)
	UserModel.find({name:name},function(err,user){
		console.log(user)
		user=user[0]
		if(!user){
			req.flash('error','用户不存在');
			return res.redirect('back')
		}
		console.log(sha1(password))
		// console.log(user.password)
		if (sha1(password) != user.password) {
				req.flash('error','用户名或密码错误');
				return res.redirect('back')
			}

		req.flash('success','登录成功')
		delete user.password
		req.session.user=user;
		res.redirect('/posts')
		
	}).catch(next)
})
module.exports=router