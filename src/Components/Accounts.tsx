import React, { useEffect, useState } from 'react'
import iron from '../rankicons/7574-iron.png'
import bronze from '../rankicons/1184-bronze.png'
import silver from '../rankicons/7455-silver.png'
import gold from '../rankicons/1053-gold.png'
import platinum from '../rankicons/3978-platinum.png'
import diamond from '../rankicons/1053-diamond.png'
import master from '../rankicons/9231-master.png'
import grandmaster from '../rankicons/9476-grandmaster.png'
import challenger from '../rankicons/9476-challenger.png'

type RankedData = {
    tier: string,
    rank: string,
    leaguePoints: number,
    wins: number,
    losses: number
}

type MatchHistory = {
    info: {
        endOfGameResult: string
    },
    
    gameMode: string,
    championName: string,
    participants: [
        {
            puuid: string, 
            teamId: number,
            win: boolean,
            summoner1Id: number,
            summoner2Id: number,
            championName: string
        }
    ]
    teams: [
        teamId: number,
        win: boolean
    ]
}

const Accounts = ({ versions, singleChampion }) => {
    const [searchedName, setSearchedName] = useState({})

    const [account, setAccount] = useState({})
    const [summonerProfile, setSummonerProfile] = useState({})
    const [rankedStats, setRankedStats] = useState({})
    const [matchHistory, setMatchHistory] = useState()
    const [fullMatchData, setFullMatchData] = useState({})
    const [summonerSpells, setSummonerSpells] = useState({})
    // const [spellIds, setSpellIds] = useState<[number | undefined, number | undefined]>([0, 0]) // USE THIS TO PUSH THE SUMMONER SPELL IDS HERE
    const [spellIds, setSpellIds] = useState<number[]>([0, 0]) // USE THIS TO PUSH THE SUMMONER SPELL IDS HERE
    // const spell:[number | undefined] = []
    // const [rankedIcons, setRankedIcons] = useState([
    //     '../rankicons/7574-iron.png', '../rankicons/1184-bronze.png', '../rankicons/7455-silver.png',
    //     '../rankicons/1053-gold.png', '../rankicons/3978-platinum.png', '../rankicons/1053-diamond.png',
    //     '../rankicons/9231-master.png', '../rankicons/9476-grandmaster.png', '../rankicons/9476-challenger.png'
    // ])

    useEffect(() => {
        const getAccountId = async () => {
            // cbvMj0zXJpL1rWyQ2pyk5WA7G5HI8RFxmQNov46NRU2CxWi7AlDT0QexRDrPUQdxLjBDxj2TexGoKQ - SELBULL ACCOUNT
            
            const accountData = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/selbull/NA1?api_key=RGAPI-4f00e1ac-e91f-4dab-872f-842a17256ec1`)
            // const accountData = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${NAME}/NA1?api_key=${API_KEY}`)
            const accountResponse = await accountData.json()

            const accountId = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/${accountResponse.puuid}?api_key=RGAPI-4f00e1ac-e91f-4dab-872f-842a17256ec1`)
            const accountIdResponse = await accountId.json()

            const summonerProfile = await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${accountResponse.puuid}?api_key=RGAPI-4f00e1ac-e91f-4dab-872f-842a17256ec1`)
            const summonerProfileResponse = await summonerProfile.json()

            const rankedData = await fetch(`https://na1.api.riotgames.com/lol/league/v4/entries/by-puuid/${accountResponse.puuid}?api_key=RGAPI-4f00e1ac-e91f-4dab-872f-842a17256ec1`)
            const rankedDataResponse = await rankedData.json()

            const matchHistoryIdData = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${accountResponse.puuid}/ids?start=0&count=20&api_key=RGAPI-4f00e1ac-e91f-4dab-872f-842a17256ec1`)
            const matchHistoryIdResponse = await matchHistoryIdData.json()

            const fullMatchData = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/${matchHistoryIdResponse[3]}?api_key=RGAPI-4f00e1ac-e91f-4dab-872f-842a17256ec1`)
            // const fullMatchData = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/NA1_5416992220?api_key=RGAPI-4f00e1ac-e91f-4dab-872f-842a17256ec1`)
            const fullMatchResponse = await fullMatchData.json()

            delete fullMatchResponse.metadata
            setAccount(accountIdResponse)
            setSummonerProfile(summonerProfileResponse)
            setRankedStats(rankedDataResponse)
            setMatchHistory(matchHistoryIdResponse)
            setFullMatchData(fullMatchResponse)

            console.log('ACCOUNT', accountResponse, accountIdResponse, summonerProfileResponse, rankedDataResponse, matchHistoryIdResponse, fullMatchResponse)
            
            const getSpellIds = (matchResponse) => {
                const spell: number[] = []
                console.log('POO', matchResponse)

                Object.entries(matchResponse).map(([index, values]) => {
                    const data = values as MatchHistory
                    const id = data.participants.find((id) => id.puuid == 'cbvMj0zXJpL1rWyQ2pyk5WA7G5HI8RFxmQNov46NRU2CxWi7AlDT0QexRDrPUQdxLjBDxj2TexGoKQ')

                    if (id) spell.push(id?.summoner1Id, id?.summoner2Id)
                        console.log('WORKED', spell, id, values)
                })
                
                setSpellIds(spell)
            }

            getSpellIds(fullMatchResponse)
        }

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
            setSummonerSpells(Object.entries(spellResponse.data).map(inner => inner[1]))
            console.log('SS', fullMatchData)
            // setSummonerSpells(Object.entries(spellResponse.data))
        }

        getAccountId()
        loadSummonerSpells()
    }, [])

    const loadSummonerSpells = async () => {
        const spellData = await fetch(`https://ddragon.leagueoflegends.com/cdn/${versions[0]}/data/en_US/summoner.json`)
        const spellResponse = await spellData.json()

        setSummonerSpells(spellResponse)
    }

    return (
        <section>
            <div>
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
                                console.log('NEWS', matchHistory, )
                                // console.log('IMG', data.tier.toLowerCase()[0].toUpperCase(), index, values, data.tier.toLowerCase())
                                // console.log('ICONS', rankedIcons.find(icon => icon.tier == data.tier.toLowerCase())?.icon)
                                return (
                                    <div key={index}>
                                        <div>
                                            <div>
                                                <img src={`${rankedIcons.find(icon => icon.tier == data.tier.toLowerCase())?.icon}` } alt={`${data.tier} Rank icon`} />
                                                <p>Solo/Duo</p>
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
                            
                            
                            Object.entries(fullMatchData).map(([index, values]) => {
                                const data = values as MatchHistory;
                                const start = data.gameStartTimestamp
                                const end = data.gameEndTimestamp
                                const duration = end - start
                                const diff = Date.now() - start
                                const id = data.participants.find((id) => id.puuid == summonerProfile.puuid)
                                // console.log('MATCH', data, values, fullMatchData)
                                // if (spellIds.length == 2 && id?.summoner1Id && id?.summoner2Id) setSpellIds([id?.summoner1Id, id?.summoner2Id])
                                // setSpellIds([spell1, spell2])

                                
                                console.log('MATCH NEWS', data, id, id?.win, summonerSpells, id?.summoner1Id, spellIds )
                                // console.log('MATCHHH', fullMatchData, data)
                                return (
                                    <div>
                                        <div>
                                            <p>{isNaN(Math.floor(duration / 60000)) != true ? `${Math.floor(duration / 60000)} min` : null}</p>
                                            <p>{data.gameMode}</p>
                                            <p>{id?.win == true ? 'VICTORY' : id?.win == false ? 'DEFEAT' : null}</p>
                                            <p>{isNaN(Math.floor(diff / (1000 * 60 * 60 * 24))) != true ? `${Math.floor(diff / (1000 * 60 * 60 * 24))} days ago` : null } </p>
                                        </div>
                                        <div>
                                            <div>
                                                <img src={`https://ddragon.leagueoflegends.com/cdn/${versions[0]}/img/champion/${id?.championName}.png`} />
                                                <p>{id?.champLevel}</p>
                                                <div>
                                                    {
                                                        Object.entries(summonerSpells).filter(([index, spell]) => Number(spell.key) == spellIds[0] || Number(spell.key) == spellIds[1]).map(([index, spell]) => {
                                                            console.log('OKKKKK', spell, spell.key)

                                                            return (
                                                                // <img src={`https://ddragon.leagueoflegends.com/cdn/${versions[0]}/img/spell/${Number(spell.key) == spellIds[0] ? spell.id : Number(spell.key) == spellIds[1] ? spell.id : '' }.png`} alt='Summoner spell' />
                                                                <img src={`https://ddragon.leagueoflegends.com/cdn/${versions[0]}/img/spell/${spell.id}.png`} alt='Summoner spell' />
                                                            )
                                                        })
                                                    }
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            
                            // (() => {
                            //     matchHistory.map(async match => {
                            //         const fullMatchData = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/${matchHistory}?api_key=RGAPI-f52f8a03-ae29-416e-9deb-1726f9285d74`)
                            //         const fullMatchResponse = await fullMatchData.json()
                            //     })
                                
                            //     console.log('NEW MTAHC', matchHistory)
                            //     return (
                            //         <div>Hi </div>
                            //     )
                            // })()
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Accounts