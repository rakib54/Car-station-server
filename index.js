const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const objectID = require('mongodb').ObjectID

app.use(cors())
app.use(bodyParser.json())

const port = process.env.PORT || 4000

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c4bol.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const Bookings = client.db("CarService").collection("bookings");
  const AllService = client.db("CarService").collection("AllService");
  const Testimonials = client.db("CarService").collection("Testimonial");
  const AllAdmin = client.db("CarService").collection("Admin");

  app.post('/bookings', (req, res) => {
    const BookingData = req.body
    Bookings.insertOne(BookingData)
      .then(result => {
        res.send(result.insertedCount > 0)
      })

  })

  app.post('/addService', (req, res) => {
    const ServiceData = req.body
    AllService.insertOne(ServiceData)
      .then(result => {
        res.send(result)
      })
  })


  app.post('/testimonial', (req, res) => {
    const AllTestimonial = req.body
    Testimonials.insertOne(AllTestimonial)
      .then(result => {
        res.send(result)
      })
  })

  app.post('/addAdmin', (req, res) => {
    const AddAdmin = req.body
    AllAdmin.insertOne(AddAdmin)
      .then(result => {
        res.send(result)
      })
  })

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email
    AllAdmin.find({ AdminEmail: email })
      .toArray((err, admin) => {
        res.send(admin.length > 0)

      })
  })

  app.get('/allTestimonial', (req, res) => {
    Testimonials.find({})
      .toArray((err, testimonial) => {
        res.send(testimonial)
      })
  })


  app.get('/allService', (req, res) => {
    AllService.find({})
      .toArray((err, ServiceData) => {
        res.send(ServiceData)
      })
  })

  app.get('/bookDetails', (req, res) => {
    Bookings.find({})
      .toArray((err, bookingDetails) => {
        res.send(bookingDetails)
      })
  })

  app.delete('/deleteService/:id', (req, res) => {
    const id = objectID(req.params.id)
    AllService.findOneAndDelete({ _id: id })
      .then(result => {
        res.send(!!result.value)
      })

  })
  

  app.get('/selectService/:id',(req,res)=>{
    const id = objectID(req.params.id)
    AllService.find({_id: id})
    .then(result =>{
      res.send(result.value)
    })
  })

});





app.listen(port)