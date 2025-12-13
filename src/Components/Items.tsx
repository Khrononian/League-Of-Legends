import React, { useEffect, useState } from 'react'
import Nav from './Nav'

type ItemValues = {
    name: string,
    categories: string[],
    inStore: boolean,
    price: number,
    priceTotal: number
    iconPath: string
}

const Items = () => {
    const [items, setItems] = useState({})

    useEffect(() => {
        const getItems = async () => {
            const itemData = await fetch(`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json`)
            const itemResponse = await itemData.json()
            // ITEM ICONS
            // const itemIconData = await fetch(`https://raw.communitydragon.org/latest/game/assets/items/icons2d/${NAME_HERE}.png`)
            
            setItems(itemResponse)
            console.log('ITEMS', itemResponse)
            for (let i = 0; i < itemResponse.length; i++) {
                
                if (itemResponse[i].inStore == true) console.log('AFTER ITS', itemResponse[i])
            }
        }   

        getItems()
    }, [])

    return (
        <section>
            <Nav />
            <div>
                <form id='form' role='search'>
                    <input type='search' id='query'
                        placeholder='Search Items'
                    />
                    <button>Search</button>
                </form>
            </div>
            {Object.entries(items).map(([index, item]) => {
                const values = item as ItemValues
                console.log('INENEEE', item)
                console.log('IMAGES', values.iconPath)
                if (values.inStore == true) {
                    return (
                        <div key={index}>
                            <div>
                                <img src={`https://raw.communitydragon.org/latest/game/assets/items/icons2d/${values.iconPath.split('/').pop()?.toLocaleLowerCase()}`} alt={values.name} />
                                {values.name}
                            </div>
                            
                        </div>
                    )
                }
                
            })}
        </section>
  )
}

export default Items