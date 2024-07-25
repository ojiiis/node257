const http = require("http");
const mp = require("multiparty");
const fs = require('fs');
const serve = http.createServer((req,res)=>{
  if(req.method == "POST" && req.url == "/upload"){
    console.log("here");
    const form = new mp.Form();
   form.parse(req,(err,fields,files)=>{
        if(err) throw err;
       var file1 = files.file[0]; 
       console.log(file1)
       console.log(__dirname)
       path = file1.path;
       fs.rename(path,'dsd.ds',(err)=>{
        res.statusCode = 200;
        res.write('Ended')
        res.end()
       })
    });
  }else{
    res.setHeader('Content-Type','text/html');
    res.statusCode = 200;
    res.write(`
        <form action="/upload" method="POST" enctype="multipart/form-data">
        <input type="file" name="img">
        <input type="submit" name="submit">
        </form>
        `);
    res.end();

  }
});

serve.listen(3000);