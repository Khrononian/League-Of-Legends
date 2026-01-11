import { useEffect, useState } from 'react'
import ChampionInformation from './Components/ChampionInformation'
import Items from './Components/Items'
import Home from './Components/Home'
import Accounts from './Components/Accounts'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  const [versions, setVersions] = useState<string[]>([])
  const [champions, setChampions] = useState({})

  useEffect(() => {
    const showChampionData = async () => {
      const versionData = await fetch('https://ddragon.leagueoflegends.com/api/versions.json')
      const versionResponse = await versionData.json();
      const championData = await fetch(`https://ddragon.leagueoflegends.com/cdn/${versionResponse[0]}/data/en_US/champion.json`)
      const championResponse = await championData.json()

      setVersions(prev => prev.concat(versionResponse))
      setChampions(championResponse.data)
      console.log('OK', versionResponse, championResponse)
      console.log('AATROX', versionResponse, championResponse)
    }

    showChampionData()
  }, [])

  // `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${singleChampion.name}_${0}.jpg` USE THIS FOR MAIN PAGE IMAGES

  return (
    <main>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/champions/:key' element={<ChampionInformation versions={versions} />} />
          <Route path='/items' element={<Items />} />
          <Route path='/accounts/' element={<Accounts versions={versions} />} />
        </Routes>
      </Router>  
    </main>
  )
}

export default App