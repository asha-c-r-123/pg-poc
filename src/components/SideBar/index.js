import React, { useState, useEffect } from "react";
import { Nav, NavItem } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import PGLogo from "../../images/logo.svg";
import { useLocation } from "react-router-dom";
import SetttingsImg from "../../images/setting.svg";
import ReportsImg from "../../images/reports.svg";
import DashboardImg from "../../images/dashboard.svg";
import ChartImg from "../../images/charts.svg";
import logoutImg from "../../images/logout.svg";
import "./index.scss";
import AddButton from "../AddButton";
import AddProject from "../Dashboard/AddProject";

function Sidebar() {
  //   const [open, setOpen] = useState(false);
  // const sidebarClick=()=>{
  //   console.log(open);
  //   setOpen(!open)
  // }
  // const { user, error, isLoading, signIn, signOut } = useAuth();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("/");
  const [isAdd, setIsAdd] = useState(false);
  const [selectedProject, setSelectedProject] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const handleAdd = () => {
    setIsAdd(true);
    setSelectedProject(null);
    setModalOpen(true);
  };
  const togglePopModal = () => {
    setModalOpen(!modalOpen);
  };
  useEffect(() => {
    if (modalOpen) {
      setIsAdd(true);
      setSelectedProject(null);
    }
  }, [modalOpen]);
  useEffect(() => {
    if (location.pathname.includes("/gant")) {
      setActiveItem("gant");
    }
  }, [location.pathname]);

  const navItems = {
    data: [
      {
        name: "Dashboard",
        url: "/",
        img: DashboardImg,
      },
      {
        name: "Reports",
        url: "/reports",
        img: ChartImg,
      },
      {
        name: "Gant",
        url: "/gant",
        img: ReportsImg,
      },
      // {
      //   name: "Scope",
      //   url: "/scope",
      //   img: ScopeImg,
      // },
      {
        name: "Settings",
        url: "/settings",
        img: SetttingsImg,
      },
    ],
  };

  return (
    <div className="sidebar">
      <div className="pg-logo">
        <img src={PGLogo} alt="PG LOGO" />
      </div>
      <Nav className="flex-column">
        {navItems?.data?.map((item, index) => (
          <NavItem key={index}>
            <NavLink
              to={item.url}
              className={`nav-link ${
                activeItem === item.name.toLowerCase() ? "active" : ""
              }`}
            >
              <img src={item.img} alt="logos" />
              <span>{item.name} </span>
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <div>
        <ul className="logout">
          <li>
            <AddButton handleAdd={handleAdd} />
            <AddProject
              isAdd={isAdd}
              selectedProject={selectedProject}
              toggleModal={setModalOpen}
              showPopModal={modalOpen}
              togglePopModal={togglePopModal}
              setSelected={setSelectedProject}
            />
          </li>
          <li>
            <a>
              <img src={logoutImg} alt="SetttingsImg" /> <span>Logout</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    // {/*
    //       <div className={`sidebar ${open ? 'open' : 'closed'}`}>
    //       <button onClick={sidebarClick}>Toggle</button>
    //       <div className={`sidebar ${open ? 'open' : 'closed'}`}></div>
    //        {open ? <h4>open</h4>:<h4>closed</h4>}
    //         <p>This is the sidebar.</p>
    //     </div> */}
  );
}

export default Sidebar;
