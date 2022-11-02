var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var templete = require('./lib/templete.js')



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
     
      var list = templete.list(filelist)
      var html = templete.html(title, list,
         `<h2>${title}</h2><p>${description}</p>`,
         `<a href="/create">create</a>`)
      response.writeHead(200);
      response.end(html);
   })   
  } else {
    fs.readdir('./data', function(error,filelist){
      console.log(filelist)
      var list = templete.list(filelist)

    fs.readFile(`data/${queryData.get("id")}`, 'utf8', function(err, description){
      let title = queryData.get('id')
      var html = templete.html(title, list, `<h2>${title}</h2>
      <p>${description}</p>`,
      `<a href="/create">create</a>
      <a href="/Update?id=${title}">Update</a>
      <form action="/Delete_process" method="post" >
      <input type="hidden" name="id" value="${title}">
      <input type="submit" value="Delete">
      </form>` )

      response.writeHead(200);
      response.end(html);
      })
    })
  }
} else if(pathname ==="/create"){
  fs.readdir('./data', function(error,filelist){
    console.log(filelist)
    var title = "Welcome"
    var description = "Hello NodeJS"
   
    var list = templete.list(filelist)
    var html = templete.html(title, list, `
    <h2>WEB- Create</h2>
    <form action="/create_process" method="post">
    <p><input type="text" name="title" placeholder="title"></p>
    <p>
      <textarea name="description" placeholder="description"></textarea>
    </p>
    <p>
      <input type="submit">
    </p>
    </form>
    `,'')
    response.writeHead(200);
    response.end(html);
 })   
} else if (pathname === "/create_process") {
  var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
        var title = new URLSearchParams(body).get('title');
        var description = new URLSearchParams(body).get('description');
        fs.writeFile(`data/${title}`,description,'utf8',(err)=>{
          response.writeHead(302,{Location:`/?id=${title}`});
          response.end();
        })
      });
      
}else if(pathname ==='/Update'){
  fs.readdir('./data', function(error,filelist){
    console.log(filelist)
    var list = templete.list(filelist)

  fs.readFile(`data/${queryData.get("id")}`, 'utf8', function(err, description){
    let title = queryData.get('id')
    var html = templete.html(title, list, 
    `
    <h2>WEB-${title}</h2>
    <form action="/update_process" method="post">
    <p><input type="hidden" name="id" value=${title}></p>
    <p><input type="text" name="title" placeholder="title" value=${title}></p>
    <p>
      <textarea name="description" placeholder="description" >${description}</textarea>
    </p>
    <p>
      <input type="submit">
    </p>
    </form>
    `,
    `<a href="/create">create</a><a href="/Update?id=${title}"> Update</a>` )

    response.writeHead(200);
    response.end(html);
    })
  })
}else if(pathname === "/update_process") {
  var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
        var id = new URLSearchParams(body).get('id');
        var title = new URLSearchParams(body).get('title');
        var description = new URLSearchParams(body).get('description');
        console.log(new URLSearchParams(body))
        fs.rename(`data/${id}`,`data/${title}`,(err)=>{})
        fs.writeFile(`data/${title}`,description,'utf8',(err)=>{
          response.writeHead(302,{Location:`/?id=${title}`});
          response.end();
        })
      });
} else if(pathname === "/Delete_process") {
  var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
        var id = new URLSearchParams(body).get('id');
        console.log(id)
        fs.unlink(`data/${id}`, function(error){
          response.writeHead(302, {Location: `/`});
          response.end();
        })
      });
}else {
  response.writeHead(404)
  response.end("Not found")
}

});
app.listen(3000);
  