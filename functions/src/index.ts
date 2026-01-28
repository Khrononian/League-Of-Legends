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
import { ParsedQs } from 'qs'
import { defineSecret } from "firebase-functions/params";



const RIOT_APIKEY = defineSecret('RIOT_APIKEY')


export const getAccount = onRequest(
    { secrets: [RIOT_APIKEY], cors: true },
    async (req, res) => {
        try {
            const apiKey = RIOT_APIKEY.value()
            // const summonerName = req.query.summoner
            // logger.info("Incoming request:", { url: req.originalUrl, query: req.query });
            // logger.info("Summoner:", req.query.summoner);
            
            
            const normalizeQueryParam = (value: string | string[] | ParsedQs | ParsedQs[] |
                undefined
            ): string | undefined => {
                if (typeof value === 'string') return value.trim() || undefined
                
                if (Array.isArray(value)) {
                    const first = value[0]

                    if (typeof first === 'string') return first.trim() || undefined
                    
                    return undefined
                }
                
                return undefined
            }
            // const summonerName = normalizeQueryParam(
            //     Array.isArray(req.query.summoner) ? req.query.summoner[0]
            //     : typeof req.query.summoner === 'string' ? req.query.summoner
            //     : undefined
            // )
            const summonerName = normalizeQueryParam(req.query)
            // // const summonerName = 'selbull'
            if (!summonerName?.trim() ) {
                // res.status(400).json({error: 'MISSING NAME', key: apiKey})
                console.log('FIREBASE')
                console.log('QUERY', req, req.query, )
                res.status(400).json({error: 'MISSING NAMEE', key: apiKey, name: summonerName})
                return
            }

            // if (!apiKey) {
            //     res.status(500).json({error: 'MISSING API', key: apiKey})
            //     return
            // }
            // const summonerName = req.query.summoner

            const riotRes = await fetch(
                `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
                    summonerName.trim()
                )}/NA1?api_key=${apiKey}`
            )
            const response = await riotRes.json() 
            
            // res.json(response)
            res.status(200).json(response)
            return
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Internal error'})
        }
    
        

        // res.json({
        //     secretExists: !!apiKey,
        //     secondary: apiKey,
        //     final: apiKey.toLowerCase()
        // })
})
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
