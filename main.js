var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');


function templeteHTML (title,list,body) {
 return  `
 <!doctype html>
 <html>
 <head>
   <title>WEB1 - ${title}</title>
   <meta charset="utf-8">
 </head>
 <body>
   <h1><a href="/">WEB</a></h1>
   ${list}
   <a href="/create">create</a>
   ${body}
   
 </body>
 </html>
 `
}

function templeteList (filelist) {
  var list ='<ul>'
 var i =0 
 while(i<filelist.length){
   list = list+ `<li><a href='/?id=${filelist[i]}'>${filelist[i]}</a></li>`
   i=i+1
 }
 list = list + '</ul>'
 return list
}

var app = http.createServer(function(request,response){
var _url = request.url;
var queryData = new URL('http://localhost:3000' + _url).searchParams;
var pathname = url.parse(_url,true).pathname

if(pathname ==='/'){
  if(queryData.get("id") === null){
    
   fs.readdir('./data', function(error,filelist){
      console.log(filelist)
      var title = "Welcome"
      var description = "Hello NodeJS"
     
      var list = templeteList(filelist)

      var templete = templeteHTML(title, list, `<h2>${title}</h2>
      <p>${description}`)
      response.writeHead(200);
      response.end(templete);
   })   
  } else {
    fs.readdir('./data', function(error,filelist){
      console.log(filelist)
      var title = "Welcome"
      var description = "Hello NodeJS"
     
      var list = templeteList(filelist)

    fs.readFile(`data/${queryData.get("id")}`, 'utf8', function(err, description){
      let title = queryData.get('id')
      var templete = templeteHTML(title, list, `<h2>${title}</h2>
      <p>${description}</p>` )

      response.writeHead(200);
      response.end(templete);
      })
    })
  }
} else if(pathname ==="/create"){
  fs.readdir('./data', function(error,filelist){
    console.log(filelist)
    var title = "Welcome"
    var description = "Hello NodeJS"
   
    var list = templeteList(filelist)

    var templete = templeteHTML(title, list, `<h2>WEB- Create</h2>
    <form action="http://localhost:3000/create_process" method="post">
    <p><input type="text" name="title" placeholder="title"></p>
    <p>
      <textarea name="description" placeholder="description"></textarea>
    </p>
    <p>
      <input type="submit">
    </p>
    </form>
    `)
    response.writeHead(200);
    response.end(templete);
 })   
} else if (pathname === "/create_process") {
  var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
        var title = new URLSearchParams(body).get('title');
        var description = new URLSearchParams(body).get('description');
        console.log(title, description)
      });
      response.writeHead(200);
      response.end('success');
}else {
  response.writeHead(404)
  response.end("Not found")
}

});
app.listen(3000);
  