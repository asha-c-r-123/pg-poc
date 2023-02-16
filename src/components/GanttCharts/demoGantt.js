import React, { useState, useEffect } from "react";
import { Gantt, Task, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { getStartEndDateForProject, formatDate, initTasks } from "../../helper";
import { useDispatch, useSelector } from "react-redux";
import { ViewSwitcher } from "./ViewSwitcher";
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
import AddIconImg from "../../images/plus.svg";
import SearchImg from "../../images/search.svg";
import sortImg from "../../images/sort.svg";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import "./index.scss";

function DemoGantt() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { projectDetails, loading } = useSelector(
    (state) => state.projectDetails
  );
  const usersList = useSelector((state) => state.users);
  const { users } = usersList;
  const tasksList = useSelector((state) => state.projecttasks);
  const [showForm, setShowForm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [view, setView] = useState(ViewMode.Day);
  const [tasks, setTasks] = useState();
  const [taskid, setTaskId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showAddTask, setShowAddTask] = useState(true);
  const [tasksAvailable, setTasksAvailable] = useState(true);
  const [isChecked, setIsChecked] = useState(true);
  const [projectName, setProjectName] = useState([]);
  let columnWidth = 65;
  if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  useEffect(() => {
    if (!isLoaded) {
      dispatch(getTasks(id));
      setIsLoaded(true);
    }
    const currentDate = new Date();
    if (Array.isArray(tasksList)) {
      const formattedTasks = tasksList?.map((task) => {
        const startDate = new Date(task.start);
        const endDate = new Date(task.end);
        // check if start and end dates are valid
        if (isNaN(startDate) || isNaN(endDate)) {
          console.error("Invalid date format");
          return task;
        }

        const endDay = endDate.getDate();
        const startDay = startDate.getDate();
        return {
          ...task,
          start: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            startDay
          ),
          end: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            endDay
          ),
        };
      });

      setTasks(formattedTasks);
    }

    // }
  }, [dispatch, id, isLoaded, tasksList]);

  const updateGant = (clickedTask) => {
    if (!clickedTask) {
      console.error("Error: task is undefined or null");
      return;
    }
    if (!clickedTask.start || !clickedTask.end) {
      console.error("Error: task.start or task.end is undefined");
      return;
    }
    const clickedTaskIndex = tasks.findIndex(
      (task) => task.id === clickedTask.id
    );
    if (clickedTaskIndex === -1) {
      console.error("Error: clicked task not found in tasks array");
      return;
    }
    // if (isEditing) {
    //   console.log(task);
    // Replace the old task with the updated task in the tasks array
    const updatedTasks = [
      ...tasks.slice(0, clickedTaskIndex),
      clickedTask,
      ...tasks.slice(clickedTaskIndex + 1),
    ];
    setTasks(updatedTasks);
    setTaskId(clickedTask.id);
    setShowForm(true);
    setIsEditing(true);
    // setTasksAvailable(false);
    // }
  };

  const addNewTask = () => {
    setShowForm(!showForm);
    setIsEditing(false);
    setTasksAvailable(false);
  };
  const handleCancel = () => {
    setShowForm(false);
  };

  const handleSubmitTask = (newTask) => {
    newTask.type = "task";
    newTask.isDisabled = false;
    newTask.start = new Date(newTask.start).toISOString();
    newTask.end = new Date(newTask.end).toISOString();
    // Use the map function to loop through the tasks array
    // tasks?.map((task, index) => {
    //   if (index % 2 === 0) {
    //     newTask.styles = {
    //       backgroundColor: "#3FB4E8",
    //       backgroundSelectedColor: "#3FB4E8",
    //       progressColor: "#3FB4E8",
    //       progressSelectedColor: "#3FB4E8",
    //       isDisabled: false,
    //     };
    //   } else {
    //     newTask.styles = {
    //       backgroundColor: "#0168BF",
    //       backgroundSelectedColor: "#0168BF",
    //       progressColor: "#0168BF",
    //       progressSelectedColor: "#0168BF",
    //       isDisabled: false,
    //     };
    //   }
    // });

    // console.log(isEditing);
    if (isEditing) {
      newTask.id = taskid;
      dispatch(updateTask({ ...newTask }, id)).then(() => {
        dispatch(getTasks(id));
      });
      setIsEditing(false);
      setShowForm(false);
      setShowAddTask(true);
    } else {
      newTask.id = "Task" + Math.round(Math.random() * 100000000);
      dispatch(addTask({ ...newTask, id: newTask.id }, id)).then(() =>
        dispatch(getTasks(id))
      );
      setShowForm(false);
      setShowAddTask(true);
    }
  };

  const handleTaskChange = (task) => {
    console.log("On date change Id:" + task.id);
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
    setTasks(newTasks);
  };

  const handleTaskDelete = (task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    if (conf) {
      setTasks(tasks.filter((t) => t.id !== task.id));
    }
    return conf;
  };

  const handleProgressChange = async (task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    console.log("On progress change Id:" + task.id);
  };

  const handleDblClick = (task) => {
    alert("On Double Click event Id:" + task.id);
  };

  const handleSelect = (task, isSelected) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id);
  };

  return (
    <div id="ganttChart">
      <div className="task-details-actions">
        <div>
          <h4>{projectName.length ? projectName[0] : projectDetails.name}</h4>
          <span>{projectName[1]}</span>
        </div>
        <p>
          SOS Date -
          {projectDetails.sosDate !== "" || projectDetails.sosDate !== null
            ? formatDate(projectDetails.sosDate)
            : ""}
        </p>
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
              tasksInfo={tasks}
              projectId={id}
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
      {tasks === undefined ? (
        <p>Loading...</p>
      ) : isLoaded && tasks ? (
        <>
          <Gantt
            tasks={tasks}
            viewMode={view}
            onDateChange={handleTaskChange}
            onDelete={handleTaskDelete}
            onProgressChange={handleProgressChange}
            onDoubleClick={handleDblClick}
            onSelect={handleSelect}
            onExpanderClick={handleExpanderClick}
            listCellWidth={isChecked ? "105px" : ""}
            columnWidth={columnWidth}
            ganttHeight={300}
            onClick={(task) => {
              updateGant(task);
            }}
          />
        </>
      ) : (
        tasksAvailable && (
          <p className="no-tasks">
            Tasks are not available, please add new tasks
          </p>
        )
      )}
    </div>
  );
}

export default DemoGantt;
