import React from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import navProfile from '../../assets/nav-profile.svg'

const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={logo}  alt="" className="" />
      <h1 >S&C MARKETPLACE</h1>
      <img src={navProfile} alt="" className="nav-profile" />
    </div>
  )
}

export default Navbar
