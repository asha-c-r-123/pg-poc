import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";
import { Container, Navbar } from "react-bootstrap";
import SideBar from "../SideBar";
import NotificationImg from "../../images/notification.svg";
import UserImg from "../../images/user.svg";

function PageLayout(props) {
  // const dispatch = useDispatch();
  // const [tasks, setTasks] = useState([]);
  // useEffect(() => {
  //   dispatch(getUsers()).then((response) => setTasks(response?.data))
  // }, [dispatch]);
  return (
    <div className="wrapper">
      <div className="sidebar">
        <SideBar />
      </div>
      <div className="main-content">
        <Navbar>
          <Container>
            <h2>
              Welcome Back,Lucas! <span>16th, January, 2023 </span>
            </h2>
            <div className="notifications">
              <img src={NotificationImg} alt="notificaitons" />
              <span>
                <span className="short-name">Lucas</span>
                <span className="short-id"> @lucas41</span>
              </span>
              <img src={UserImg} alt="user" />
            </div>
          </Container>
        </Navbar>
        <div className="sub-container">{props.children}</div>
      </div>
    </div>
  );
}
export default PageLayout;
