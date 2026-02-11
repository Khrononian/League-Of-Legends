const mainUrl = 'https://us-central1-lol-apis-c196.cloudfunctions.net/'

export const getAccount = async (summoner: string) => {
    const res = await fetch(
        `${mainUrl}getAccount?summoner=${encodeURIComponent(
            summoner
        )}`
        
    )
    console.log('PUUID NAME', summoner, res)
    if (!res.ok) throw new Error (`Failed to fetch account ${res.status}`)

    return res.json()
}

export const getAccountId = async (puuid: string) => {
    const res = await fetch(
        `${mainUrl}getAccountId?puuid=${encodeURIComponent(
            puuid
        )}`
    )
    if (!res.ok) throw new Error (`Failed to fetch account ${res.status}`)
    
    return res.json()
}

export const getAccountProfile = async (puuid: string) => {
    const res = await fetch(
        `${mainUrl}getAccountProfile?puuid=${encodeURIComponent(
            puuid
        )}`
    )
    // const text = await res.text()
    console.log('PUUID', puuid, res)
    // console.error('Riot:', text)
    if (!res.ok) throw new Error (`Failed to fetch account ${res.status}`)
    
    return res.json()
}
