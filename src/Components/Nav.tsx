import React from 'react'
import { Link } from 'react-router-dom'

const Nav = () => {
  return (
    <nav>
        <ul>
            <div>
                <Link to={'/'}>
                    <img src='' />
                </Link>
            </div>
            <Link to={'/items'}>
                <li>Items</li>
            </Link>
            <Link to={'/accounts/:selbullNA1'}>
                <li>Accounts</li>
            </Link>
        </ul>
    </nav>
  )
}

export default Nav