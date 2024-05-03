import './Nav.css'
import React from 'react'
import { Link } from 'react-router-dom'

export default props =>
    <aside className="menu-area">
        <nav className="menu">
            <Link to="/">
                <i className="fa fa-home"></i>Início
            </Link>
            <Link to="/users">
                <i className="fa fa-users"></i>Usuários
            </Link>
            <Link to="/states">
                <i className="fa fa-address-book-o"></i>Estados
            </Link>
            <Link to="/trades">
                <i className="fa fa-calculator"></i>negociação
            </Link>
        </nav>
    </aside>