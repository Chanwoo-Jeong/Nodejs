var http = require('http');
var fs = require('fs');
var url = require('url');

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
   ${body}
   </p>
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
      <p>${description}`)

      response.writeHead(200);
      response.end(templete);
      })
    })
  }
} else {
  response.writeHead(404)
  response.end("Not found")
}

});
app.listen(3000);
  