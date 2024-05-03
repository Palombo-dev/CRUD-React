import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../components/home/Home";
import UserCrud from "../components/user/userCrud";
import StateCrud from "../components/state/stateCrud";
import TradeCrud from "../components/trade/tradeCrud";

export default props =>
    <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/users" element={<UserCrud /> } />
        <Route path="/states" element={<StateCrud /> } />
        <Route path="/trades" element={<TradeCrud /> } />
        <Route path="*" element={<Home />} />
    </Routes>