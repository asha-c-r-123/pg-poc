import React, { useState, useEffect } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getTasks,
  addTask,
  updateTask,
  deleteAllTasks,
} from "../../store/actions/TaskActions";
import { getUsers } from "../../store/actions/UserActions";
import { getProjectDetails } from "../../store/actions/GanttActions";
import { useParams } from "react-router-dom";
import AddTask from "./AddTask";
import { ViewSwitcher } from "./ViewSwitcher";
import AddIconImg from "../../images/plus.svg";
import { getStartEndDateForProject, formatDate } from "../../helper";
import SearchImg from "../../images/search.svg";
import sortImg from "../../images/sort.svg";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import "./index.scss";

function GanttCharts() {
  const dispatch = useDispatch();
  const { projectDetails, loading } = useSelector(
    (state) => state.projectDetails
  );
  const usersList = useSelector((state) => state.users);
  const { users } = usersList;
  const [showForm, setShowForm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { id } = useParams();
  const tasksData = useSelector((state) => state.projecttasks);
  const [task, setTask] = useState([]);
  const [taskid, setTaskId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showAddTask, setShowAddTask] = useState(true);
  const [tasksAvailable, setTasksAvailable] = useState(true);
  const [view, setView] = useState(ViewMode.Week);
  const [isChecked, setIsChecked] = useState(true);
  const [projectName, setProjectName] = useState([]);
  const [projectId, setProjectId] = useState(id);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [formattedTasks, setFormattedTasks] = useState([]);
  // useEffect(() => {
  //   window.addEventListener("load", handleLoad);
  //   return () => {
  //     window.removeEventListener("load", handleLoad);
  //   };
  // }, []);

  // const handleLoad = () => {
  //   setTimeout(() => {
  //     const elements = document.querySelectorAll("._34SS0");
  //     if (!elements) return;

  //     const rows = document.querySelectorAll(".rows");
  //     rows.forEach((row) => {
  //       row.querySelectorAll("rect").forEach((rect) => {
  //         rect.setAttribute("height", "100");
  //       });
  //     });
  //     const weekElements = document.querySelectorAll("._9w8d5");
  //     weekElements.forEach((weekElement) => {
  //       if (!weekElement.textContent.startsWith("Week")) {
  //         const weekNumber = weekElement.textContent.substring(1);
  //         weekElement.textContent = `Week ${weekNumber}`;
  //       }
  //     });
  //     const taskOwner = document.querySelectorAll("._3zRJQ");
  //     const taskOwner1 = document.querySelectorAll("._3KcaM");

  //     // task?.map((task) => {
  //     taskOwner.forEach((weekElement) => {
  //       weekElement.textContent = "ownerName";
  //     });
  //     // });

  //     Array.from(elements).forEach((element, index) => {
  //       element.setAttribute("id", `element-${index}`);
  //       const children = element.querySelectorAll("._3lLk3");
  //       if (index !== 0) {
  //         children[1].style.display = "none";
  //         children[2].style.display = "none";
  //         element.classList.remove("open");
  //         element.classList.add("closed");
  //       } else {
  //         children[1].style.display = "block";
  //         children[2].style.display = "block";
  //         element.classList.remove("closed");
  //         element.classList.add("open");
  //       }
  //       element.addEventListener("click", (event) => {
  //         children[1].style.display =
  //           children[1].style.display === "none" ? "block" : "none";
  //         children[2].style.display =
  //           children[2].style.display === "none" ? "block" : "none";
  //         if (element.classList.contains("open")) {
  //           element.classList.remove("open");
  //           element.classList.add("closed");
  //         } else {
  //           element.classList.remove("closed");
  //           element.classList.add("open");
  //         }
  //       });

  //       // Add "Start Date" and "End Date" text and change the date format for the second and third child elements
  //       for (let i = 1; i <= 2; i++) {
  //         const child = children[i];
  //         const dateString = child.textContent.trim();
  //         const date = new Date(dateString);
  //         const options = {
  //           day: "numeric",
  //           month: "short",
  //           year: "numeric",
  //         };
  //         const formattedDate = date.toLocaleDateString("en-US", options);
  //         child.innerHTML = `<span style="font-weight: bold;">${
  //           i === 1 ? "Start Date: " : "End Date: "
  //         }</span>${formattedDate}`;
  //       }
  //     });
  //   }, 1000);
  // };

  useEffect(() => {
    setTimeout(() => {
      // dispatch(getProjectDetails(id));
      dispatch(getProjectDetails(projectId));
    }, 100);
  }, [dispatch, id, projectId]);

  let columnWidth = 65;
  if (view === ViewMode.Year) {
    columnWidth = 350;
  } else if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }
  useEffect(() => {
    if (!isLoaded) {
      dispatch(getTasks(projectId));
      setIsLoaded(true);
    }
  }, [dispatch, isLoaded, projectId]);

  const tasks = useSelector((state) => state?.tasks);

  useEffect(() => {
    if (!tasks) {
      // no tasks
      setFormattedTasks([]);
    } else if (typeof tasks === "object" && Object.keys(tasks).length > 1) {
      // multiple tasks
      const formatted = Object.values(tasks)[0]
        .map((task) => {
          const startMonth = parseInt(task?.StartDate?.slice(4, 6));
          const endMonth = parseInt(task?.EndDate?.slice(4, 6));
          if (isNaN(startMonth) || isNaN(endMonth) || !task.StartDate) {
            // Skip tasks with invalid dates
            return null;
          }
          const startDate = new Date(task?.StartDate);
          const endDate = new Date(task?.EndDate);
          console.log(startDate, endDate);
          return {
            ...task,
            StartDate: startDate,
            EndDate: endDate,
          };
        })
        .filter((task) => task !== null);
      setFormattedTasks(formatted);
      console.log(formatted);
    }
  }, [tasks]);

  useEffect(() => {
    setIsLoaded(true);
    dispatch(getUsers()).then(() => {
      setIsLoaded(false);
    });
  }, [dispatch]);

  const updateGant = (task) => {
    if (!task) {
      console.error("Error: task is undefined or null");
      return;
    }
    if (!task.StartDate || !task.EndDate) {
      console.error("Error: task.start or task.end is undefined");
      return;
    }
    // if (isEditing) {
    //   console.log(task);
    setTaskId(task.id);
    setTask(task); // update task state variable
    setShowForm(!showForm);
    setIsEditing(true);
    setShowAddTask(false);
    // }
  };

  const handleSubmitTask = (newTask) => {
    newTask.type = "task";
    newTask.isDisabled = false;
    // Use the map function to loop through the tasks array
    tasks.map((task, index) => {
      if (index % 2 === 0) {
        newTask.styles = {
          backgroundColor: "#3FB4E8",
          backgroundSelectedColor: "#3FB4E8",
          progressColor: "#3FB4E8",
          progressSelectedColor: "#3FB4E8",
        };
      } else {
        newTask.styles = {
          backgroundColor: "#0168BF",
          backgroundSelectedColor: "#0168BF",
          progressColor: "#0168BF",
          progressSelectedColor: "#0168BF",
        };
      }
    });

    // console.log(isEditing);

    if (isEditing) {
      newTask.id = taskid;
      // dispatch(updateTask({ ...newTask }, id)).then(() => {
      //   dispatch(getTasks(id));
      dispatch(updateTask({ ...newTask }, projectId)).then(() => {
        dispatch(getTasks(projectId));
      });
      setIsEditing(false);
      setShowForm(false);
      setShowAddTask(true);
    } else {
      newTask.id = "Task" + Math.round(Math.random() * 100000000);
      // dispatch(addTask({ ...newTask, id: newTask.id }, id)).then(() =>
      //   dispatch(getTasks(id))
      dispatch(addTask({ ...newTask, id: newTask.id }, projectId)).then(() =>
        dispatch(getTasks(projectId))
      );
      setShowForm(false);
      setShowAddTask(true);
    }
  };
  const addNewTask = () => {
    setShowForm(!showForm);
    setIsEditing(false);
    setTasksAvailable(false);
  };
  const handleCancel = () => {
    setShowForm(false);
  };
  const handleTaskChange = (task) => {
    // console.log("On date change Id:" + task.id);
    let newTasks = tasks.map((t) => (t.id === task.id ? task : t));
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project);
      const project =
        newTasks[newTasks.findIndex((t) => t.id === task.project)];
      if (
        project.start.getTime() !== start.getTime() ||
        project.end.getTime() !== end.getTime()
      ) {
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map((t) =>
          t.id === task.project ? changedProject : t
        );
      }
    }
    setTask(newTasks);
  };
  const handleProgressChange = async (task) => {
    setTask(tasks.map((t) => (t.id === task.id ? task : t)));
    // console.log("On progress change Id:" + task.id);
  };

  const handleSelect = (task, isSelected) => {
    // console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task) => {
    setTask(tasks.map((t) => (t.id === task.id ? task : t)));
    // console.log("On expander click Id:" + task.id);
  };

  const onChangeProject = (projectId, prjName, prjOwner) => {
    dispatch(getTasks(projectId));
    setProjectId(projectId);
    setProjectName([prjName, prjOwner]);
  };
  const dropdownchange = (projectId, prjName, prjOwner) => {
    // alert(`Hi! you chosen: ${prjName}`);
    onChangeProject(projectId, prjName, prjOwner);
  };
  return (
    <div id="ganttChart">
      <div className="task-details-actions">
        <div>
          <h4>
            {projectName.length ? projectName[0] : projectDetails.ProjectName}
          </h4>
          <span>{projectName[1]}</span>
        </div>

        {/* <div className="search-table">
          <input
            type="search"
            placeholder="Search"
            id="searchBox"
            // value={search}
            // onChange={handleSearch}
          />
          <img src={SearchImg} alt="search" id="searchIcon" />
        </div> */}
        <p>SOS Date -{projectDetails.EstimatedSOS}</p>
        {/* <div className="search-header">
          <Button className="filter-table">
            Filter By <img src={sortImg} alt="sort" />
          </Button>
        </div> */}

        <div>
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" className="filter-table">
              {projectName.length
                ? projectName[0]
                : projectDetails && projectDetails.ProjectName
                ? projectDetails.ProjectName
                : users.length
                ? users[0].ProjectName
                : "select project"}

              {/* <img src={sortImg} alt="sort" /> */}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {users.map((user, index) => (
                <Dropdown.Item
                  key={index}
                  eventKey={user.ProjectName}
                  onClick={() =>
                    onChangeProject(user.RecordID, user.ProjectName, user.PM)
                  }
                >
                  {user.ProjectName}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <ViewSwitcher
          onViewModeChange={(viewMode) => setView(viewMode)}
          onViewListChange={setIsChecked}
          isChecked={isChecked}
        />
        <div className="task-actions">
          {
            <button
              onClick={addNewTask}
              type="button"
              id="add-task"
              className="btn btn-primary"
            >
              <img src={AddIconImg} alt="Add" /> Add New Task
            </button>
          }
          {showForm && (
            <AddTask
              tasksInfo={task}
              projectId={projectId}
              handleSubmitTask={handleSubmitTask}
              isEditing={isEditing}
              updateGant={updateGant}
              setIsEditing={setIsEditing}
              showForm={showForm}
              handleCancel={handleCancel}
              rtl={true}
              ganttHeight={1000}
            />
          )}
        </div>
      </div>
      {/* {
        formattedTasks == null ? (
          <p>Loading...</p>
        ) : (
          // : isLoaded && tasks && tasks.length > 0 ? (
          <>
            <Gantt
              tasks={formattedTasks}
              viewMode={view}
              taskLabel={(task) => task.owner}
              onClick={(task) => {
                updateGant(task);
              }}
              onDateChange={handleTaskChange}
              onProgressChange={handleProgressChange}
              listCellWidth={isChecked ? "140px" : ""}
              columnWidth={columnWidth}
              onSelect={handleSelect}
              onExpanderClick={handleExpanderClick}
            />
          </>
        )

        //  : (
        // tasksAvailable && (
        //   <p className="no-tasks">
        //     Tasks are not available, please add new tasks
        //   </p>
        // )
        // )
      } */}
      {formattedTasks.some(
        (task) =>
          task === null ||
          task.StartDate === undefined ||
          task.EndDate === undefined
      ) ? (
        <div>Invalid task dates</div>
      ) : formattedTasks.every(
          (task) =>
            task !== null &&
            task.StartDate !== undefined &&
            task.EndDate !== undefined
        ) ? (
        // <Gantt
        //   tasks={formattedTasks}
        //   viewMode={view}
        //   taskLabel={(task) => task.owner}
        //   onClick={(task) => {
        //     updateGant(task);
        //   }}
        //   onDateChange={handleTaskChange}
        //   onProgressChange={handleProgressChange}
        //   listCellWidth={isChecked ? "140px" : ""}
        //   columnWidth={columnWidth}
        //   onSelect={handleSelect}
        //   onExpanderClick={handleExpanderClick}
        // />
        <p>gann</p>
      ) : (
        <div>Some tasks have invalid dates</div>
      )}

      {/* {formattedTasks &&
        formattedTasks.length > 0 &&
        console.log("test", formattedTasks)}
      {formattedTasks && formattedTasks.length > 0 ? (
        <div>
          {formattedTasks[0].map((task) => (
            <div>{task?.TaskName}</div>
          ))}
        </div>
      ) : (
        <div>Loading...</div>
      )} */}
    </div>
  );
}

export default GanttCharts;
