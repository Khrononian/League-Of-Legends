import React from 'react'
import { Link } from 'react-router-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import { Menu02Icon } from '@hugeicons/core-free-icons'
import '../styles/Nav.css'

const Nav = () => {
  return (
    <nav>
        <ul>
            <div>
                <Link to={'/'}>
                    <img src='https://img.icons8.com/?size=48&id=V1Ja402KSwyz&format=png' />
                </Link>
            </div>
            <div className='nav-middle'>
                <Link to={'/items'}>
                <li>Items</li>
                </Link>
                <Link to={'/accounts/'}>
                    <li>Accounts</li>
                </Link>
            </div>
            <li>
                <HugeiconsIcon 
                    icon={Menu02Icon} 
                    size={27} 
                    color="#ffffff" 
                    strokeWidth={2}
                />
            </li>
        </ul>
    </nav>
  )
}

export default Nav