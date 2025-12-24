import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from './Nav'
import '../styles/Home.css'

// type championInfo = {
//   title: string,
//   image: {
//     full: string
//     sprite: string
//   },
//   tags: string[]
// }

const Home = () => {
    const [versions, setVersions] = useState([])
    const [champions, setChampions] = useState({})
    const [singleChampion, setSingleChampion] = useState({})

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

    const fetchChampionData = async (championName: string) => {
        const singleChampionsData = await fetch(`https://ddragon.leagueoflegends.com/cdn/${versions[0]}/data/en_US/champion/${championName}.json`)
        const singleChampionsResponse = await singleChampionsData.json()

        console.log('Click', championName, singleChampionsResponse)

        setSingleChampion(singleChampionsResponse.data[`${championName}`])
        console.log('STATE', singleChampion, singleChampionsResponse.data[`${championName}`])
    }

    return (
        <section className='home'>
            <Nav />
            <header>
                <h2>CHOOSE YOUR</h2>
                <h1>Champion</h1>
                <p className='desc'>With more than 170 champions, you'll find the perfect match for your play style. Master one, or<br/>master them all.</p>
            </header>
            <div className='champions'>
                {Object.entries(champions).map(([key]) => {
                    // const v = value as championInfo

                    // const singleChampionsData = await fetch(`https://ddragon.leagueoflegends.com/cdn/${versions[0]}/data/en_US/champion/${key}.json`)
                    // const singleChampionsResponse = await singleChampionsData.json()

                    // console.log('Images', singleChampionsResponse)

                    console.log('V', versions)
                    // console.log('STATE1', singleChampion)
                    return (
                        <Link to={`/champions/${key}`} onClick={() => fetchChampionData(key)} state={{ singleChampion, key, versions }} className='champion-card' key={key}>
                            <img src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${key}_${0}.jpg`} style={{objectFit: 'cover'}} />
                            <div className='champion-name'>
                                <h3>{key.toUpperCase()} </h3> 
                            </div>
                        </Link>
                    
                    )
                })}
            </div>    
        </section>
    )
}

export default Home