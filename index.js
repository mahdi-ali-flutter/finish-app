

//

const express=require('express');
const path=require('path');
const mongo=require("mongoose");
const app=express();
const params=require("params");
const bodyParser = require('body-parser');

const { resourceLimits } = require('worker_threads');
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json());
const multer=require('multer');
app.use(express.static(path.join(__dirname,'images')));

//yUxpIMoLyAUDqc67
var url1="mongodb+srv://Mahdi:mahdi@cluster0.7v8ud.mongodb.net/mahdi?retryWrites=true&w=majority"
var url="mongodb+srv://mahdi:mahdi@cluster0.3lvnvig.mongodb.net/mahdi?retryWrites=true&w=majority";
var databsae;
var image_url;
async function connectDB() {
  try {
    await mongo.connect(url1, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Could not connect to MongoDB', err);
  }
}

connectDB();
// await mongo.connect(url1,{useNewUrlParser:true,useUnifiedTopology:true},
//      function(err, db) {
//     if (err) throw err;   
//       console.log(" conected database successfuly ...");
//   })///get item one from page view 

  var product={
    name :{type:String ,  unique: true , dropDups: true },
    price:Number,
    count:Number,
    decsription:String,
    
   }
   const products=new mongo.model("products",product);
  
          ////upload iamge 

       const storage= multer.diskStorage({
            destination:function(req,file,cb){
              cb(null,path.join(__dirname,"./images"))
            },
            filename(req,file,cb){
              cb(null,newData().replace(/:/g,'_')+file.originalname)
            }
          });

     const upload=multer({storage:storage});


   app.get('/data',async (req,res,next)=>{
    console.log("data excuted");
    fetchid=req.params.id  ;
    let value = await products.find({id:fetchid});
    return res.json(value);
  });
  
  
    app.post('/post',upload.single('image') ,async(req,res)=>{
      console.log("inside post function ");
    
      // const data=new products({
      //   name:req.body.name,
      //   price:req.body.price,
      //   count:req.body.count,
      //   decsription:req.body.decsription
      // });
      /*
      في الكود ادناه نعمل select للمنتج حسب الاسم 
      اذا كان موجود بالداتا راح ينفذ else
      اذا مكان موجود راح يضيف المنتج
      */
      const isExsist = await products.findOne({name:req.body.name});
      if(!isExsist){
        const value =await products.create({name:req.body.name,
          price:req.body.price,
          count:req.body.count,
          decsription:req.body.decsription});
        res.json(value);
        console.log(req.body);
      }else{
        return res.status(400).json({message : "this products is already exists"})
      }
      
    });
  
    app.put('/update/:id',async(req,res,next)=>{
      const ID=req.params.id;
      const newData={
        name:req.body.name,
        price:req.body.price,
        count:req.body.count,
        decsription:req.body.decsription,
    }
    const result=await products.findOneAndReplace({_id:ID}
      ,newData);
    console.log(result);
    res.json({updatedCount : result.modifiedCount});
    });
  
    app.delete('/delete/:id',async(req,res)=>{
    
      const ID=req.params.id;
      const result=await products.deleteOne({_id:ID});
      res.json({deletedCount:result.deletedCount})
    
    });

    app.get('/data/:id',(req,res,next)=>{

      products.findById(req.params.id)
      .then(
        (products)=>{
          if(!products){return res.status(404).send();}
          res.send(products);
        }
      )
      .catch((err)=>{res.status(500).send(err);});
    });
    app.get('/data/:name',(req,res,next)=>{
          let name1=req.params.name;
      products.find({name:name1})
      .then(
        (products)=>{
          if(!products){return res.status(404).send();}
          res.send(products);
        }
      )
      .catch((err)=>{res.status(500).send(err);});
    });

    app.get('/data1/:name',(req,res,next)=>{

      products.findOne({name:req.params.name})
      .then(
        (products)=>{
          if(!products){return res.status(404).send();}
          res.send(products);
        }
      )
      .catch((err)=>{res.status(500).send(err);});
    });

     app.get('/search/:key',async(req,res)=>{
      console.log(req.params.key);
       
        let data=await products.find({
          "$or":[
            {name:{$regex:req.params.key}},
            {price:{$regex:req.params.key}}
          ]
         });
         res.send(data);
      
      
    });
    
const port = process.env.PORT || 4000;

app.listen(port,()=>{
    console.log(" conected on port 4000... http://localhost: ${port}");
});

