import { useEffect, useState } from 'react'
import Sort from './components/sort.jsx'
import PersonForm from './components/personform.jsx'
import Display from './components/display.jsx'
import axios from 'axios'


const Notification = ({ message, flag }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={flag}>
      {message}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [sortParameter, setNewParameter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [flag, setFlag] = useState('error')

  const handleNameChange = (event) => {
    //console.log(event.target.value)
    return setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    //console.log(event.target.value)
    return setNewNumber(event.target.value)
  }
  const handleParameterChange = (event) => {
    console.log(event.target.value)
    return setNewParameter(event.target.value)
  }
  const removePersons = (id) => {
    const person = persons.find(p => p.id === id)
    console.log('removing ' + id)
    if (window.confirm(`are you sure you want to delete ${person.name}`)) {
      axios.delete(`http://localhost:3001/persons/${id}`).then(response => {
        console.log("deletion sucessful")
        setPersons(persons.filter(p => p !== person))
        setErrorMessage(`successfully deleted ${person.name}`)
        setFlag('success')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
        .catch(error => {
          setFlag('error')
          setErrorMessage(`${person.name} was already removed from the server`)
          setTimeout(() => setErrorMessage(null), 5000)
        }), []
    }

  }
  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const personObject = {
      name: newName,
      number: newNumber,
    }
    if (persons.find(item => item['name'] === newName)) {
      const person = persons.find(item => item['name'] === newName)
      const url = `http://localhost:3001/persons/${person.id}`
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        axios.put(url, personObject).then(response => {
          console.log("user updated")
          setPersons(persons.map(p => p.id !== person.id ? p : response.data))
        })
      }
    }
    else {
      axios
        .post('http://localhost:3001/persons', personObject)
        .then(response => {
          console.log(response)
          setPersons(persons.concat(response.data))
          setNewName('')
          setErrorMessage(`successfully added ${response.data.name}`)
          setFlag('success')
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fufilled')
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'people')




  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} flag={flag} />
      <Sort value={sortParameter} onChange={handleParameterChange} />
      <h2>Add Person</h2>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Display persons={persons} sortParameter={sortParameter} removePersons={removePersons} />
    </div>
  )
}

export default App