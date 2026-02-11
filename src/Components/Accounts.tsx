import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { getAccount, getAccountProfile } from '../../functions/src/apis/riot'
import '../styles/Accounts.css'
import Nav from './Nav'
import Loading from './Loading'
import iron from '../rankicons/7574-iron.png'
import bronze from '../rankicons/1184-bronze.png'
import silver from '../rankicons/7455-silver.png'
import gold from '../rankicons/1053-gold.png'
import platinum from '../rankicons/3978-platinum.png'
import diamond from '../rankicons/1053-diamond.png'
import master from '../rankicons/9231-master.png'
import grandmaster from '../rankicons/9476-grandmaster.png'
import challenger from '../rankicons/9476-challenger.png'

const StateContext = createContext<ContextType>({
    setLoading: () => true,
    setAccount: () => {},
    setSummonerProfile: () => {},
    setRankedStats: () => {},
    setFullMatchData: () => [[{}]],
    setRunes: () => [],
    loadSummonerSpells: async () => {}
})

type ItemKey = `item${0 | 1 | 2 | 3 | 4 | 5 | 6}`

type SummonerProfile = {
    puuid: string,
    summonerLevel: number,
    profileIconId: number,
}
type Account = {
    gameName: string
    puuid: string
}

type RankedData = {
    tier: string,
    rank: string,
    leaguePoints: number,
    wins: number,
    losses: number,
    puuid: string,
    queueType: string
}

type Runes = {
    slots: [
        {
            runes: [
                {
                    id: number,
                    icon: string,
                }
                
            ]
        },
    ]
}

type MatchHistory = {
    info: {
        endOfGameResult: string
        gameStartTimestamp: number,
        gameEndTimestamp: number,
        gameMode: string,
        championName: string,
        gameId: number
        participants: [
            {
                puuid: string, 
                teamId: number,
                win: boolean,
                riotIdGameName: string,
                riotIdTagline: string,
                summoner1Id: number,
                summoner2Id: number,
                championName: string,
                champLevel: number,
                kills: number,
                deaths: number,
                assists: number,
                detectorWardsPlaced: number,
                wardsPlaced: number,
                wardsKilled:number,
                neutralMinionsKilled: number,
                totalMinionsKilled: number,
                goldEarned: number,
                timePlayed: number,
                item: string | number[],
                item0: number,
                item1: number,
                item2: number,
                item3: number,
                item4: number,
                item5: number,
                item6: number,
                challenges: {
                    kda: number,
                    killParticipation: number
                },
                perks: {
                    styles: [
                        {selections: [
                            {perk: number}
                        ],
                        style: number
                    },
                    {selections: [
                            {perk: number}
                        ],
                        style: number
                    },
                    ]
                }
            }
        ]
        teams: [
            teamId: number,
            win: boolean,
        ]
    }
}

type Spells = {
    id: string,
    key: string
}

interface Props {
    versions: string[]
}

interface ContextType {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setAccount: React.Dispatch<React.SetStateAction<Account>>,
    setSummonerProfile: React.Dispatch<React.SetStateAction<SummonerProfile>>,
    setRankedStats: React.Dispatch<React.SetStateAction<object>>,
    setFullMatchData: React.Dispatch<React.SetStateAction<object[][]>>,
    setRunes: React.Dispatch<React.SetStateAction<Runes[]>>,
    loadSummonerSpells: (matchResponse: MatchHistory[][], leagueAccount: SummonerProfile) => Promise<void>
}

const Accounts: React.FC<Props> = ({ versions }) => {
    const [account, setAccount] = useState<Account>({
        gameName: '',
        puuid: ''
    })
    const [summonerProfile, setSummonerProfile] = useState<SummonerProfile>({
        puuid: '',
        summonerLevel: 0,
        profileIconId: 0,
    })
    const [rankedStats, setRankedStats] = useState({})
    const [fullMatchData, setFullMatchData] = useState([[{}]])
    const [summonerSpells, setSummonerSpells] = useState({})
    const [gameIds, setGameIds] = useState<number[]>([])
    const [runes, setRunes] = useState<Runes[]>([])
    const [spellIds, setSpellIds] = useState<number[][]>([[0, 0]]) // USE THIS TO PUSH THE SUMMONER SPELL IDS HERE
    const [loading, setLoading] = useState(true)
    const didFetch = useRef(false)

    const fetchAccountData = async () => {
        const mainAccount = await getAccount('selbull')
        const leagueAccountData = await getAccountProfile(mainAccount.puuid)

        setAccount(leagueAccountData.accountIdDataResponse)
        setSummonerProfile(leagueAccountData.profileResponse)
        setRankedStats(leagueAccountData.rankedResponse)
        setFullMatchData(leagueAccountData.fetchedResults)
        setRunes(leagueAccountData.runesResponse)
        
        loadSummonerSpells(leagueAccountData.fetchedResults, leagueAccountData.accountIdDataResponse)
        setLoading(false)
    }

    useEffect(() => {
        if (didFetch.current) return
        didFetch.current = true

        fetchAccountData()
    }, [])

    const loadSummonerSpells = async (matchResponse: MatchHistory[][], leagueAccount: SummonerProfile) => {
        const spell: number[][] = []
        const versionData = await fetch('https://ddragon.leagueoflegends.com/api/versions.json')
        const versionResponse = await versionData.json();

        const spellData = await fetch(`https://ddragon.leagueoflegends.com/cdn/${versionResponse[0]}/data/en_US/summoner.json`)
        const spellResponse = await spellData.json()
        const info = Object.entries(spellResponse.data)
        
        info.map((inner) => inner[1])
        setSummonerSpells(Object.values(spellResponse.data))
        setGameIds([])

        matchResponse.map((res) => res.map((element: MatchHistory) => {
            const data = element as MatchHistory
            const id = data.info.participants.find((id) => id.puuid == leagueAccount.puuid)
            const gameId = data.info.gameId

            if (id) spell.push([id?.summoner1Id, id?.summoner2Id])

            setGameIds(prev => prev.concat(gameId))
        }))
        
        setSpellIds(spell)
    }

    return (
        <section className='account-section'>
            <Nav />
            {loading === true ? <Loading /> : <div className='account'>
                <div className='account-search'>
                    <StateContext.Provider value={{ setLoading, setAccount, setSummonerProfile, setRankedStats, setFullMatchData, setRunes, loadSummonerSpells }}>
                        <CountDown  />
                    </StateContext.Provider>
                </div> 

                <div className='account-main'>
                    <div className='account-stats'>
                        <div className='account-profile'>
                            <img className='account-ranks-pfp' src={`https://ddragon.leagueoflegends.com/cdn/${versions[0]}/img/profileicon/${summonerProfile.profileIconId}.png`} alt='Summoner Profile' />
                            <span>{summonerProfile.summonerLevel}</span>
                            <div>
                                <p>{account.gameName}#NA1</p>
                            </div>
                        </div>

                        <div className='account-ranks'>
                            {
                                Object.entries(rankedStats).map(([index, values]) => {
                                    const data = values as RankedData
                                    const wins = data.wins;
                                    const losses = data.losses
                                    const winRate = (wins / (wins + losses)) * 100
                                    const rankedIcons = [
                                        {tier: 'iron', icon: iron}, {tier: 'bronze', icon: bronze}, {tier: 'silver', icon: silver},
                                        {tier: 'gold', icon: gold}, {tier: 'platinum', icon: platinum}, {tier: 'diamond', icon: diamond},
                                        {tier: 'master', icon: master}, {tier: 'grandmaster', icon: grandmaster}, {tier: 'challenger', icon: challenger}
                                    ]
                                    return (
                                        <div key={index} >
                                            <div className='account-ranks-stats'>
                                                <div>
                                                    {!data.tier ? 'Unranked' : <img className='account-ranks-imgs' src={`${rankedIcons.find(icon => icon.tier == data.tier.toLowerCase())?.icon}` } alt={`${data.tier} Rank icon`} />}
                                                    {!data.queueType ? 'Unranked' : <p>{data.queueType.includes('SOLO') ? 'Solo/Duo' : 'Flex 5v5'}</p>}
                                                </div>

                                                {!data.tier ? 'Unranked' : <div >
                                                    <p>{data.tier} {data.rank}</p>
                                                    <div className='account-ranks-stats'>
                                                        <p>{data.leaguePoints} LP</p>
                                                        <p>{winRate.toFixed(2)} % Win Rate</p>
                                                    </div>
                                                    <div className='account-ranks-stats'>
                                                        <p>{data.wins} Wins</p>
                                                        /
                                                        <p>{data.losses} Losses</p>
                                                    </div>
                                                </div>}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className='account-matches'>
                        {
                            fullMatchData.map(response => response.map(element => {
                                console.log('FIRST', element)
                                const data = element as MatchHistory; 
                                const start = data.info.gameStartTimestamp
                                const end = data.info.gameEndTimestamp
                                const duration = end - start
                                const diff = Date.now() - start
                                const id = data.info.participants.find((id) => id.puuid == summonerProfile.puuid)
                                
                                return (
                                    <div className='account-match-main account-match'>
                                        <div className={`account-match-stats ${id?.win == true && id?.timePlayed > 180 ? 'account-match-leftside-v' : id?.win == false && id?.timePlayed > 180 ? 'account-match-leftside-d' : 'account-match-leftside-r'}`}>
                                            <p>{isNaN(Math.floor(duration / 60000)) != true ? `${Math.floor(duration / 60000)} min` : null}</p>
                                            <p>{data.info.gameMode}</p>
                                            <p>{id?.win == true && id?.timePlayed > 180 ? <span className='account-match-stats-v'>VICTORY</span> : id?.win == false && id?.timePlayed > 180 ? <span className='account-match-stats-d'>DEFEAT</span> : <span className='account-match-stats-r'>REMAKE</span>}</p>
                                            <p>{Math.floor(diff / (1000 * 60 * 60 * 24)) == 0 ? `${Math.floor(diff / (1000 * 60 * 60))} hour(s) ago` : `${Math.floor(diff / (1000 * 60 * 60 * 24))} day(s) ago` } </p>
                                            
                                        </div>
                                        <div className={`account-match account-match-split ${id?.win == true && id?.timePlayed > 180 ? 'account-match-victory' : id?.win == false && id?.timePlayed > 180 ? 'account-match-defeat' : 'account-match-remake'}`}>
                                            <div className='account-match-champion'>
                                                <img className='account-champion-pfp' src={`https://ddragon.leagueoflegends.com/cdn/${versions[0]}/img/champion/${id?.championName}.png`} />
                                                <p>{id?.champLevel}</p>
                                                <div className='account-match-spells'>
                                                    {
                                                        spellIds.map((group, index) => {

                                                            return (
                                                                group.map(spellId => {
                                                                    const spells = Object.values(summonerSpells as Record<string, Spells>).find((s) => Number(s?.key) === spellId )
                                                                    const gameId = data.info.gameId
                                                                    const firstSpell = data.info.participants.find(id => id.puuid == account.puuid)?.summoner1Id
                                                                    const secondSpell = data.info.participants.find(id => id.puuid == account.puuid)?.summoner2Id

                                                                    if (gameIds[index] == gameId && firstSpell == group[0] && secondSpell == group[1]) {
                                                                        return <img className='account-spell-pfps' src={`https://ddragon.leagueoflegends.com/cdn/${versions[0]}/img/spell/${spells?.id}.png`} alt='Summoner spell' />
                                                                    }
                                                                })
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>

                                            <div className='account-match-ratios'>
                                                    <p>{id?.kills}/<span>{id?.deaths}</span>/{id?.assists}</p>
                                                    <p>{id?.challenges.kda.toFixed(1)} KDA</p>
                                                    {!id?.challenges.killParticipation ? '0% KP' : <p>{(id?.win == true || id?.win == false) && id?.timePlayed > 180 ? Math.round(Number(id?.challenges.killParticipation.toFixed(2)) * 100) : 0}% KP</p>}
                                            </div>

                                            <div className='account-match-runes'>
                                                    <div className='account-match-rune'>
                                                        {
                                                            runes?.map((tree) => {
                                                                return tree.slots.map(slot => {
                                                                    return slot.runes.map(rune => {
                                                                        return id?.perks.styles[0].selections.filter(id => id.perk == rune.id).map(() => {
                                                                            return (
                                                                                <img src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`} />
                                                                            )
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                        }
                                                    </div>
                                                    <div className='account-match-rune2'>  
                                                        {
                                                            runes?.map((tree) => {
                                                                return tree.slots.map(slot => {
                                                                    return slot.runes.map(rune => {
                                                                        return id?.perks.styles[1].selections.filter((id) => id.perk == rune.id).map(() => {
                                                                            return (
                                                                                <img src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`} />
                                                                            )
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                        }
                                                    </div>
                                            </div>

                                            <div className='account-match-items'>
                                                    {
                                                        data.info.participants.filter(participant => participant.puuid == summonerProfile.puuid).map(item => {
                                                            const items = Array.from({ length: 6 }, (_, i) => {
                                                                const key = `item${i}` as ItemKey

                                                                return item[key]
                                                            })

                                                            return (
                                                                <div className='account-match-item'>
                                                                    {items.map(id => (
                                                                        id && id !== 0 ? (
                                                                            <img src={`https://ddragon.leagueoflegends.com/cdn/${versions[0]}/img/item/${id}.png`} />
                                                                        ) : (
                                                                            <div className='account-match-empty'></div>
                                                                        )
                                                                    ))}
                                                                </div>
                                                            )
                                                        })
                                                    }
                                            </div>

                                            <div className='account-match-info'>
                                                    <p>{id?.goldEarned.toLocaleString("en-US")} <img src='https://cdn5.xdx.gg/icons/gold.webp' /></p>
                                                    <p>{id?.neutralMinionsKilled} / {(id?.neutralMinionsKilled ?? 0) + (id?.totalMinionsKilled ?? 0)} <img src='https://cdn5.xdx.gg/icons/minion.webp' /> </p>
                                                    <p>({ (((id?.neutralMinionsKilled ?? 0) + (id?.totalMinionsKilled ?? 0)) / ((id?.timePlayed ?? 0) / 60)).toFixed(1)}/min)</p>
                                            </div>

                                            <div className='account-match-wards'>
                                                    <div className='account-match-ward'>
                                                        <img src='https://ddragon.leagueoflegends.com/cdn/14.4.1/img/item/2055.png' />
                                                        <span>{id?.detectorWardsPlaced}</span>
                                                    </div>
                                                    <div className='account-match-ward'>
                                                        <img src='https://ddragon.leagueoflegends.com/cdn/14.4.1/img/item/3340.png' />
                                                        <span>{id?.wardsPlaced}</span>
                                                    </div>
                                                    <div className='account-match-ward'>
                                                        <img src='https://ddragon.leagueoflegends.com/cdn/14.4.1/img/item/3364.png' />
                                                        <span>{id?.wardsKilled}</span>
                                                    </div>
                                            </div>

                                            <div className='account-match-players'>
                                                    <div>
                                                        {
                                                            data.info.participants.filter(element => element.teamId == 100).map(item => {
                                                                
                                                                return (
                                                                    <div className='account-match-sp'>
                                                                        {/* {item?.summonerId} */}

                                                                        <img src={`https://ddragon.leagueoflegends.com/cdn/${versions[0]}/img/champion/${item.championName}.png`} />
                                                                        <p>{item.riotIdGameName}-{item.riotIdTagline}</p>
                                                                    </div>
                                                                )
                                                            })
                                                            
                                                        }
                                                    </div>
                                                    <div>
                                                        {
                                                            data.info.participants.filter(element => element.teamId == 200).map(item => {
                                                                
                                                                return (
                                                                    <div className='account-match-sp'>
                                                                        {/* {item?.summonerId} */}

                                                                        <img src={`https://ddragon.leagueoflegends.com/cdn/${versions[0]}/img/champion/${item.championName}.png`} />
                                                                        <p>{item.riotIdGameName}-{item.riotIdTagline}</p>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }))                            
                        }
                    </div>
                </div>
            </div>}
        </section>
    )
}

const CountDown: React.FC = () => {
    const [countDown, setCountDown] = useState(60);
    const [disability, setDisability] = useState(false);
    const [inputChange, setInputChange] = useState('')
    const { setLoading, setAccount, setSummonerProfile,
        setRankedStats, setFullMatchData, setRunes, loadSummonerSpells
     } = useContext(StateContext)

    const getValues = async () => {
        const searchedAccount = await getAccount(inputChange)
        const leagueAccountData = await getAccountProfile(searchedAccount.puuid)

        setLoading(true)
        setDisability(true)

        setAccount(leagueAccountData.accountIdDataResponse)
        setSummonerProfile(leagueAccountData.profileResponse)
        setRankedStats(leagueAccountData.rankedResponse)
        setFullMatchData(leagueAccountData.fetchedResults)
        setRunes(leagueAccountData.runesResponse)
        loadSummonerSpells(leagueAccountData.fetchedResults, leagueAccountData.accountIdDataResponse)

        setLoading(false)
    }

    const disableButton = () => {
        const timer = setTimeout(() => {
            setCountDown(prev => {
                if (prev <= 0) {
                    clearTimeout(timer)
                    setDisability(false)
                    setCountDown(60)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return `(${countDown.toString()})`
    }

    return (
        <>
            <input type='search' id='query'
                placeholder='Summoner #NA1'
                onChange={(e) => setInputChange(e.target.value)}
                value={inputChange}
            />
            <button disabled={disability} onClick={getValues}>Search {disability == false ? null : disableButton()}</button>
        </>
        
    )
}

export default Accounts