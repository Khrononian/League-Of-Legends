import React, { useEffect, useState } from 'react'

const Accounts = () => {
    const [account, setAccount] = useState({})

    useEffect(() => {
        const getAccountId = async () => {
            // cbvMj0zXJpL1rWyQ2pyk5WA7G5HI8RFxmQNov46NRU2CxWi7AlDT0QexRDrPUQdxLjBDxj2TexGoKQ - SELBULL ACCOUNT

            const accountData = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/selbull/NA1?api_key=RGAPI-ad8abfce-eb65-4537-bb35-bc1f1eb112a1`)
            // const accountData = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${NAME}/NA1?api_key=${API_KEY}`)
            const accountResponse = await accountData.json()

            const accountId = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/${accountResponse.puuid}?api_key=RGAPI-ad8abfce-eb65-4537-bb35-bc1f1eb112a1`)
            const accountIdResponse = await accountId.json()

            const summonerProfile = await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${accountResponse.puuid}?api_key=RGAPI-ad8abfce-eb65-4537-bb35-bc1f1eb112a1`)
            const summonerProfileResponse = await summonerProfile.json()

            const rankedData = await fetch(`https://na1.api.riotgames.com/lol/league/v4/entries/by-puuid/${accountResponse.puuid}?api_key=RGAPI-ad8abfce-eb65-4537-bb35-bc1f1eb112a1`)
            const rankedDataResponse = await rankedData.json()

            const matchIdData = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${accountResponse.puuid}/ids?start=0&count=20&api_key=RGAPI-ad8abfce-eb65-4537-bb35-bc1f1eb112a1`)
            const matchIdDataResponse = await matchIdData.json()

            const fullMatchData = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/${matchIdDataResponse[1]}?api_key=RGAPI-ad8abfce-eb65-4537-bb35-bc1f1eb112a1`)
            // const fullMatchData = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/NA1_5416992220?api_key=RGAPI-ad8abfce-eb65-4537-bb35-bc1f1eb112a1`)
            const fullMatchDataResponse = await fullMatchData.json()

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
            </div>
        </section>
    )
}

export default Accounts