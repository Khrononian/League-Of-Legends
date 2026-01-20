import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '../styles/ChampionInformation.css'

// import { Sword }
import Nav from './Nav'
import { HugeiconsIcon } from '@hugeicons/react'
import { Sword03Icon, BookOpen01Icon, KnightShieldIcon, ArcherIcon, Knife02Icon, LanternIcon } from '@hugeicons/core-free-icons'

type SingleChampion = {
    title: string,
    name: string,
    blurb: string,
    lore: string,
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

interface Props {
    versions: string[]
}

const ChampionInformation: React.FC<Props> = ({ versions }) => {
    const [defaultAbility, setDefaultAbility] = useState(true)
    const [loading, setLoading] = useState(true)
    const [ability, setAbility] = useState('')
    const [abilityId, setAbilityId] = useState(0)
    const [singleChampion, setSingleChampion] = useState<SingleChampion>({
        title: '',
        name: '',
        blurb: '',
        lore: '',
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
    const roleIcons = [
        {role: 'Fighter', icon: Sword03Icon}, {role: 'Mage', icon: BookOpen01Icon}, {role: 'Tank', icon: KnightShieldIcon},
        {role: 'Marksman', icon: ArcherIcon}, {role: 'Assassin', icon: Knife02Icon}, {role: 'Support', icon: LanternIcon}
    ]
    const champName = useParams<{ champName: string, key: string }>()

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
        if (event.currentTarget.id == 'passive') setAbility('passive')
        else setAbility('')
        
        setDefaultAbility(false)
        setAbilityId(Number(event.currentTarget.id))
    }
    
    // const singleChampion = (location.state )
    console.log('YEEE', singleChampion, champName, singleChampion.tags[0])


    return (
        <section>
            <Nav />
            {loading == true ? <p>Loading...</p> : <div className='champion-main'>
                <div className='champion-header'>
                    <img src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${singleChampion.name}_0.jpg`} alt='Champion Splash' />
                    <div className='champion-header-inner'>
                        <h2>{singleChampion?.title.toUpperCase()}</h2>
                        <h1>{singleChampion.name.toUpperCase()}</h1>
                        <div>
                            {singleChampion.lore}
                        </div>
                        
                        <div className='champion-stats'>
                            <div className='champion-stats-inner'>
                                <div className={`champion-stats-icons ${!singleChampion.tags[1] ? 'champion-stats-icons-center' : ''}`} >
                                    <HugeiconsIcon
                                        icon={roleIcons.find((roles) => roles.role == singleChampion.tags[0])?.icon ?? roleIcons[0].icon}
                                        size={34}
                                        color="#c8aa6e"
                                        strokeWidth={2}
                                    />
                                    
                                    {singleChampion.tags[1] ?
                                        <HugeiconsIcon
                                            icon={roleIcons.find((roles) => roles.role == singleChampion.tags[1])?.icon ?? roleIcons[1].icon}
                                            size={34}
                                            color="#c8aa6e"
                                            strokeWidth={2}
                                        />
                                        : null
                                    }
                                </div>
                                <h5>ROLE</h5>
                                {singleChampion.tags.map((items: string) => (
                                    <div>
                                        <p>{items.toUpperCase()}</p> 
                                    </div>
                                ))}
                            </div>
                            
                            <div className='champion-stats-inner'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="36" color="currentColor" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path className='active' d="M11.1075 5.57624C11.3692 6.02707 11.5 6.25248 11.5 6.5C11.5 6.74752 11.3692 6.97293 11.1075 7.42376L9.85804 9.57624C9.59636 10.0271 9.46551 10.2525 9.25 10.3762C9.03449 10.5 8.7728 10.5 8.24943 10.5H5.75057C5.2272 10.5 4.96551 10.5 4.75 10.3762C4.53449 10.2525 4.40364 10.0271 4.14196 9.57624L2.89253 7.42376C2.63084 6.97293 2.5 6.74752 2.5 6.5C2.5 6.25248 2.63084 6.02707 2.89253 5.57624L4.14196 3.42376C4.40364 2.97293 4.53449 2.74752 4.75 2.62376C4.96551 2.5 5.2272 2.5 5.75057 2.5L8.24943 2.5C8.7728 2.5 9.03449 2.5 9.25 2.62376C9.46551 2.74752 9.59636 2.97293 9.85804 3.42376L11.1075 5.57624Z" />
                                    <path className={singleChampion.info.difficulty == 4 || singleChampion.info.difficulty == 5 ? 'active' : singleChampion.info.difficulty > 5 ? 'active' : ''} d="M21.1075 11.5762C21.3692 12.0271 21.5 12.2525 21.5 12.5C21.5 12.7475 21.3692 12.9729 21.1075 13.4238L19.858 15.5762C19.5964 16.0271 19.4655 16.2525 19.25 16.3762C19.0345 16.5 18.7728 16.5 18.2494 16.5H15.7506C15.2272 16.5 14.9655 16.5 14.75 16.3762C14.5345 16.2525 14.4036 16.0271 14.142 15.5762L12.8925 13.4238C12.6308 12.9729 12.5 12.7475 12.5 12.5C12.5 12.2525 12.6308 12.0271 12.8925 11.5762L14.142 9.42376C14.4036 8.97293 14.5345 8.74752 14.75 8.62376C14.9655 8.5 15.2272 8.5 15.7506 8.5L18.2494 8.5C18.7728 8.5 19.0345 8.5 19.25 8.62376C19.4655 8.74752 19.5964 8.97293 19.858 9.42376L21.1075 11.5762Z" />
                                    <path className={singleChampion.info.difficulty > 5 ? 'active' : ''} d="M11.1075 16.5762C11.3692 17.0271 11.5 17.2525 11.5 17.5C11.5 17.7475 11.3692 17.9729 11.1075 18.4238L9.85804 20.5762C9.59636 21.0271 9.46551 21.2525 9.25 21.3762C9.03449 21.5 8.7728 21.5 8.24943 21.5H5.75057C5.2272 21.5 4.96551 21.5 4.75 21.3762C4.53449 21.2525 4.40364 21.0271 4.14196 20.5762L2.89253 18.4238C2.63084 17.9729 2.5 17.7475 2.5 17.5C2.5 17.2525 2.63084 17.0271 2.89253 16.5762L4.14196 14.4238C4.40364 13.9729 4.53449 13.7475 4.75 13.6238C4.96551 13.5 5.2272 13.5 5.75057 13.5L8.24943 13.5C8.7728 13.5 9.03449 13.5 9.25 13.6238C9.46551 13.7475 9.59636 13.9729 9.85804 14.4238L11.1075 16.5762Z" />
                                </svg>
                                <h5>DIFFICULTY</h5>
                                <p>{singleChampion.info.difficulty < 4 ? 'LOW' : singleChampion.info.difficulty == 4 || singleChampion.info.difficulty == 5 ? 'MEDIUM' : 'HIGH'}</p>
                            </div>
                            
                            
                        </div>
                        <div className='champion-mastery'>
                            <p>CHAMPION MASTERY</p>
                            <a href={`https://op.gg/lol/champions/${singleChampion.name.toLowerCase()}/build`} target='_blank'>OP.GG</a>
                            <a href={`https://u.gg/lol/champions/${singleChampion.name.toLowerCase()}/build`} target='_blank'>U.GG</a>
                            <a href={`https://probuildstats.com/champion/${singleChampion.name.toLowerCase()}`} target='_blank'>PROBUILD STATS</a>
                        </div>
                    </div>
                </div>    

                <div className='champion-ability'>
                    <div>
                        <h2>ABILITIES</h2>
                        <div className='champion-abilities'>
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

                    <div className='champion-ability-info'>
                        <h3>{defaultAbility == true ? singleChampion.passive.name : ability == 'passive' ? singleChampion.passive.name : singleChampion.spells[abilityId].name }</h3>
                        <h4>{defaultAbility == true ? 'Passive' : ability == 'passive' ? 'Passive' : singleChampion.spells[abilityId].id.slice(-1)}</h4>
                        <p>{defaultAbility == true ? singleChampion.passive.description : ability == 'passive' ? singleChampion.passive.description.replace(/<\/?[^>]+(>|$)/g, " ") : singleChampion.spells[abilityId].description}</p>
                    </div>
                </div>

                <div className='champion-skins'>
                    <h2>AVAILABLE SKINS</h2>
                    <div className='champion-skin'>
                        <img src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${singleChampion.name}_0.jpg`} alt='Main skin' />
                        <div className='champion-splashes'>
                            {singleChampion.skins.map((elements: {num: number, name: string}) => (
                                <div id={elements.name}>
                                    <img src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${singleChampion.name}_${elements.num}.jpg`} alt={elements.name} />
                                    <p>{elements.name == 'default' ? singleChampion.name : elements.name}</p>
                                </div>
                                
                            ))}
                        </div>
                        
                    </div>
                </div>
            </div>}
    </section>
  )
}

export default ChampionInformation