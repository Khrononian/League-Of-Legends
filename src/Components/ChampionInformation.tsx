import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Nav from './Nav'

type SingleChampion = {
    title: string,
    name: string,
    blurb: string,
    tags: string[],
    info: {
        difficulty: number
    },
    passive: {
        name: string
        description: string,
        image: {
            full: string
        }
    },
    skins: [
        {num: number, name: string}
    ],
    spells: [{
        id: string,
        name: string,
        description: string
        image: {
            full: string
        }
    }]
}

type ChampionData = {
    name: string,
    id: string,
    description: string,
    image: {
        full: string
    }
}

const ChampionInformation = ({ versions }) => {
    const [defaultAbility, setDefaultAbility] = useState(true)
    const [loading, setLoading] = useState(true)
    const [ability, setAbility] = useState('')
    const [abilityId, setAbilityId] = useState(0)
    const [singleChampion, setSingleChampion] = useState<SingleChampion>({
        title: '',
        name: '',
        blurb: '',
        tags: [''],
        info: {
            difficulty: 0
        },
        passive: {
            name: '',
            description: '',
            image: {
            full: ''
        }
        },
        skins: [
            {num: 0, name: ''}
        ],
        spells: [{
            id: '',
            name: '',
            description: '',
            image: {
                full: ''
            }
        }]
    })
    const champName = useParams<{ champName: string }>()

    useEffect(() => {
        const getChampionData = async (championName: Readonly<Partial<{ champName: string, key: string }>>) => {
            console.log('INNER', championName)

            const singleChampionsData = await fetch(`https://ddragon.leagueoflegends.com/cdn/${versions[0]}/data/en_US/champion/${champName.key}.json`)
            const singleChampionsResponse = await singleChampionsData.json()

            console.log('Click', championName, singleChampionsResponse, singleChampionsResponse.data[`${championName.key}`])

            setSingleChampion(singleChampionsResponse.data[`${championName.key}`])
            setLoading(false)
            console.log('STATE', singleChampion, singleChampionsResponse.data[`${championName}`])
        }

        getChampionData(champName)
    }, [])

    const changeAbility = (event: React.MouseEvent) => {
        console.log('AATROX', event.currentTarget.id, event.currentTarget.key)
        // setAbility(event.target.id)
        
        if (event.currentTarget.id == 'passive') setAbility('passive')
        else setAbility('')
        
        setDefaultAbility(false)
        setAbilityId(Number(event.currentTarget.id))
    }
    
    // const singleChampion = (location.state )
    console.log('YEEE', singleChampion, champName, )


    return (
        <section>
            <Nav />
            {loading == true ? <p>Loading...</p> : <div>
                <img src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${singleChampion.name}_0.jpg`} alt='Champion Splash' />
                <div style={{backgroundImage: `url(https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${singleChampion.name}_0.jpg)`}}>
                    <h2>{singleChampion?.title.toUpperCase()}</h2>
                    <h1>{singleChampion.name.toUpperCase()}</h1>
                    <div>
                        {singleChampion.blurb}
                    </div>
                    
                    <div>
                        <h6>ROLE</h6>
                        {singleChampion.tags.map((items: string) => (
                            <div>
                                <p>{items.toUpperCase()}</p> 
                            </div>
                        ))}
                        <div>
                            <h6>DIFFICULTY</h6>
                            <p>{singleChampion.info.difficulty < 4 ? 'LOW' : singleChampion.info.difficulty == 4 || singleChampion.info.difficulty == 5 ? 'MEDIUM' : 'HIGH'}</p>
                        </div>
                        
                    </div>
                </div>

                <div>
                    <div>
                        <h4>ABILITIES</h4>
                        <div>
                            <div id='passive' onClick={changeAbility}>
                                <img src={`https://ddragon.leagueoflegends.com/cdn/${versions[0]}/img/passive/${singleChampion.passive.image.full}`} alt='Passive' />
                                <p>{singleChampion.passive.name.toUpperCase()}</p>
                            </div>
                            {singleChampion.spells.map((elements: ChampionData, index: number) => (
                                // <div id={elements.id.slice(-1)} key={index} onClick={changeAbility}>
                                <div id={index.toString()} key={index} onClick={changeAbility}>
                                    <img  src={`https://ddragon.leagueoflegends.com/cdn/${versions[0]}/img/spell/${elements.image.full}`} alt='Abilities' />
                                    <p>{elements.name.toUpperCase()}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3>{defaultAbility == true ? singleChampion.passive.name : ability == 'passive' ? singleChampion.passive.name : singleChampion.spells[abilityId].name }</h3>
                        <h4>{defaultAbility == true ? 'Passive' : ability == 'passive' ? 'Passive' : singleChampion.spells[abilityId].id.slice(-1)}</h4>
                        <p>{defaultAbility == true ? singleChampion.passive.description : ability == 'passive' ? singleChampion.passive.description.replace(/<\/?[^>]+(>|$)/g, " ") : singleChampion.spells[abilityId].description}</p>
                    </div>
                </div>

                <div>
                    <h4>AVAILABLE SKINS</h4>
                    <div>
                        <img src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${singleChampion.name}_0.jpg`} alt='Main skin' />
                        {singleChampion.skins.map((elements: {num: number, name: string}) => (
                            <div id={elements.name}>
                                <img src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${singleChampion.name}_${elements.num}.jpg`} alt={elements.name} />
                                <p>{elements.name == 'default' ? singleChampion.name : elements.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>}
    </section>
  )
}

export default ChampionInformation