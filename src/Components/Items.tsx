import React, { createElement, useEffect, useState } from 'react'
import Nav from './Nav'
import { HugeiconsIcon } from '@hugeicons/react'
import { GoldIcon } from '@hugeicons/core-free-icons'
import '../styles/Items.css'

type ItemValues = {
    name: string,
    categories: string[],
    inStore: boolean,
    price: number,
    priceTotal: number,
    iconPath: string,
    displayInItemSets: boolean,
    description: string
}

type HoveredItem = {
    iconPath: string,
    name: string,
    priceTotal: number,
    description: string
}

const Items = () => {
    const [items, setItems] = useState({})
    const [hoveredItem, setHoveredItem] = useState<HoveredItem>({
        iconPath: '', 
        name: '', 
        description: '', 
        priceTotal: 0
    })

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
            <div className='items-container'>
                <div className='items-search'>
                    <form id='form' role='search'>
                        <input type='search' id='query'
                            placeholder='Search Items'
                        />
                        <button>Search</button>
                    </form>
                </div>
                <div className='items'>
                    {Object.entries(items).sort(([, a], [, b]) => a.totalPrice - b.totalPrice).map(([index, item]) => {
                        const values = item as ItemValues
                        const wordInString = values.name.trim().split(/\s+/)

                        console.log('INENEEE', item)
                        console.log('IMAGES', values.iconPath)
                        if (values.inStore == true && values.displayInItemSets == true && wordInString[0] !== 'Elixir' && wordInString[1] !== 'Potion') {
                        // if (values.inStore == true && values.active == true) {

                        return (
                            <div key={index} onMouseEnter={() => setHoveredItem(values)} onMouseLeave={() => setHoveredItem({iconPath: '', name: '', description: '', priceTotal: 0})}>
                                <div>
                                    <img src={`https://raw.communitydragon.org/latest/game/assets/items/icons2d/${values.iconPath.split('/').pop()?.toLocaleLowerCase()}`} alt={values.name} />
                                    
                                </div>

                                

                                {/* <div className='block'>
                                    <div>
                                        <div>
                                            <img src='' />
                                        </div>
                                        <h5>{values.name}</h5>
                                        <h5>{hoveredItem.name}</h5>
                                        <p>{hoveredItem.totalPrice}</p>
                                        <p>{values.totalPrice}</p>
                                    </div>
                                    <div>
                                        <p>{values.description}</p>
                                        <p>{hoveredItem.description}</p>
                                    </div>
                                </div> */}

                            </div>
                        )}
                    })}
                </div>

                <div className='block'>
                    <div className='first-block'>
                        <div>
                            <img src={`https://raw.communitydragon.org/latest/game/assets/items/icons2d/${hoveredItem.iconPath.split('/').pop()?.toLocaleLowerCase()}`} />
                        </div>
                        <h5>{hoveredItem.name}</h5>
                        <div>
                            <HugeiconsIcon 
                                size={28}
                                color="#f8e71c"
                                strokeWidth={2}
                                icon={GoldIcon} 
                            />
                            <p>{hoveredItem.priceTotal}</p>
                        </div>
                        
                    </div>
                    <div>
                        <p>{hoveredItem.description}</p>
                    </div>
                </div>

            </div>
        </section>
  )
}

export default Items