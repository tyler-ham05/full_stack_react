const express = require('express')
//const dayjs = require("dayjs")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
const Person = require('./modules/person')

require('dotenv').config()


morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name == 'ValidationError'){
    return response.status(400).json({error: error.message})
  } 

  next(error)
}


app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))
app.use(express.static('dist'))
app.use(cors())

console.log("hello world")


app.get("/info", (request, response, next) => {
  Person.find({})
    .then(people => {
      response.send(`<div><p>Phonebook has info for ${people.length} people </p><p> </p></div>`)
    })
    .catch(error => next(error))
})
//${dayjs().format("dddd, MMMM D, YYYY, h:mm A")} does not work with server deployment

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then(people => {
      response.json(people)
    })
    .catch(error => next(error))
})

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }
      response.json(person)
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => { response.status(204).end() })
    .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
  const body = request.body
  if (!body.name) {
    return response.status(400).json({ error: 'name missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(newPerson => {
      response.json(newPerson)
    })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})


app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


 