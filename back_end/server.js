var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Tea_platform');
var express = require('express');
var app = express();
var item = require('./model/Item');
var purchase = require('./model/Purchase');
var customer = require('./model/Customer');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({
  extended: false
});

app.all('*', function(req, res, next) { //TO fix the CORS bug
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.static('../front_end'));

app.get('/', function(request, response) {
  response.send("Hello World!");
});

app.get('/items', function(request, response) {
  item.find(function(err, result) {
    response.send(result);
    console.log(result);
  })
});

app.post('/items', parseUrlencoded, function(request, response) {
  var json = {
    Iname: request.body.Iname,
    Price: request.body.Price,
    State: request.body.State
  }
  // console.log(request.body);

  json.Timestamp = +new Date();
  newjson = new item(json);
  newjson.save(function(err) {
    if (!err) {
      response.send("Success!");
    } else {
      console.log(err);
    }
  });
});

app.put('/items/update', parseUrlencoded, function(request, response) {
  // var json = {
  //   Iname: request.body.Iname,
  //   Price: request.body.Price,
  //   State: request.body.State
  // }
  // console.log(request.body);


  item.update({
    Iname: request.body.Iname,
    State: "上架"
  }, {
    $set: {
      State: "下架"
    }
  }, function(err, result) {
    if (err)
      console.log(err);
    console.log(result);

    var json = {
      Iname: request.body.Iname,
      Price: request.body.Price,
      State: "上架"
    }
    // console.log(request.body);

    json.Timestamp = +new Date();
    newjson = new item(json);
    newjson.save(function(err) {
      if (!err) {
        response.send("Success!");
      } else {
        console.log(err);
      }
    });


    //
  });


  // item.find({
  //   Iname: request.body.Iname,
  //   State: "上架"
  // }, function(err, result) {
  //
  //
  //
  //
  //   result.State = "下架";
  //   response.send(result);
  //   console.log(result);
  // })


  // json.Timestamp = +new Date();
  // newjson = new item(json);
  // newjson.save(function(err) {
  //   if (!err) {
  //     response.send("Success!");
  //   } else {
  //     console.log(err);
  //   }
  // });
})

app.delete('/items/delete', parseUrlencoded, function(request, response) {
  item.remove({Iname: request.body.Iname})
    .then(note => {
      if (!note) {
        return response.status(404).send({
          message: "Note not found with Iname " + request.body.Iname
        });
      }
      response.send({
        message: "Note deleted successfully!"
      });
    }).catch(err => {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return response.status(404).send({
          message: "Note not found with id " + request.body.Iname
        });
      }
      return response.status(500).send({
        message: "Could not delete note with Iname " + request.body.Iname
      });
    });
});




app.get('/purchases', function(request, response) {
  purchase.find(function(err, result) {
    response.send(result);
    console.log(result);
  })
});

app.post('/purchases', parseUrlencoded, function(request, response) {
  var json = {
    Cname: request.body.Cname,
    Tot_price: request.body.Tot_price,
    Ori_price: request.body.Ori_price,
    Discount: request.body.Discount,
    Buy: {
      Iname: JSON.parse(request.body.Buy).Iname,
      Inum: JSON.parse(request.body.Buy).Inum
    }
  }
  console.log(request.body);

  json.Timestamp = +new Date();
  newjson = new purchase(json);
  newjson.save(function(err) {
    if (!err) {
      response.send("Success!");
    } else {
      console.log(err);
    }
  });
})

app.get('/customers', function(request, response) {
  customer.find(function(err, result) {
    response.send(result);
    console.log(result);
  })
});

app.post('/customers', parseUrlencoded, function(request, response) {
  var json = {
    Cname: request.body.Cname,
    Phone: request.body.Phone
  }
  console.log(request.body);

  json.Timestamp = +new Date();
  newjson = new customer(json);

  customer.find({
    Phone: request.body.Phone
  }, function(err, result) {
    // response.send(result);
    if (!result) {
      newjson.save(function(err) {
        if (!err) {
          response.send("Success!");
        } else {
          console.log(err);
        }
      });
    } else {
      customer.find({
        Phone: request.body.Phone
      }).remove().exec();
      // console.log(123);
      newjson.Cname = request.body.Cname;
      newjson.save(function(err) {
        if (!err) {
          response.send("Success!");
        } else {
          console.log(err);
        }
      });
    }
  })
})


// app.get('/packets/:src', function(request, response) {
//   Packet.find({
//     src: request.params.src
//   }, function(err, result) {
//     response.send(result);
//   })
// });
//
// app.get('/rssi', function(request, response) {
//   var myQuery = {};
//   if (request.query.src) {
//     myQuery.src = request.query.src;
//   }
//   if (request.query.dest) {
//     myQuery.dest = request.query.dest;
//   }
//
//   Packet.find(myQuery, function(err, result) {
//     var rssiList = result.map(function(packet) {
//       // return packet.rssi;
//       return [packet.rssi, new Date(packet.timestamp)];
//     });
//     response.send(rssiList);
//   })
// });
//
// app.get('/cmd', function(request, response) {
//   Command.find({}, function(err, result) {
//     response.send(result);
//   })
// });
//
// app.post('/cmd/:device', parseUrlencoded, function(request, response) {
//   var jsonCMD = {
//     dest: request.params.device,
//     type: 2,
//     cmd: request.body.command
//   }
//   console.log(request.body);
//
//   jsonCMD.timestamp = +new Date();
//   newCMD = new Command(jsonCMD);
//   newCMD.save(function(err) {
//     if (!err) {
//       response.send("Success!");
//     } else {
//       console.log(err);
//     }
//   });
// })


app.listen(3000, function(request, response) {
  console.log('Listening on port 3000!');
});
