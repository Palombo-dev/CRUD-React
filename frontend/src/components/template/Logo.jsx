import './Logo.css'
import logo from '../../assets/imgs/react-logo.png'
import React from 'react'
import '../../main/App.css'

export default props =>
    <aside ClassName="logo">
        <a href="/" className="logo">
            <img src={logo} alt="logo" />
        </a>
    </aside>