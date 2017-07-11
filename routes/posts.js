var express=require('express');
var router=express.Router();
var checkLogin=require('../middlewares/check.js').checkLogin
var PostModels=require('../lib/mongo.js').Posts
var CommentsModles=require('../lib/mongo.js').Comments
var moment=require('moment')
router.get('/',function(req,res,next){
	var author=req.query.author;
	var query = {};
    if (author) {
      query.author = author;

    }
    
	PostModels.find(query).populate([{path:'comments', model:PostModels}]).exec(function(err,result){
		console.log('result',result)
		// result.pv+=1
		res.render('post',{
			posts:result
		})
	})
	// PostModels.find(query)
	console.log('author',author)
})



router.get('/create',function(req,res,next){
	res.render('create')
})


router.post('/',function(req,res,next){
	//res.render('create');
	var author=req.session.user._id
	var avator=req.session.user.avator
	console.log('user',req.session.user)
	var title=req.fields.title;
	var content=req.fields.content;
	
	post={
		author:author,
		title:title,
		content:content,
		avator:avator,
		date:moment().format('YYYY-MM-DD HH:mm'),
		pv:0
	}

	var Posts=new PostModels(post);
	Posts.save()
		.then(function(result){
			// console.log(1,result)
			console.log(result._id)
			// console.log('result',result)
			res.redirect(`/posts/${result._id}`)
		})
})


router.get('/:postId', function(req, res, next) {
  	var postId = req.params.postId;
  	console.log('postId',postId)

  	Promise.all([
    	PostModels.findById(postId),// 获取文章信息
    	CommentsModles.find({postId:postId}),// 获取该文章所有留言
  	]).then(function(result){
	 	console.log('个人文章',result)
	  	console.log('个人文章评论',result[1].length)
	  	var commentsLength=result[1].length;
	  	var pv=result[0].pv+1;
	  	PostModels.update({pv:postId},function(err){

	  	})
	    res.render('posts', {
	      	post: result[0],
	      	comments:result[1],
	      	commentsLength:result[1].length,
	      	pv:pv
	    });
  })

});


router.post('/:postId/comment', function(req, res, next) {
	// res.render('')
	var author=req.session.user._id
	var postId=req.params.postId;
	var content=req.fields.content;
	var username=req.session.user.name;
	var avator=req.session.user.avator;
	console.log('comment',author)
	var comment={
		author:author,
		postId:postId,
		content:content,
		username:username,
		avator:avator,
	}

	var comments=new CommentsModles(comment)
	comments.save()
		.then(function(result){
			req.flash('success','留言成功')
			console.log('comment',result)
			res.redirect('back')
		})
})


router.get('/:postId/edit',function(req,res,next){
	var postId=req.params.postId;
	var author=req.session.user._id;
	PostModels.findById(postId,function(err,result){
		console.log('edit',result)
		res.render('edit',{
			post:result
		})
	})
})


router.post('/:postId/edit',function(req,res,next){
	var postId=req.params.postId;
	var author=req.session.user._id;
	var title=req.fields.title
	var content=req.fields.content;

	PostModels.update({_id:postId},{$set:{title:title,content:content}},function(err,result){
		req.flash('success','更新文章成功')
		res.redirect(`/posts/${postId}`)
	})
})


router.get('/:postId/remove',function(req,res,next){
	var postId=req.params.postId;
	var author=req.session.user._id;
	PostModels.remove({_id:postId},function(err,result){
		req.flash('success','删除成功')
		res.redirect('/posts')
	})
})


router.get('/:postId/comment/:commentId/remove',function(req,res,next){
	var commentId=req.params.commentId;
	var author=req.session.user._id;
	CommentsModles.remove({_id:commentId},function(err){
		req.flash('success','删除留言成功')
		res.redirect('back')
	})
})
module.exports=router