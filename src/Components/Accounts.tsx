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
    }
}

const Accounts = ({ versions }) => {
    const [searchedName, setSearchedName] = useState({})

    const [account, setAccount] = useState({})
    const [summonerProfile, setSummonerProfile] = useState({})
    const [rankedStats, setRankedStats] = useState({})
    const [matchHistory, setMatchHistory] = useState({})
    const [fullMatchData, setFullMatchData] = useState({})
    // const [rankedIcons, setRankedIcons] = useState([
    //     '../rankicons/7574-iron.png', '../rankicons/1184-bronze.png', '../rankicons/7455-silver.png',
    //     '../rankicons/1053-gold.png', '../rankicons/3978-platinum.png', '../rankicons/1053-diamond.png',
    //     '../rankicons/9231-master.png', '../rankicons/9476-grandmaster.png', '../rankicons/9476-challenger.png'
    // ])

    useEffect(() => {
        const getAccountId = async () => {
            // cbvMj0zXJpL1rWyQ2pyk5WA7G5HI8RFxmQNov46NRU2CxWi7AlDT0QexRDrPUQdxLjBDxj2TexGoKQ - SELBULL ACCOUNT

            const accountData = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/selbull/NA1?api_key=RGAPI-118f1ac2-744f-453a-8efb-3482671b1e4d`)
            // const accountData = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${NAME}/NA1?api_key=${API_KEY}`)
            const accountResponse = await accountData.json()

            const accountId = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/${accountResponse.puuid}?api_key=RGAPI-118f1ac2-744f-453a-8efb-3482671b1e4d`)
            const accountIdResponse = await accountId.json()

            const summonerProfile = await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${accountResponse.puuid}?api_key=RGAPI-118f1ac2-744f-453a-8efb-3482671b1e4d`)
            const summonerProfileResponse = await summonerProfile.json()

            const rankedData = await fetch(`https://na1.api.riotgames.com/lol/league/v4/entries/by-puuid/${accountResponse.puuid}?api_key=RGAPI-118f1ac2-744f-453a-8efb-3482671b1e4d`)
            const rankedDataResponse = await rankedData.json()

            const matchIdData = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${accountResponse.puuid}/ids?start=0&count=20&api_key=RGAPI-118f1ac2-744f-453a-8efb-3482671b1e4d`)
            const matchIdDataResponse = await matchIdData.json()

            const fullMatchData = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/${matchIdDataResponse[1]}?api_key=RGAPI-118f1ac2-744f-453a-8efb-3482671b1e4d`)
            // const fullMatchData = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/NA1_5416992220?api_key=RGAPI-118f1ac2-744f-453a-8efb-3482671b1e4d`)
            const fullMatchDataResponse = await fullMatchData.json()

            setAccount(accountIdResponse)
            setSummonerProfile(summonerProfileResponse)
            setRankedStats(rankedDataResponse)
            setMatchHistory(matchIdDataResponse)
            setFullMatchData(fullMatchDataResponse)

            console.log('ACCOUNT', accountResponse, accountIdResponse, summonerProfileResponse, rankedDataResponse, matchIdDataResponse, fullMatchDataResponse)
            
        }

        getAccountId()
    }, [])

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
                        {/* <div>
                            <div>
                                <img src={`https://static.developer.riotgames.com/docs/lol/ranked-emblems/Emblem_${rankedStats[1].tier.toLowerCase()[0].toUpperCase()}.png`} />
                                <p>Solo/Duo</p>
                            </div>
                            <div>
                                <p>{rankedStats[1].tier} {rankedStats[1].rank}</p>
                                <div>
                                    <p>{rankedStats[1].leaguePoints} LP</p>
                                    <p>{winRate.toFixed(2)} % Win Rate</p>
                                </div>
                                <div>
                                    <p>{rankedStats[1].wins} Wins</p>
                                    *
                                    <p>{rankedStats[1].losses} Losses</p>
                                </div>
                            </div>
                        </div> */}
                        /
                        {/* ADD A BIGGER SLASH */}
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

                                console.log('MATCH', data, start)
                                return (
                                    <div>
                                        <div>
                                            <p>{ Math.floor(duration / 60000)} min</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Accounts