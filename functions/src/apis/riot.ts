export const getAccount = async (summoner: string) => {
// export const getAccount = async () => {

    const res = await fetch(
        `https://us-central1-lol-apis-c196.cloudfunctions.net/getAccount?summoner=${encodeURIComponent(
            summoner
        )}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        }
        
        // `https://us-central1-lol-apis-c196.cloudfunctions.net/getAccount?summoner=selbull`
    )
    if (!res.ok) throw new Error (`Failed to fetch account ${res.status}`)

    return res.json()
}