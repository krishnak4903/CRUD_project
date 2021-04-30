const express=require('express')
const app=express();
const bodyParser=require('body-parser')
const MongoClient=require('mongodb').MongoClient

var db;
var s;

MongoClient.connect('mongodb://localhost:27017/Sweets', (err, database) => {
    if(err) return console.log(err)
    db =database.db('Fruit-Shop')
    app.listen(4000, ()=>{
        console.log('Server is listening at port number 4000...')
    })
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/',(req,res)=>{
    db.collection('seasonal').find().toArray((err,result)=>{
         if(err) return console.log(err)
        res.render('homepage.ejs',{data:result})
    })
})

app.get('/create',(req,res)=>{
    res.render('add1.ejs')
})

app.get('/updatestock',(req,res)=>{
    res.render('update.ejs')
})

app.get('/deleteproduct',(req,res)=>{
    res.render('delete.ejs')
})

app.post('/AddData',(req,res)=>{
    db.collection('seasonal').save(req.body,(err,result)=>{
        if(err) return console.log(err)
        res.redirect('/')
    })
})

app.post('/update',(req,res)=>{

    db.collection('seasonal').find().toArray((err,result)=>{
    if(err)
        return console.log(err)
    for(var i=0; i<result.length; i++)
    {
        if(result[i].id==req.body.id)
        {
            s=result[i].stock
            break
        }
    }
    db.collection('seasonal').findOneAndUpdate({id:req.body.id},{
        $set:{ stock: parseInt(s)+parseInt(req.body.stock)}},{sort: {_id:-1}},
        (err,result)=>{
            if(err)
                return res.send(err)
        console.log(req.body.id+'stock updated')
        res.redirect('/')
        })
    })         
})

app.post('/delete',(req,res)=>{
    db.collection('seasonal').findOneAndDelete({id:req.body.id},(err,result)=>{
        if(err)
            return console.log(err)
        res.redirect('/')    
    })
})