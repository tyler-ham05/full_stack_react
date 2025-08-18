const mongoose = require('mongoose')
if (process.argv.length < 3) {
    console.log('give password as argument')
    proccess.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://tyler_ham:${password}@cluster0.ypenqgb.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phoneBookEntry = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', phoneBookEntry)

if(process.argv.length > 3){
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number,
    })
    person.save().then(result => {
    console.log(`added ${name} ${number} to phonebook!`)
    mongoose.connection.close()
})
}



else{

Person.find({}).then(result => {
    result.forEach(person => {
        console.log(person)
    })
    mongoose.connection.close()
})
}
