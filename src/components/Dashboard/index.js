import React from "react";
import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import artChart from "../../images/stats.png";
import userLog from "../../images/userLog.png";

function Dashboard() {
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   const uploadFile = async () => {
  //     try {
  //       // Dispatch the uploadFile action with the appropriate parameters
  //       await dispatch(
  //         UploadFileToServer("testData.txt", "C:/Users/ashacr/Downloads/")
  //       );
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   uploadFile();
  // }, [dispatch]);
  return (
    <div>
      <div className="flex-container">
        <div className="box alert alert-success">
          <div className="heading">
            <h1 className="heading-success">80</h1>
            <h5 className="heading-success">Active Reports</h5>
            <h6 className="heading-date">23rd, January, 2023</h6>
          </div>
        </div>
        <div className="box alert alert-warning">
          <div className="heading">
            <h1 className="heading-warning">23</h1>
            <h5 className="heading-warning">On Hold Reports</h5>
            <h6 className="heading-date">23rd, January, 2023</h6>
          </div>
        </div>
        <div className="box alert alert-danger">
          <div className="heading">
            <h1 className="heading-danger">10</h1>
            <h5 className="heading-danger">Cancelled Reports</h5>
            <h6 className="heading-date">23rd, January, 2023</h6>
          </div>
        </div>
      </div>
      <div className="chart-images">
        <img src={artChart} alt="art chart" />
        <img src={userLog} alt="logs" />
      </div>
    </div>
  );
}

export default Dashboard;
