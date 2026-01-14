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
    const [x, setX] = useState<number >(0)
    const [y, setY] = useState<number >(0)
    const [display, setDisplay] = useState(false)
    const refPos = useRef<HTMLDivElement | null>(null)
    const toolTipRef = useRef<HTMLDivElement>(null)
    const parentRef = useRef<HTMLDivElement>(null)


    const getElementPos = (event: React.MouseEvent, data: ItemValues) => {
        const hoveredTarget = event.currentTarget.getBoundingClientRect()
        const toolTipRect = toolTipRef.current?.getBoundingClientRect()
        const imgName = event.currentTarget.querySelector('div')?.querySelector('h5')
        
        const viewPortWidth = window.innerWidth;
        const viewPortHeight = window.innerHeight;
        const spaceRight = viewPortWidth - hoveredTarget.right
        // const side = spaceRight >= 260 ? 'right' : 'left'
        const side = spaceRight >= 300 ? 'right' : 'left'
        const spaceTop = viewPortHeight - hoveredTarget.top
        // const top = spaceTop >= 285 ? 'bottom' : 'top'
        const top = spaceTop >= 350 ? 'bottom' : 'top'

        if (display == true) return
        
        setX(side == 'right' ? hoveredTarget.right - 10 : hoveredTarget.left - 260 - 8)
        // setY(top == 'bottom' ? hoveredTarget.top - 150 + window.scrollY : hoveredTarget.bottom - 285 - toolTipRect?.height + window.scrollY)
        // setY(top == 'bottom' && imgName != 'Dream Maker' ? hoveredTarget.top - 150 + window.scrollY : hoveredTarget.bottom - ((window.innerHeight / 2.1) - toolTipRect?.height) + window.scrollY)
        setY(top == 'bottom' ? hoveredTarget.top - 150 + window.scrollY : hoveredTarget.bottom - ((window.innerHeight / 2.1) - toolTipRect?.height) + window.scrollY)
        console.log('SET NEW', x, y)
        console.log('VALUESW', x, y, viewPortWidth, spaceRight, hoveredTarget.right)
        console.log('HEIGHT VALUES', viewPortHeight, spaceTop, top, toolTipRect?.height, hoveredTarget.bottom)
        
        setHoveredItem(data)
        setDisplay(true)
     }

    const parseDescription = (desc: string) => {
        const parse = new DOMParser()
        const doc = parse.parseFromString(desc, 'text/html')

        document.querySelector('.block')

        return /<passive/.test(desc) == false && /<br>/.test(desc) == true ? doc.body.innerHTML.replace(/<br\s*\/?>/gi, '') : doc.body.innerHTML
    }

    const clearElementPos = () => {
        setHoveredItem({iconPath: '', name: '', description: '', priceTotal: 0})
        setDisplay(false)
        console.log('SET', x, y)
        // setX(0)
        // setY(0)
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
            <div ref={parentRef} className='items-container' >
                <div className='items-search'>
                    <form id='form' role='search'>
                        <input type='search' id='query'
                            placeholder='Search Items'
                        />
                        <button>Search</button>
                    </form>
                </div>
                <div className='items'>
                    {Object.entries(items).sort(([, a], [, b]) => a.priceTotal - b.priceTotal).map(([index, item]) => {
                        const values = item as ItemValues
                        const wordInString = values.name.trim().split(/\s+/)

                        if (values.inStore == true && values.displayInItemSets == true && wordInString[0] !== 'Elixir' && wordInString[1] !== 'Potion') {
                        // if (values.inStore == true && values.active == true) {
                            // console.log('ITEMS', values)
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

                <div ref={toolTipRef} className={`block ${display ? 'showDiv' : 'hideDiv'}`} style={{ top: y, left: x }} id='item-data' >
                    <div className='first-block'>
                        <div className='first-inner'>
                            <img src={`https://raw.communitydragon.org/latest/game/assets/items/icons2d/${hoveredItem.iconPath.split('/').pop()?.toLocaleLowerCase()}`} />
                            <h5>{hoveredItem.name}</h5>
                        </div>
                        
                        <div className='first-inner'>
                            <HugeiconsIcon
                                size={28}
                                color="#C8AA6E"
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