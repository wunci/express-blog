var path = require('path');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite')(__dirname);
var routes = require('./routes');
var pkg = require('./package');
var app=express();

//设置模板引擎目录
app.set('views', path.join(__dirname, 'views'));
//设置模板引擎
app.set('view engine','ejs')
//设置静态文件目录
app.use(express.static(path.join(__dirname,'public')))

//session中间件
app.use(session({
	name:config.session.key,
	secret:config.session.secret,
	resave:true,
	saveUninitialized:false,
	cookie:{
		maxAge:config.session.maxAge
	},
	store:new MongoStore({
		url:config.mongodb
	})
}))


app.use(flash());

app.locals.blog={
	title:pkg.name,
	description:pkg.description,
}

app.use(function(req,res,next){
	res.locals.user=req.session.user
	res.locals.success=req.flash('success').toString()
	res.locals.error=req.flash('error').toString()
	next()
})

app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img'),// 上传文件目录
  keepExtensions: true// 保留后缀
}));

routes(app);

app.listen(config.port,function(){
	console.log(`${pkg.name} listening on port ${config.port} `)
})