/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
// import { logger } from "firebase-functions/logger";
// import {setGlobalOptions} from "firebase-functions";
import { onRequest } from "firebase-functions/https";
// import { ParsedQs } from 'qs'
import { defineSecret } from "firebase-functions/params";

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
const RIOT_APIKEY = defineSecret('RIOT_APIKEY')

// const normalizeQueryParam = (value: string | string[] | ParsedQs | ParsedQs[] |
//     undefined
// ): string | undefined => {
//     if (typeof value === 'string') return value.trim() || undefined
//     if (Array.isArray(value)) {
//         const first = value[0]

//         if (typeof first === 'string') return first.trim() || undefined
        
//         return undefined
//     }
    
//     return undefined
// }

// const normalizeIdQuery = () => {

// }
export const getAccount = onRequest(
    { secrets: [RIOT_APIKEY], cors: true },
    async (req, res) => {
        try {
            // const summonerName = normalizeQueryParam(req.query)
            const summonerName = typeof req.query.summoner === 'string' ? req.query.summoner.trim() : ''
            const apiKey = RIOT_APIKEY.value()
            // // const summonerName = 'selbull'
            if (!summonerName?.trim() ) {
                res.status(400).json({error: 'MISSING NAMEE', key: apiKey, name: summonerName})
                return
            }

            const riotRes = await fetch(
                `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
                    summonerName.trim()
                )}/NA1?api_key=${apiKey}`
            )
            const response = await riotRes.json() 
            
            res.status(200).json(response)
            return
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Internal error'})
        }
})

export const getAccountId = onRequest(
    { secrets: [RIOT_APIKEY], cors: true },
    async (req, res) => {
        try {
            // const summonerId = normalizeQueryParam(req.query)
            const summonerId = typeof req.query.summoner === 'string' ? req.query.summoner.trim() : ''
            const apiKey = RIOT_APIKEY.value()

            if (!summonerId ) {
                res.status(400).json({error: 'MISSING ID', key: apiKey, name: summonerId})
                return
            }

            const riotRes = await fetch(
                `https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/${encodeURIComponent(
                    summonerId
                )}?api_key=${apiKey}`
            )

            const response = await riotRes.json()

            res.status(200).json(response)
            return
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Internal error'})
        }
    }
)

export const getAccountProfile = onRequest(
    { secrets: [RIOT_APIKEY], cors: true },
    async (req, res) => {
        try {
            const puuid = typeof req.query.puuid === 'string' ? req.query.puuid.trim() : ''
            const apiKey = RIOT_APIKEY.value()

            if (!puuid ) {
                res.status(400).json({error: 'MISSING ID', key: apiKey, name: puuid})
                return
            }

            const accountProfileResponse = await fetch(
                `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(
                    puuid
                )}?api_key=${apiKey}`
            )
            const profileResponse = await accountProfileResponse.json()
            const accountRankedResponse = await fetch(
                `https://na1.api.riotgames.com/lol/league/v4/entries/by-puuid/${encodeURIComponent(
                    puuid
                )}?api_key=${apiKey}`
            )
            const rankedResponse = await accountRankedResponse.json()
            
            const accountMatchHistory = await fetch(
                `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(
                    puuid
                )}/ids?start=0&count=20&api_key=${apiKey}`
            )
            const matchHistoryResponse = await accountMatchHistory.json()

            // const allApis = Promise.all([accountProfileResponse, accountRankedResponse, accountMatchHistory].map(async (url) => {
            //     await url.json()
            // }))

            const fetchMatchHistory = async (): Promise<MatchHistory[][]> => {
                const matchHistoryResults = []

                // return Promise.all(
                //     matchHistoryResponse.slice(0, 5).map(async (id: string) => {
                //         const matchResponse = await fetch(
                //             `https://americas.api.riotgames.com/lol/match/v5/matches/${id}?api_key=${apiKey}`
                //         )

                //         return matchResponse.json()
                //     })
                // )
                for (let i = 0; i < matchHistoryResponse.length; i += 5) {
                    const sliced = matchHistoryResponse.slice(i, i + 5)

                    const sliceSize = await Promise.all(
                        sliced.map((id: string) => fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/${id}?api_key=${apiKey}`)
                    .then(response => response.json()))
                    )

                    sliceSize.map(item => delete item.metadata)
                    matchHistoryResults.push(sliceSize)

                    // matchHistoryResults.map((item, index) => {
                    //     console.log('FULLSTRAIN', item, index)

                    //     item.map(element => console.log('FULLINNER', element))
                    // })
                    
                    await new Promise(resolve => setTimeout(resolve, 800))
                }

                return matchHistoryResults
                // return Promise.all(matchHistoryResults)
                
            }
            const fetchedResults = await fetchMatchHistory()
            // res.status(200).json(profileResponse)
            // res.status(200).json(rankedResponse) 
            res.status(200).json({ profileResponse, rankedResponse, matchHistoryResponse, fetchedResults }) 
            // res.status(200).json({ allApis }) 
            return
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Internal error'})
        }
    }
)
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
// setGlobalOptions({ maxInstances: 10 });

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
