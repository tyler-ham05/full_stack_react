const Display = ({persons, sortParameter, removePersons}) => {
  return(
    <div>
      {persons.map(person => {if(person.name.toLowerCase().includes(sortParameter.toLowerCase())){return(
        <p key = {person.name}>
          {person.name} {person.number} <button type = "submit" id = {person.id} onClick={() => removePersons(person.id)}>delete</button> 
          </p>
        )}} )}
    </div>
  )
}

export default Display