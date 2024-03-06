import './Logo.css'
import logo from '../../assets/imgs/react-logo.png'
import React from 'react'
import '../../main/App.css'
import { Link } from 'react-router-dom'

export default props =>
    <aside ClassName="logo">
        <Link to="/" className="logo">
            <img src={logo} alt="logo" />
        </Link>
    </aside>