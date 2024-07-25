const http = require("http")
const mp = require("multiparty")
const fs = require("fs")

const server = http.createServer((req,res)=>{
if(req.method=="POST"){
    form = new mp.Form();
    form.parse(req,(err,field,file)=>{
        console.log(file['favor'][0].originalFilename)
        fs.rename(file['favor'][0].path,file['favor'][0].originalFilename,(err)=>{
    res.statusCode =200
    res.write(`form recieved`) 
    res.end()
           })
    })
    
}else{
    res.setHeader("Content-Type","text/html")
    res.statusCode =200
    res.write(`
        <form method="POST" enctype="multipart/form-data">
        <input type="file" name="favor">
        <input type="text" name="nh" value="New Horizons">
        <input type="submit">
        </form>
        `);
    res.end()
}
});
server.listen(3000)