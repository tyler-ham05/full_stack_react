//mongoDB setup
require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result =>{
    console.log('connected to MongoDB')
  })
  .catch(error =>{
    console.log('error connecting to MongoDB:', error.message)
  })

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phoneBookEntry = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type:String,
    validate: {
      validator: function(v){
        return /^\d+(?:-\d+)*$/.test(v)}
      
    }

  }
})

phoneBookEntry.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', phoneBookEntry)
//mongoDB setup
