// var fs = require('fs')
// fs.readFile('sample.txt', 'utf-8',function(err,data){
//     console.log(data)
// })

// var testFolder = '../data'
// var fs = require('fs')

// fs.readdir(testFolder, function(error,filelist){
// console.log(filelist)
// });

var fs = require('fs')
console.log("a")
fs.readFile('sample.txt','utf-8' ,(err,result)=>{
    console.log(result)
})
console.log("C")