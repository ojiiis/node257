const http = require("http")
const mysql = require("mysql")
const qs = require("querystring")
const con = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"",
  database:"blog"  
})
con.connect((err)=>{
    if(err) throw err
});
const server = http.createServer((req,res)=>{
    const path = req.url.split("?")[0];
    const query = (req.url.split("?").length > 0)?req.url.split("?")[1]:'';
if(path == "/"){
    res.setHeader('Content-Type','text/html');
    con.query("SELECT * FROM blog",(err,rows)=>{
        res.write("<ul>")
        for(let i = 0; i < rows.length; i++){
            res.write("<li>"+rows[i].title+" <span class='clicktoDelete' id='"+rows[i]._id+"'>Delete</span> <a  href='update?id="+rows[i]._id+"'>Update</a> </li>");
        }
        res.write("</ul>")
        res.write(`
           <script>
           var cd = document.getElementsByClassName("clicktoDelete");
          for(let i = 0; i < cd.length; i++){
           cd[i].onclick = function(){
           fetch("/delete?id="+this.id).then(r=>r.text()).then(r=>console.log(r))
           }
           }
           
           </script> 
            
            `)
        res.statusCode = 200;
        
        res.end()
    })
}else if(path == "/delete"){
const urlQuery = qs.parse(query)
con.query("DELETE FROM blog where _id='"+urlQuery.id+"' ",(err,resp)=>{
    if(err) throw err;
res.statusCode = 200;
res.write('Query Successful')
res.end()
})
}else if(path == "/update"){
    res.setHeader("Content-Type","text/html")
    const urlQuery = qs.parse(query)
    con.query("SELECT * FROM blog where _id='"+urlQuery.id+"' ",(err,resp)=>{
        if(err) throw err;
    res.statusCode = 200;
   
    res.write(`
        <form method="post" action="update_table">
        <textarea name="title">${resp[0].title}</textarea>
        <textarea name="body">${resp[0].body}</textarea>
        <input type="hidden" name="id" value="${urlQuery.id}">
        <input type="submit">
        </form>
        `)
    res.end()
    })
    }else if(path == "/update_table"){
        var rd = []
        req.on("data",(chunk)=>{
            rd.push(chunk)
        })
        req.on("end",()=>{
            var data = Buffer.concat(rd).toString()
            res.statusCode = 200;
            objData = qs.parse(data);
            res.write(objData.title)
            res.end()
        })
       
    }
       
});

server.listen(3000,'127.0.0.1',()=>{
    console.log('hello world')
})