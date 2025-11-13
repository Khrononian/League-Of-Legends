import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    const api_url = 'https://na1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=RGAPI-90c16d7f-b0f5-40c7-acdd-14dbdebe282c'

    fetch(api_url)
      .then((response) => response.json())
      .then(data => console.log('Data', data))
  }, [])

  return (
    <main>
      <h1>League of Legends</h1>

      
    </main>
  )
}

export default App
