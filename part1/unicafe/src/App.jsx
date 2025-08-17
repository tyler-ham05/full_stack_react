import { useState } from 'react'

const StatisticsLine = ({text, value}) => <tr><td>{text}</td><td>{value}</td></tr>
const Button = ({text, func}) => <button onClick={func}>{text}</button>

const Statistics = (props) => {
  if(props.good == 0 && props.neutral == 0 && props.bad == 0){

    return <div>
      <h1>Statistics</h1>
      No feedback given</div>
  }
  return(
  <div>
    <h1>Statistics</h1>
    <table>
      <tbody>
      <StatisticsLine text = "good" value = {props.good}/>
      <StatisticsLine text = "netural" value = {props.neutral}/>
      <StatisticsLine text = "bad" value = {props.bad}/>
      <StatisticsLine text = "all" value = {props.all}/>
      <StatisticsLine text = "average" value = {props.average}/>
      <StatisticsLine text = "positive" value = {props.positive}/>
      </tbody>
    </table>
  </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const addGood = () => setGood(good + 1)
  const addNeutral = () => setNeutral(neutral + 1)
  const addBad = () => setBad(bad + 1)

  const all = () => good + bad + neutral
  const average = () => {
        if(all() != 0){
      return (good - bad) / all()
    }
    return 0
  }
  const positive = () => {
    if (all() != 0){
     return`${good / all() * 100} %`
    }
    return '0 %'
  } 


  return (
    <div>
      <h1>give feedback</h1>
      <Button text ="good" func = {addGood}/>
      <Button text ="neutral" func = {addNeutral}/>
      <Button text ="bad" func = {addBad}/>
      <Statistics good = {good} neutral = {neutral} bad={bad}  average={average()} all = {all()} positive = {positive()}/>
    </div>
  )
}

export default App