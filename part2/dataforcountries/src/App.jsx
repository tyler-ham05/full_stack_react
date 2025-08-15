import { useEffect, useState } from "react"
import axios from 'axios'

const api_key = import.meta.env.VITE_API_KEY

const Display = ({ countries, search, setSearch, getWeather }) => {
  const [weather, setWeather] = useState(null);

  const filtered = countries.filter(element =>
    element.name.common.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (filtered.length === 1) {
      const country = filtered[0];
      const capital = country.capital?.[0];
      if (capital) {
        getWeather(country)
          .then(res => setWeather(res.data))
          .catch(err => setWeather({ error: err.message }));
      }
    }
  }, [filtered, getWeather]);
  
  if (!search) return <p>search for a country</p>;

  if (filtered.length > 10) return <p>too many countries</p>;

  if (filtered.length === 1) {
    const country = filtered[0];
    const languages = Object.values(country.languages || {});

    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>capital: {country.capital?.[0]}</p>
        <p>area: {country.area}</p>
        <p>languages:</p>
        <ul>{languages.map((language, i) => <li key={i}>{language}</li>)}</ul>
        <img src={country.flags.png} alt="country flag" />
        <h2>Weather in {country.capital?.[0]}</h2>
        {weather ? (
          weather.error ? (
            <p>Error: {weather.error}</p>
          ) : (
            <div>
              <p>Temperature: {weather.current.temp_c}°C</p>
              <p>Condition: {weather.current.condition.text}</p>
              <img src={weather.current.condition.icon} alt="weather icon" />
            </div>
          )
        ) : (
          <p>Loading weather...</p>
        )}
      </div>
    );
  }

  return filtered.map((country, i) => (
    <p key={i}>
      {country.name.common}{" "}
      <button onClick={() => setSearch(country.name.common)}>Show</button>
    </p>
  ));
};

function App() {

  const [search, setSearch] = useState('')
  const [all, setAll] = useState([])

  const handleSearch = (event) => {
    event.preventDefault()
    return setSearch(event.target.value)
  }

 const getWeather = (country) => {
  return axios.get('http://api.weatherapi.com/v1/current.json', {
    params: {
      key: api_key,
      q: country.capital[0]
    }
  });
};

  useEffect(() => {
    console.log('effect')
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        console.log('promise fufilled')
        setAll(response.data)
      })
  }, [])
  console.log('render', all.length, 'countries')


  return (
   <div>
    <p>find countries <input onChange={handleSearch}></input></p>
    <Display countries = {all} search = {search} setSearch = {setSearch} getWeather = {getWeather}/>
   </div>
  )
}

export default App
