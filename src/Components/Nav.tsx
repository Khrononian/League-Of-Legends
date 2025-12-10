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
            <li>Items</li>
            <li>Accounts</li>
            <Link to={'/items'}></Link>
            <Link to={'/accounts'}></Link>
        </ul>
    </nav>
  )
}

export default Nav