import { useEffect, useState } from 'react'
import ChampionInformation from './Components/ChampionInformation'
import './App.css'


type championInfo = {
  title: string,
  image: {
    full: string
    sprite: string
  },
  tags: string[]
}

function App() {
  // const [puuid, setPuuid] = useState([])
  // const [account, setAccount] = useState([])
  const [versions, setVersions] = useState([])
  const [champions, setChampions] = useState({})
  const [singleChampion, setSingleChampion] = useState({})

  useEffect(() => {
    // const api_url = 'https://na1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=RGAPI-90c16d7f-b0f5-40c7-acdd-14dbdebe282c'
    // const champion_versions = 'https://ddragon.leagueoflegends.com/api/versions.json'
    // const champion_data = 'https://ddragon.leagueoflegends.com/cdn/14.22.1/data/en_US/champion.json'
    

    // fetch(champion_versions)
    //   .then((data) => data.json())
    //   .then(response => setVersions(prev => prev.concat(response)))
    // console.log('DONE', versions)

    // fetch(champion_data)
    //   .then(data => data.json())
    //   .then(response => console.log('Champions', response.data, champions))
      // .then(response => setChampions(response.data))
      

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

  const fetchChampionData = async (championName: string) => {
    const singleChampionsData = await fetch(`https://ddragon.leagueoflegends.com/cdn/${versions[0]}/data/en_US/champion/${championName}.json`)
    const singleChampionsResponse = await singleChampionsData.json()

    console.log('Click', championName, singleChampionsResponse)

    setSingleChampion(singleChampionsResponse.data[`${championName}`])
    console.log('STATE', singleChampion, singleChampionsResponse.data[`${championName}`])
  }
  // `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${singleChampion.name}_${0}.jpg` USE THIS FOR MAIN PAGE IMAGES

  return (
    <main>
      <h2>CHOOSE YOUR</h2>
      <h1>Champion</h1>
      <p>With more than 170 champions, you'll find the perfect match for your play style. Master one, or<br/>master them all.</p>

      {Object.entries(champions).map(([key, value]) => {
        const v = value as championInfo
        // const singleChampionsData = await fetch(`https://ddragon.leagueoflegends.com/cdn/${versions[0]}/data/en_US/champion/${key}.json`)
        // const singleChampionsResponse = await singleChampionsData.json()

        // console.log('Images', singleChampionsResponse)

        console.log('V', versions)
        console.log('Champ Data', v)
        return (
          <a key={key} onClick={() => fetchChampionData(key)}>
            {/* <img src={singleChampionsResponse.data[key].image.full} /> */}
            {/* <img src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${key}_0.jpg`} style={{objectFit: 'cover', width: '300px', height: '420px'}}/> */}
            <img src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${key}_${0}.jpg`} style={{objectFit: 'cover'}} />
            <h3>{key.toUpperCase()} </h3> 
          </a>
      )
      })}
      
      <ChampionInformation singleChampion={singleChampion} versions={versions} />
    </main>
  )
}

export default App