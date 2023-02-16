import React from "react";
import "gantt-task-react/dist/index.css";
import { ViewMode } from "gantt-task-react";
import Dropdown from "react-bootstrap/Dropdown";

export const ViewSwitcher = ({
  onViewModeChange,
  onViewListChange,
  isChecked,
}) => {
  return (
    <div className="ViewContainer">
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic" className="filter-table">
          Sort By
        </Dropdown.Toggle>
        {/* <Button className="sort-table">
          Sort By <img src={sortImg} alt="sort" />
        </Button> */}
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => onViewModeChange(ViewMode.Hour)}>
            Hour
          </Dropdown.Item>
          {/* <Dropdown.Item onClick={() => onViewModeChange(ViewMode.QuarterDay)}>
            Quarter of Day
          </Dropdown.Item> */}
          {/* <Dropdown.Item onClick={() => onViewModeChange(ViewMode.HalfDay)}>
            Half of Day
          </Dropdown.Item> */}
          <Dropdown.Item onClick={() => onViewModeChange(ViewMode.Day)}>
            Day
          </Dropdown.Item>
          <Dropdown.Item onClick={() => onViewModeChange(ViewMode.Week)}>
            Week
          </Dropdown.Item>
          <Dropdown.Item onClick={() => onViewModeChange(ViewMode.Month)}>
            Month
          </Dropdown.Item>
          <Dropdown.Item onClick={() => onViewModeChange(ViewMode.Year)}>
            Year
          </Dropdown.Item>
          {/* <Dropdown.Item onClick={() => onViewModeChange(ViewMode.QuarterYear)}>
            Quarter Year
          </Dropdown.Item> */}
        </Dropdown.Menu>
      </Dropdown>
      {/* <div className="Switch">
        <label className="Switch_Toggle">
          <input
            type="checkbox"
            defaultChecked={isChecked}
            onClick={() => onViewListChange(!isChecked)}
          />
          <span className="Slider" />
        </label>
        Show Task List
      </div> */}
    </div>
  );
};
