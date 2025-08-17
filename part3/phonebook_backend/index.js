const express = require('express')
//const dayjs = require("dayjs")
const morgan = require("morgan")
const cors = require("cors")
const app = express()

const middleware = morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))
app.use(express.json())
app.use(cors())

console.log("hello world")



people = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
] 

app.get("/info", (request, response) => {
    response.send(`<div><p>Phonebook has info for ${people.length} people </p><p> </p></div>`)
})
//${dayjs().format("dddd, MMMM D, YYYY, h:mm A")} does not work with server deployment

app.get("/api/persons", (request, response) => {
    response.json(people)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const person = people.find(person => person.id === id)
    if (person){
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    people = people.filter(person => person.id !== id)
    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const id = Math.floor(Math.random() * 100000000)
    const person = request.body

    if(person.name && person.number && !people.find(entry => entry.name === person.name)){
        person.id = String(id)
        people = people.concat(person)
        response.json(person)
    }
    else{
        response.status(400).json({
            error: 'name must exist and be unique'
        })
    }
    
   
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


 