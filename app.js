const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");


const itemsSchema = {
    name : String
};

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
    name : "Welcome to your todolist"
});

const item2 = new Item({
    name : "Hit the + button to add a new item"
})

const item3 = new Item({
    name : "<-- Hit this to delete an item"
})

const defaultItems = [item1,item2,item3];








app.get("/",function(req,res){


   
    Item.find(function(err,foundItems){
        if(err){
            console.log(err);
        }
        else{

            if(foundItems.length === 0){
                Item.insertMany(defaultItems,function(err){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("Successfully saved to DB");
                    }
                })
                res.redirect("/");
            }else{
                res.render('list',{
                    listTitle : "Today",
                    newListItem : foundItems
                });
            }

           
            
        }
       
    })
   
   

});

app.post("/",function(req,res){

    var item = req.body.newItem;
    if(req.body.list == "WorkList"){
       workItems.push(item);
       res.redirect("/work");
    }
    else{
        const workItem = new Item({
            name : item
        })
        workItem.save()
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