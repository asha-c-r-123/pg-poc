import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsers,
  deleteRow,
  deleteAllRows,
} from "../../../store/actions/UserActions";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { Dropdown, DropdownButton } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import AddProject from "../AddProject";
import EditImg from "../../../images/edit.svg";
import DeleteImg from "../../../images/delete.svg";
import HideEditImg from "../../../images/hideedit.svg";
import HideDeleteImg from "../../../images/hidedelete.svg";
import AttchFileImg from "../../../images/fileattach.svg";
import SearchImg from "../../../images/search.svg";
import sortImg from "../../../images/sort.svg";
import ReportsImg from "../../../images/activeChart.svg";
import HideReportsImg from "../../../images/reports.svg";
import activeFileImg from "../../../images/activefile.svg";
import "./index.scss";
import CustomPagination from "../../Pagination";
import ExportCSV, { ExportSelectedRows } from "../../ExportCSV";
import { formatDate, downloadFile } from "../../../helper";
import { OverlayTrigger } from "react-bootstrap";
import { TooltipProjectName } from "../../Tooltip";
import AddButton from "../../AddButton";
import DeleteModal from "./DeleteModal";
import FilterModal from "./FilterModal";

function DashboardTable() {
  const dispatch = useDispatch();
  const history = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const usersList = useSelector((state) => state.users);
  const { users, error } = usersList;
  const [isAdd, setIsAdd] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItems, setCurrentItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState("asc");
  const [sortField, setSortField] = useState("id");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  // const totalPages = 8;

  const itemsPerPage = 5;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const handleAdd = () => {
    setIsAdd(true);
    setShowModal(true);
  };

  const handleClick = (projectId) => {
    history(`/gant/${projectId}`);
  };
  const handleDelete = async (id) => {
    setDeleteMessage("delete it");
    setSelectedProject(id);
    setShowDeleteModal(true);
    setSelectedIds(id);
  };

  const handleDeleteAll = () => {
    setShowDeleteModal(true);
    setDeleteMessage("delete multiple records");
    setSelectedIds(selected.map((item) => item.id));
  };
  const handleModalDelete = async () => {
    if (Array.isArray(selectedIds)) {
      await dispatch(deleteAllRows(selectedIds));
    } else {
      await dispatch(deleteRow(selectedIds));
    }
    setSelectedIds(null);
    setShowModal(false);
    const updatedUsers = await dispatch(getUsers());
    if (
      currentPage === totalPages &&
      (updatedUsers.length - (selectedIds ? selectedIds.length : 1)) /
        itemsPerPage <
        currentPage
    ) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleFilterStatus = (status) => {
    setSelectedStatus(status);
    setShowFilter(false);
  };
  useEffect(() => {
    setLoading(true);
    dispatch(getUsers()).then(() => {
      setLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      let filteredUsers =
        selectedStatus !== ""
          ? selectedStatus === "all"
            ? [...users]
            : users.filter((user) => user.status === selectedStatus)
          : [...users];
      if (users.length === 0) {
        return;
      }
      filteredUsers = filteredUsers.filter((user) =>
        Object.values(user).some(
          (val) =>
            typeof val === "string" &&
            val.toLowerCase().includes(search.toLowerCase())
        )
      );

      if (filteredUsers.length) {
        filteredUsers.sort((a, b) => {
          if (sortType === "asc") {
            return a[sortField] > b[sortField] ? 1 : -1;
          } else {
            return a[sortField] < b[sortField] ? 1 : -1;
          }
        });
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        setCurrentItems(filteredUsers.slice(indexOfFirstItem, indexOfLastItem));
      } else {
        console.error("No data available");
      }
    }
  }, [
    loading,
    selectedStatus,
    sortType,
    sortField,
    search,
    currentPage,
    itemsPerPage,
    users,
  ]);
  const handleEdit = (project) => {
    setSelectedProject(project);
    setSelected([project]);
    setIsAdd(false);
    setShowModal(true);
  };
  const handleSort = (field) => {
    setSortField(field);
    setSortType(sortType === "asc" ? "desc" : "asc");
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(users);
    } else {
      setSelected([]);
    }
    setSelectAllChecked(e.target.checked);
  };

  const handleSelect = (item) => {
    if (selected?.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  // check if all item are selected or not
  useEffect(() => {
    if (users.length !== selected.length) {
      setSelectAllChecked(false);
    }
  }, [users, selected, selectAllChecked]);

  useEffect(() => {
    if (!showModal) {
      setSelectAllChecked(false);
      setSelected([]);
    }
  }, [showModal]);

  const projectData = loading ? (
    <tr className="no-records">
      <td colSpan={11}>Loading...</td>
    </tr>
  ) : error ? (
    <tr className="no-records">
      <td colSpan={12}>No Records Found</td>
    </tr>
  ) : currentItems?.length > 0 ? (
    currentItems?.map((item, index) => {
      return (
        <tr
          key={index}
          className={selected?.includes(item) ? "row-active" : ""}
        >
          <td>
            <input
              type="checkbox"
              checked={selected?.includes(item)}
              onChange={() => handleSelect(item)}
            />
          </td>
          <td>
            <TooltipProjectName name={`PRJ-${item.RecordID}`} />
          </td>
          <td>
            <TooltipProjectName name={item.ProjectName} />
          </td>
          <td>{item.ArtworkCount}</td>
          <td>
            {item.ProjectStartDate
              ? (() => {
                  const startDate = new Date(item.ProjectStartDate);
                  if (isNaN(startDate.getTime())) {
                    return "";
                  } else {
                    return formatDate(item.ProjectStartDate);
                  }
                })()
              : ""}
          </td>
          <td>
            {item.ProjectEndDate
              ? (() => {
                  const endDate = new Date(item.ProjectEndDate);
                  if (isNaN(endDate.getTime())) {
                    return "";
                  } else {
                    return formatDate(item.ProjectEndDate);
                  }
                })()
              : ""}
          </td>
          <td>
            {item.EstimatedSOS
              ? (() => {
                  const sosDate = new Date(item.EstimatedSOS);
                  if (isNaN(sosDate.getTime())) {
                    return "";
                  } else {
                    return formatDate(item.EstimatedSOS);
                  }
                })()
              : ""}
          </td>
          <td>
            {item.EstimatedSOS || item.ProjectEndDate
              ? (() => {
                  const startDate = new Date(item.ProjectStartDate);
                  const endDate = new Date(item.ProjectEndDate);
                  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    return "";
                  } else {
                    return (
                      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) +
                      1
                    );
                  }
                })()
              : ""}
          </td>
          <td>
            <TooltipProjectName name={item.UpdateTime} />
          </td>
          <td className="status-pg">
            {item.Status === "cancelled" && (
              <span className="cancelled-status">Cancelled</span>
            )}
            {item.Status === "active" && (
              <span className="active-status">Active</span>
            )}
            {item.Status === "onhold" && (
              <span className="onhold-status">On Hold</span>
            )}
          </td>
          <td>{item.Approved}</td>
          <td>
            <TooltipProjectName name={item.PM} />
          </td>
          <td>
            <TooltipProjectName name={item.EstimatedAWPrinter} />
          </td>

          <td>File Name</td>
          {/* <td>{item.artworkFiles.map((file) => file.Name)}</td> */}
          {/* <td>
            {item.EstimatedAWPrinter !== "" || item.EstimatedAWPrinter !== null
              ? formatDate(item.EstimatedAWPrinter)
              : ""}
          </td> */}
          {/* <td>
            <ul>
              {Array.isArray(item?.filename)
                ? item?.filename?.map((file, index) => (
                    <li onClick={() => downloadFile(file)} key={index}>
                      {file.name}
                    </li>
                  ))
                : item?.filename}
              {Object.keys(item?.filename).length > 0 && (
                <img
                  src={selected?.includes(item) ? activeFileImg : AttchFileImg}
                  alt="file name"
                  className="attch-file"
                />
              )}
            </ul>
          </td> */}
          <td>
            <div className="actions">
              <img
                src={
                  selected.length === 1 && selected?.includes(item)
                    ? EditImg
                    : HideEditImg
                }
                alt="Edit Row"
                onClick={() => handleEdit(item)}
                className={`action-icons ${
                  selected.length === 1 && selected?.includes(item)
                    ? "enabled"
                    : "disabled"
                }`}
              />
              <img
                src={
                  selected.length === 1 && selected?.includes(item)
                    ? DeleteImg
                    : HideDeleteImg
                }
                alt="Edit Row"
                onClick={() => handleDelete(item.id)}
                className={`action-icons ${
                  selected.length === 1 && selected?.includes(item)
                    ? "enabled"
                    : "disabled"
                }`}
              />

              <img
                src={
                  selected.length === 1 && selected?.includes(item)
                    ? ReportsImg
                    : HideReportsImg
                }
                alt="gantt chart"
                onClick={() => handleClick(item.RecordID)}
                className={`action-icons  ${
                  selected.length === 1 && selected?.includes(item)
                    ? "enabled"
                    : "disabled"
                }`}
              />

              {/* <span
                className={
                  selected.length === 1 && selected?.includes(item)
                    ? "enabled"
                    : "disabled"
                }
              >
                <ExportCSV data={item} index={index} />
              </span> */}
            </div>
          </td>
        </tr>
      );
    })
  ) : (
    <tr className="no-records">
      <td colSpan={12}>No Records Found</td>
    </tr>
  );
  return (
    <>
      <div>
        <div className="table-filters">
          <div className="search-header">
            <h3>Reports</h3>
            <div className="search-table">
              <input
                type="search"
                placeholder="Search"
                id="searchBox"
                value={search}
                onChange={handleSearch}
              />
              <img src={SearchImg} alt="search" id="searchIcon" />
            </div>
          </div>
          <div className="search-header" id="searchHeader">
            <Button
              className="filter-table"
              onClick={() => setShowFilter(!showFilter)}
            >
              Filter By <img src={sortImg} alt="sort" />
            </Button>
            <DropdownButton
              className="sort-table"
              id="dropdown-basic-button"
              title="Sort By"
            >
              <>
                <span
                  className="dropdown-item"
                  onClick={() => handleSort("sosDate")}
                >
                  SOS Date
                </span>
                <span
                  className="dropdown-item"
                  onClick={() => handleSort("id")}
                >
                  Project ID
                </span>
                {/* <span
                  className="dropdown-item"
                  onClick={() => handleSort("id")}
                >
                  Project ID
                </span> */}
              </>
            </DropdownButton>

            <AddButton handleAdd={handleAdd} />
          </div>
        </div>
        <AddProject
          isAdd={isAdd}
          showPopModal={showModal}
          togglePopModal={() => setShowModal(!showModal)}
          selectedProject={selectedProject}
          selected={selected}
          setSelected={setSelected}
        />
      </div>

      <div className="fixed-table">
        <Table bordered>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAllChecked}
                  onChange={handleSelectAll}
                  disabled={error && true}
                />
              </th>
              <th>Proj ID </th>
              <th>Proj Name </th>
              <th>Artwork count</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>SOS Date</th>
              <th>Duration </th>
              <th>Date Modified </th>
              <th>Approved </th>
              <th>Status</th>
              <th>PM </th>
              <th>AW@ Printer</th>
              <th>Attachment Name</th>
              <th>
                {selected.length > 0 ? (
                  <DropdownButton id="dropdown-basic-button" title="Action">
                    <>
                      <span className="dropdown-item">
                        Delete All
                        <img
                          src={DeleteImg}
                          alt="delete all"
                          onClick={handleDeleteAll}
                        />
                      </span>
                      <span className="dropdown-item">
                        Export All
                        <ExportSelectedRows selectedRows={selected} />
                      </span>
                    </>
                  </DropdownButton>
                ) : (
                  <span>...</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>{projectData}</tbody>
        </Table>
      </div>
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      {showDeleteModal && (
        <DeleteModal
          selectedProject={selectedProject}
          closeModal={() => setShowDeleteModal(false)}
          handleModalDelete={handleModalDelete}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          deleteMessage={deleteMessage}
        />
      )}
      {showFilter && (
        <FilterModal
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          handleFilterStatus={handleFilterStatus}
          selectedStatus={selectedStatus}
        />
      )}
    </>
  );
}

export default DashboardTable;
