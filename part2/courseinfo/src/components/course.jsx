const Course = ({course}) =>{
  var sum = 0
  sum = course.parts.reduce(
  (accumulator, currentValue) => accumulator + currentValue.exercises,
  sum,
  );

  return (
  <div>
    <h1>{course.name}</h1>
    <ul>
      {(course.parts).map(part=>
      <li key={part.id}>{part.name} {part.exercises}</li>
      )}
    </ul>
    <p>total of {sum} exercises</p>
  </div>
  )
}

export default Course