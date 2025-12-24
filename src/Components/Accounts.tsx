import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import iron from '../rankicons/7574-iron.png'
import bronze from '../rankicons/1184-bronze.png'
import silver from '../rankicons/7455-silver.png'
import gold from '../rankicons/1053-gold.png'
import platinum from '../rankicons/3978-platinum.png'
import diamond from '../rankicons/1053-diamond.png'
import master from '../rankicons/9231-master.png'
import grandmaster from '../rankicons/9476-grandmaster.png'
import challenger from '../rankicons/9476-challenger.png'

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

type SummonerSpells = {
    key: string,
    id: string,
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

const Accounts = ({ versions }) => {
    const [searchedName, setSearchedName] = useState('')
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
    const [matchHistory, setMatchHistory] = useState()
    // const [fullMatchData, setFullMatchData] = useState({})
    const [fullMatchData, setFullMatchData] = useState([[{}]])
    // const [summonerSpells, setSummonerSpells] = useState<Spells>({})
    const [summonerSpells, setSummonerSpells] = useState({})
    // const [summonerSpells, setSummonerSpells] = useState({})
    const [gameIds, setGameIds] = useState<number[]>([])
    const [runes, setRunes] = useState<Runes[]>([])
    const [spellIds, setSpellIds] = useState<number[][]>([[0, 0]]) // USE THIS TO PUSH THE SUMMONER SPELL IDS HERE
    const [loading, setLoading] = useState(true)
    
    const fetchAccountData = async (accountName: string) => {
        const accountData = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${accountName}/NA1?api_key=RGAPI-eb7af4bb-91a2-4bec-b670-be7954f757e2`)
        const accountResponse = await accountData.json()

        const accountId = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/${accountResponse.puuid}?api_key=RGAPI-eb7af4bb-91a2-4bec-b670-be7954f757e2`)
        const accountIdResponse = await accountId.json()

        const summonerProfile = await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${accountResponse.puuid}?api_key=RGAPI-eb7af4bb-91a2-4bec-b670-be7954f757e2`)
        const summonerProfileResponse = await summonerProfile.json()

        const rankedData = await fetch(`https://na1.api.riotgames.com/lol/league/v4/entries/by-puuid/${accountResponse.puuid}?api_key=RGAPI-eb7af4bb-91a2-4bec-b670-be7954f757e2`)
        const rankedDataResponse = await rankedData.json()

        const matchHistoryIdData = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${accountResponse.puuid}/ids?start=0&count=20&api_key=RGAPI-eb7af4bb-91a2-4bec-b670-be7954f757e2`)
        const matchHistoryIdResponse = await matchHistoryIdData.json()

        const fetchMatchHistory = async (): Promise<MatchHistory[][]> => {
            const matchHistoryResults = []

            for (let i = 0; i < matchHistoryIdResponse.length; i += 5) {
                const sliced = matchHistoryIdResponse.slice(i, i + 5)

                const sliceSize = await Promise.all(
                    sliced.map((id: string) => fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/${id}?api_key=RGAPI-eb7af4bb-91a2-4bec-b670-be7954f757e2`)
                .then(response => response.json()))
                )

                sliceSize.map(item => delete item.metadata)
                matchHistoryResults.push(sliceSize)

                matchHistoryResults.map((item, index) => {
                    console.log('FULLSTRAIN', item, index)

                    item.map(element => console.log('FULLINNER', element))
                })
                
                await new Promise(resolve => setTimeout(resolve, 800))
            }
            console.log('MATA', matchHistoryResults)
            return matchHistoryResults
        }

        const runesData = await fetch(`https://ddragon.leagueoflegends.com/cdn/15.23.1/data/en_US/runesReforged.json`) 
        const runesResponse = await runesData.json()

        setAccount(accountIdResponse)
        setSummonerProfile(summonerProfileResponse)
        setRankedStats(rankedDataResponse)

        setMatchHistory(matchHistoryIdResponse)
        setFullMatchData(await fetchMatchHistory())
        setRunes(runesResponse)
        

        const getSpellIds = (matchResponse: MatchHistory[][]) => {
            const spell: number[][] = []
            console.log('POO', matchResponse, spell)

            

            matchResponse.map((res) => res.map((element: MatchHistory) => {
                const data = element as MatchHistory
                // DONT FORGET TO CHANGE THE PUUID BELOW THIS COMMENT
                const id = data.info.participants.find((id) => id.puuid == 'cbvMj0zXJpL1rWyQ2pyk5WA7G5HI8RFxmQNov46NRU2CxWi7AlDT0QexRDrPUQdxLjBDxj2TexGoKQ')
                const gameId = data.info.gameId

                if (id) spell.push([id?.summoner1Id, id?.summoner2Id])

                setGameIds(prev => prev.concat(gameId))

                console.log('WORKED', spell, id )
            }))
            
            setSpellIds(spell)
        }

        getSpellIds(await fetchMatchHistory())
        setLoading(false)
    }

    useEffect(() => {
        // REMOVE THIS FUNCTION AFTER MAKING SURE EVERYTHING WORKS SO THAT IT ONLY OPERATES WHEN SEARCHED
        const loadSummonerSpells = async () => {
            const versionData = await fetch('https://ddragon.leagueoflegends.com/api/versions.json')
            const versionResponse = await versionData.json();

            const spellData = await fetch(`https://ddragon.leagueoflegends.com/cdn/${versionResponse[0]}/data/en_US/summoner.json`)
            const spellResponse = await spellData.json()
            const info = Object.entries(spellResponse.data)
            console.log('SPELLS', spellResponse, info, info.map((inner) => inner[1]))

            // for (const internal of info.map((inner) => inner[1])) {
            //     console.log('SPELLS2', internal.key)
            // }
            // setSummonerSpells(Object.entries(spellResponse.data).map(inner => inner[1]))
            setSummonerSpells(Object.values(spellResponse.data))
            console.log('SS', fullMatchData)
            // setSummonerSpells(Object.entries(spellResponse.data))
        }

        // getAccountId()
        fetchAccountData('selbull')
        loadSummonerSpells()
    }, [])

    return (
        <section>
            <Nav />
            {loading == true ? <p>Loading...</p> : <div>
                <form id='form' role='search'>
                    <input type='search' id='query'
                        placeholder='Search Summoner Profile'
                    />
                    <button>Search</button>
                </form>
                <div>
                    <div>
                        <img src={`https://ddragon.leagueoflegends.com/cdn/${versions[0]}/img/profileicon/${summonerProfile.profileIconId}.png`} alt='Summoner Profile' />
                        <span>{summonerProfile.summonerLevel}</span>
                        <div>
                            <p>{account.gameName}#NA1</p>
                        </div>
                    </div>

                    <div>
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
                                console.log('NEWS', matchHistory, data)
                                // console.log('IMG', data.tier.toLowerCase()[0].toUpperCase(), index, values, data.tier.toLowerCase())
                                // console.log('ICONS', rankedIcons.find(icon => icon.tier == data.tier.toLowerCase())?.icon)
                                return (
                                    <div key={index}>
                                        <div>
                                            <div>
                                                <img src={`${rankedIcons.find(icon => icon.tier == data.tier.toLowerCase())?.icon}` } alt={`${data.tier} Rank icon`} />
                                                <p>{data.queueType.includes('SOLO') ? 'Solo/Duo' : 'Flex 5v5'}</p>
                                            </div>

                                            <div>
                                                <p>{data.tier} {data.rank}</p>
                                                <div>
                                                    <p>{data.leaguePoints} LP</p>
                                                    <p>{winRate.toFixed(2)} % Win Rate</p>
                                                </div>
                                                <div>
                                                    <p>{data.wins} Wins</p>
                                                    *
                                                    <p>{data.losses} Losses</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div>
                        {/* THIS THING IS SHOWING ONLY ONE. FIND A WAY TO MAKE IT SO THAT IT SHOWS ALL MATCHES */}
                        {
                            // Object.entries(fullMatchData).map(([index, values]) => {
                            fullMatchData.map(response => response.map(element => {
                                const data = element as MatchHistory; 
                                const start = data.info.gameStartTimestamp
                                const end = data.info.gameEndTimestamp
                                const duration = end - start
                                const diff = Date.now() - start
                                console.log('INTEGER', data, element )
                                const id = data.info.participants.find((id) => id.puuid == summonerProfile.puuid)
                                // console.log('MATCH', data, values, fullMatchData)
                                // if (spellIds.length == 2 && id?.summoner1Id && id?.summoner2Id) setSpellIds([id?.summoner1Id, id?.summoner2Id])
                                // setSpellIds([spell1, spell2])

                                
                                console.log('MATCH NEWS', data, id, id?.win, summonerSpells, id?.summoner1Id, id?.summoner2Id, spellIds, runes )
                                // console.log('MATCHHH', fullMatchData, data)
                                return (
                                    <div>
                                        <div>
                                            <p>{isNaN(Math.floor(duration / 60000)) != true ? `${Math.floor(duration / 60000)} min` : null}</p>
                                            <p>{data.info.gameMode}</p>
                                            <p>{id?.win == true ? 'VICTORY' : id?.win == false && id?.timePlayed > 180 ? 'DEFEAT' : 'REMAKE'}</p>
                                            <p>{isNaN(Math.floor(diff / (1000 * 60 * 60 * 24))) != true ? `${Math.floor(diff / (1000 * 60 * 60 * 24))} days ago` : null } </p>
                                        </div>
                                        <div>
                                            <div>
                                                <img src={`https://ddragon.leagueoflegends.com/cdn/${versions[0]}/img/champion/${id?.championName}.png`} />
                                                <p>{id?.champLevel}</p>
                                                <div>
                                                    {
                                                        spellIds.map((group, index) => {
                                                            console.log('PILLOW', group, data, id, 5430338614)

                                                            return (
                                                                group.map(spellId => {
                                                                    const spells = Object.values(summonerSpells).find((s) => Number(s.key) === spellId )
                                                                    const gameId = data.info.gameId
                                                                    const firstSpell = data.info.participants.find(id => id.puuid == account.puuid)?.summoner1Id
                                                                    const secondSpell = data.info.participants.find(id => id.puuid == account.puuid)?.summoner2Id

                                                                    
                                                                    console.log('PILLOW2', spells, account, gameId == 5430338614, firstSpell == Number(spells.key), secondSpell == Number(spells.key))
                                                                    console.log('PILLOWS3', gameId == 5430338614, firstSpell == group[0], secondSpell == group[1], spellId, group)

                                                                    if (gameIds[index] == gameId && firstSpell == group[0] && secondSpell == group[1]) {
                                                                        console.log('PILLOWS444444444', gameIds)
                                                                        return <img src={`https://ddragon.leagueoflegends.com/cdn/${versions[0]}/img/spell/${spells.id}.png`} alt='Summoner spell' />
                                                                    }
                                                                })
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>

                                            <div>
                                                    <p>{id?.kills}/{id?.deaths}/{id?.assists}</p>
                                                    <p>{id?.challenges.kda.toFixed(2)} KDA</p>
                                                    <p>{Math.round(Number(id?.challenges.killParticipation.toFixed(2)) * 100)}% KP</p>
                                            </div>

                                            <div>
                                                    <div>
                                                        {
                                                            runes?.map((tree) => {
                                                                return tree.slots.map(slot => {
                                                                    return slot.runes.map(rune => {
                                                                        return id?.perks.styles[0].selections.filter(id => id.perk == rune.id).map((perkId) => {
                                                                            // console.log('BLUES', tree, slot, rune, perkId, id?.perks)
                                                                            console.log('BLUES', tree, tree.slots, slot, rune, perkId)
                                                                            return (
                                                                                <img src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`} />
                                                                            )
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                        }
                                                    </div>
                                                    <div>  
                                                        {
                                                            runes?.map((tree) => {
                                                                return tree.slots.map(slot => {
                                                                    return slot.runes.map(rune => {
                                                                        return id?.perks.styles[1].selections.filter((id) => id.perk == rune.id).map(() => {
                                                                            // console.log('NEWS NEWS', tree, slot, rune, perkId)
                                                                            console.log('NEW NEW', fullMatchData, summonerProfile)
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

                                            <div>
                                                    {
                                                        data.info.participants.filter(participant => participant.puuid == summonerProfile.puuid).map(item => {
                                                            const items = Array.from({ length: 6 }, (_, i) => {
                                                                const key = `item${i}` as ItemKey

                                                                // return item[`item${i}`]
                                                                return item[key]
                                                            })

                                                            return (
                                                                <div>
                                                                    {items.map(id => (
                                                                        id ? (
                                                                            <img src={`https://ddragon.leagueoflegends.com/cdn/${versions[0]}/img/item/${id}.png`} />
                                                                        ) : (
                                                                            <div className='empty-block' />
                                                                        )
                                                                    ))}
                                                                </div>
                                                            )
                                                        })
                                                    }
                                            </div>

                                            <div>
                                                    <p>{id?.goldEarned}</p>
                                                    <p>{id?.neutralMinionsKilled} / {id?.neutralMinionsKilled + id?.totalMinionsKilled} </p>
                                                    <p>({ ((id?.neutralMinionsKilled + id?.totalMinionsKilled) / (id?.timePlayed / 60)).toFixed(1) }/min)</p>
                                            </div>
                                            <div>
                                                    <div>
                                                        <img src='https://ddragon.leagueoflegends.com/cdn/14.4.1/img/item/2055.png' />
                                                        <span>{id?.detectorWardsPlaced}</span>
                                                    </div>
                                                    <div>
                                                        <img src='https://ddragon.leagueoflegends.com/cdn/14.4.1/img/item/3340.png' />
                                                        <span>{id?.wardsPlaced}</span>
                                                    </div>
                                                    <div>
                                                        <img src='https://ddragon.leagueoflegends.com/cdn/14.4.1/img/item/3364.png' />
                                                        <span>{id?.wardsKilled}</span>
                                                    </div>
                                            </div>

                                            <div>
                                                    <div>
                                                        {
                                                            data.info.participants.filter(element => element.teamId == 100).map(item => {
                                                                
                                                                console.log('MEW MEW', item, summonerProfile)
                                                                return (
                                                                    <div>
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
                                                                
                                                                console.log('MEW MEW', item, summonerProfile)
                                                                return (
                                                                    <div>
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

export default Accounts