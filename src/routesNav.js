import React from "react";
import { Route, Routes } from "react-router-dom";
import GantChart from "./chartsGantt.js";
import Home from "./home.js";
import Reports from "./reports.js";
import { Outlet } from "react-router-dom";

const RoutesNav = () => {
  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route index element={<Home />} />
        <Route path="/gant/:id" element={<GantChart />} />
        <Route path="/gant" element={<GantChart />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
    </Routes>
  );
};

export default RoutesNav;
