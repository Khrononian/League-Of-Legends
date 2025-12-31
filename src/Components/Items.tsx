import React, { useEffect, useRef, useState } from 'react'
import Nav from './Nav'
import { HugeiconsIcon } from '@hugeicons/react'
import { Coins02Icon  } from '@hugeicons/core-free-icons'
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
    const [x, setX] = useState<number >()
    const [y, setY] = useState<number >()
    const refPos = useRef<HTMLDivElement | null>(null)

    

    const getElementPos = (event: React.MouseEvent, data: ItemValues) => {
        const block = document.querySelector('.block') as HTMLElement
        const hoveredTarget = event.currentTarget.getBoundingClientRect()
        const blockRect = block.getBoundingClientRect()

        const observer = new ResizeObserver(entries => {
            const entry = entries[0]
            const height = entry.contentRect.height + 200
            // const y = hoveredTarget.top + window.scrollY
            let y = hoveredTarget.top + window.scrollY - blockRect.height - 8

            

            setX(hoveredTarget.left + window.scrollX)
            setY(y)

            console.log('OBSERVE INNER', height)
        })

        setHoveredItem(data)

        console.log('OBSERVE', event.currentTarget, observer.observe(block))

        // setX(hoveredTarget.left + window.scrollX + -20 )
        // setY(hoveredTarget.top + window.scrollY + -300 )
        
        // console.log('HOVER', event.currentTarget, event.currentTarget.getBoundingClientRect())
     }

    const parseDescription = (desc: string) => {
        const parse = new DOMParser()
        const doc = parse.parseFromString(desc, 'text/html')

        document.querySelector('.block')

        return /<passive/.test(desc) == false && /<br>/.test(desc) == true ? doc.body.innerHTML.replace(/<br\s*\/?>/gi, '') : doc.body.innerHTML
    }

    const clearElementPos = (event) => {
        setHoveredItem({iconPath: '', name: '', description: '', priceTotal: 0})
    }

    useEffect(() => {
        const getItems = async () => {
            const itemData = await fetch(`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json`)
            const itemResponse = await itemData.json()
            // ITEM ICONS
            // const itemIconData = await fetch(`https://raw.communitydragon.org/latest/game/assets/items/icons2d/${NAME_HERE}.png`)
            
            setItems(itemResponse)
            // console.log('ITEMS', itemResponse)
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

                        if (values.inStore == true && values.displayInItemSets == true && wordInString[0] !== 'Elixir' && wordInString[1] !== 'Potion') {
                        // if (values.inStore == true && values.active == true) {
                            console.log('ITEMS', values)
                        return (
                            // <div key={index} onMouseEnter={() => setHoveredItem(values)} onMouseLeave={() => setHoveredItem({iconPath: '', name: '', description: '', priceTotal: 0})}>
                            <div key={index} ref={refPos} onMouseEnter={(event) => getElementPos(event, values)} onMouseLeave={(event) => clearElementPos(event)}>
                                <div>
                                    <img src={`https://raw.communitydragon.org/latest/game/assets/items/icons2d/${values.iconPath.split('/').pop()?.toLocaleLowerCase()}`} alt={values.name} />
                                    
                                </div>
                            </div>
                        )}
                    })}
                </div>

                <div className='block' style={{ top: y, left: x }} id='item-data' >
                    <div className='first-block'>
                        <div className='first-inner'>
                            <img src={`https://raw.communitydragon.org/latest/game/assets/items/icons2d/${hoveredItem.iconPath.split('/').pop()?.toLocaleLowerCase()}`} />
                            <h5>{hoveredItem.name}</h5>
                        </div>
                        
                        <div className='first-inner'>
                            <HugeiconsIcon
                                size={28}
                                color="#f8e71c"
                                strokeWidth={2}
                                icon={Coins02Icon } 
                            />
                            <p>{hoveredItem.priceTotal}</p>
                        </div>
                        
                    </div>
                    <div className='first-data'>
                        <p dangerouslySetInnerHTML={{
                            __html: parseDescription(hoveredItem.description)
                        }}/>
                    </div>
                </div>

            </div>
        </section>
  )
}

export default Items