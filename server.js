var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express()
app.use(bodyParser.json());
app.use(express.static('views'));

mongoose.connect('mongodb://localhost/myapp');

var Flavor = mongoose.model('Flavor', {
    flavor : String,
    description: String,
    quantity: Number,
    price: Number
});

var Order = mongoose.model('Order', {
    flavor: String,
    cups: Number,
    price: Number,
    visitorID: Number

});

var Visitor = mongoose.model('Visitor', {
    visitorID : String,
    budget: Number
});


app.get("/api/orders", function(req,res)
{
  Order.find({"visitorID" : req.query.visitorID}, function(err,orders)
  {
    if(err)
      throw err;
    res.json(orders);
  })
})
app.get("/api/allOrders", function(req,res)
{
  Order.find({}, function(err,orders)
  {
    if(err)
      throw err;
    res.json(orders);
  })
});

app.post('/api/updateBudget', function(req,res)
{
  Visitor.find({visitorID: req.body.visitorID}, function(err,visitor)
  {
    var budgetLeft = visitor[0].budget - req.body.purchase;
    visitor[0].budget -= req.body.purchase;
    visitor[0].save(function(error)
    {
      if(error)
        throw error;
      res.json({"budget": budgetLeft});
    })
  });
});
app.post('/updateOrders', function(req,res)
{
  Order.create({
           visitorID : req.body.visitorID,
           cups: req.body.cups,
           flavor: req.body.flavor,
           price: req.body.price

       }, function(err, order) {
         res.json(order);
  });
});
app.post('/updateFlavor', function(req,res)
{
  Flavor.find({flavor: req.body.flavor}, function(err,flavor)
  {
    flavor[0].quantity -= req.body.bought;

    flavor[0].save(function(error) {
      if (error) {
        throw error;
      }
      Flavor.find({}, function(err, flavors)
      {
        res.json(flavors);
      })
    });
  });
})
app.get('/currentUser', function(req,res)
{
  Visitor.find({visitorID: req.query.visitorID}, function(err, visitors)
  {
    if(err)
      throw err;
    if(visitors.length == 0)
    {
      Visitor.create({
               visitorID : req.query.visitorID,
               budget: 100
           }, function(err, post) {
               console.log(err);
      });
    }
    res.json(visitors);
  });
});

app.post('/api/removeOrder', function(req,res)
{
  Order.findById(req.body.orderID, function(err,order)
  {
    var price = order.price
    var cups = order.cups
    var flavor = order.flavor
    if(err)
      throw err;
    Order.remove({_id: req.body.orderID}, function(err,order)
    {
      console.log(err);
      res.json({'amount': price, 'cups': cups, 'flavor': flavor});
    })

  })
})

app.post('/api/refundMoney', function(req,res)
{
  Visitor.find({visitorID: req.body.visitorID}, function(err,visitor)
  {
    var budgetLeft = visitor[0].budget + req.body.purchase;
    visitor[0].budget += req.body.purchase;
    visitor[0].save(function(error)
    {
      if(error)
        throw error;
      res.json({"updatedAmount": budgetLeft});
    })
  });
})



app.post('/addNewPost', function(req,res)
{
  Flavor.create({
           flavor : req.body.flavor,
           description: req.body.description,
           quantity: req.body.quantity,
           price: req.body.price
       }, function(err, post) {
           if (err)
               res.send(err);
           res.json(post);
    });
});
app.get('/allFlavours', function(req,res)
{
  Flavor.find(function(err,flavors)
  {
    if(err)
      res.send(error);
    res.json(flavors)
  });
});

app.post('/api/updateQuantity', function(req,res)
{
  Flavor.find(function(err,flavors)
  {
    console.log(req.body.flavor);
    Flavor.find({'flavor': req.body.flavor}, function(err, flavor)
    {
      flavor[0].quantity += req.body.quantity;
      flavor[0].save(function(error)
      {
        if(error)
          throw error;
      })
    })
  })
});
app.listen(3000, function () {
  console.log('Server listening on', 3000)
})
