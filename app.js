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

const listSchema = {
    name : String,
    items: [itemsSchema]
};

const List = mongoose.model("List",listSchema);








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
    const listName = req.body.list;
    
     const workItem = new Item({
            name : item
        })

        if(listName === "Today"){
            workItem.save()
            res.redirect("/");
        }
        else{
            List.findOne({name : listName},function(err,foundList){
                foundList.items.push(workItem);
                foundList.save();
                res.redirect("/" + listName)
            })
        }

        

   
  
    
});

app.post("/delete",function(req,res){
    let id = req.body.checkBox;

    Item.deleteOne({_id : id},function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Successfully deleted item");
        }
        res.redirect("/");
    })

})

app.get("/:customListName",function(req,res){
    const customListName = req.params.customListName;

    if(customListName == 'favicon.ico'){
        res.status(204).end()
    }
    else{
        console.log(customListName);
        List.findOne({name : customListName} ,function(err,foundList){

            if(!err){
                if(!foundList){
                    //create a new list
                    const list = new List({
                        name : customListName,
                        items: defaultItems
                    })
                    list.save();
                    res.redirect("/"+customListName)
                   
                }
                else{
                   //show exisiting list
                   res.render('list',{
                    listTitle : foundList.name,
                    newListItem : foundList.items
                });
                }
            }
            else{
                console.log(err);
            }
        
          })
    }
    
 

   

})



app.listen(3000,function(){
    console.log("Server stared on port 3000");
});

