import React, { useEffect, useState } from 'react'

type RankedData = {
    tier: string,
    rank: string,
    leaguePoints: number,
    wins: number,
    losses: number
}

const Accounts = ({ versions }) => {
    const [searchedName, setSearchedName] = useState({})

    const [account, setAccount] = useState({})
    const [summonerProfile, setSummonerProfile] = useState({})
    const [rankedStats, setRankedStats] = useState({})
    const [matchHistory, setMatchHistory] = useState({})
    const [fullMatchData, setFullMatchData] = useState({})

    useEffect(() => {
        const getAccountId = async () => {
            // cbvMj0zXJpL1rWyQ2pyk5WA7G5HI8RFxmQNov46NRU2CxWi7AlDT0QexRDrPUQdxLjBDxj2TexGoKQ - SELBULL ACCOUNT

            const accountData = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/selbull/NA1?api_key=RGAPI-dbd52e5c-98a8-4b2e-9d85-5a49403f8e93`)
            // const accountData = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${NAME}/NA1?api_key=${API_KEY}`)
            const accountResponse = await accountData.json()

            const accountId = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/${accountResponse.puuid}?api_key=RGAPI-dbd52e5c-98a8-4b2e-9d85-5a49403f8e93`)
            const accountIdResponse = await accountId.json()

            const summonerProfile = await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${accountResponse.puuid}?api_key=RGAPI-dbd52e5c-98a8-4b2e-9d85-5a49403f8e93`)
            const summonerProfileResponse = await summonerProfile.json()

            const rankedData = await fetch(`https://na1.api.riotgames.com/lol/league/v4/entries/by-puuid/${accountResponse.puuid}?api_key=RGAPI-dbd52e5c-98a8-4b2e-9d85-5a49403f8e93`)
            const rankedDataResponse = await rankedData.json()

            const matchIdData = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${accountResponse.puuid}/ids?start=0&count=20&api_key=RGAPI-dbd52e5c-98a8-4b2e-9d85-5a49403f8e93`)
            const matchIdDataResponse = await matchIdData.json()

            const fullMatchData = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/${matchIdDataResponse[1]}?api_key=RGAPI-dbd52e5c-98a8-4b2e-9d85-5a49403f8e93`)
            // const fullMatchData = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/NA1_5416992220?api_key=RGAPI-dbd52e5c-98a8-4b2e-9d85-5a49403f8e93`)
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

                                console.log('IMG', data.tier.toLowerCase()[0].toUpperCase(), index, values, data.tier.toLowerCase())
                                return (
                                    <div key={index}>
                                        <div>
                                            <div>
                                                <img src='' alt='Rank icon' />
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
                </div>
            </div>
        </section>
    )
}

export default Accounts