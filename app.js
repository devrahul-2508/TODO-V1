const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

var items = ["Buy Food","Cook Food","Eat Food"];
var workItems = [];

app.get("/",function(req,res){

   let day = date.getDate();
    
   
    res.render('list',{
        listTitle : day,
        newListItem : items
    });

});

app.post("/",function(req,res){

    var item = req.body.newItem;
    if(req.body.list == "WorkList"){
       workItems.push(item);
       res.redirect("/work");
    }
    else{
        items.push(item);
        res.redirect("/");
    }
   
  
    
});



app.listen(3000,function(){
    console.log("Server stared on port 3000");
});

app.get("/work",function(req,res){
    res.render("list",{
        listTitle : "WorkList",
        newListItem : workItems
    });
});

app.post("/work",function(req,res){
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work")
})