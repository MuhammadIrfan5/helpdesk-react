import React, {
  useMemo,
  useEffect,
  useState,
  useReducer,
  Fragment,
} from "react";
import PageTitle from "../../../layouts/PageTitle";
import {
  useTable,
  useGlobalFilter,
  useFilters,
  usePagination,
} from "react-table";
import {
  Row,
  Col,
  Card,
  Table,
  Badge,
  Dropdown,
  ProgressBar,
  Modal,
  Button,
} from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { apiActiveURL } from "../../../../ApiBaseURL";
import MOCK_DATA from "./MOCK_DATA_2.json";
import { COLUMNS } from "./Columns";
import { GlobalFilter } from "./GlobalFilter";
//import './table.css';
import "./filtering.css";
// import { MenuItem } from "material-ui/MenuItem";

const init = false;

const reducer = (states, active) => {
  switch (active.type) {
    case "basicModal":
      return { ...states, basicModal: !states.basicModal };
    // case "contentModal":
    //   return { ...state, contentModal: !state.contentModal };
    case "modalCentered":
      return { ...states, modalCentered: !states.modalCentered };
    // case "modalWithTooltip":
    //   return { ...state, modalWithTooltip: !state.modalWithTooltip };
    // case "gridInsideModal":
    //   return { ...state, gridInsideModal: !state.gridInsideModal };
    case "largeModal":
      return { ...states, largeModal: !states.largeModal };
    // case "smallModal":
    //   return { ...state, smallModal: !state.smallModal };
    default:
      return states;
  }
};

export const EmployeeTypeList = () => {
  const tokenDetailsString = localStorage.getItem("userDetails");
  const loginData = JSON.parse(tokenDetailsString);
  const columns = useMemo(() => COLUMNS, []);
  // const data = useMemo(() => MOCK_DATA, []);
  const [states, dispatch] = useReducer(reducer, init);

  const [companyStatus, setCompanyStatus] = useState("");
  const [companyId, setCompanyId] = useState("");

  const [employeeData, setEmployeeData] = useState([]);

  const [deleteId, setDeleteId] = useState("");

  const [selectedOption, setSelectedOption] = useState(null);
  const options = [
    { id: 1, value: "active", label: "Active" },
    { id: 2, value: "inactive", label: "In-Active" },
    // { id: 3, value: "vanilla", label: "Vanilla" },
  ];
  const [updateId, setUpdateId] = useState("");
  const [employeeType, setEmployeeType] = useState("");

  const tableInstance = useTable(
    {
      columns,
      // data,
      data: employeeData,
      initialState: { pageIndex: 0 },
    },
    useFilters,
    useGlobalFilter,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state,
    page,
    gotoPage,
    pageCount,
    pageOptions,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    setGlobalFilter,
  } = tableInstance;

  const { globalFilter, pageIndex } = state;

  useEffect(() => {
    listEmployeeType();
  }, []);

  const svg1 = (
    <svg width="20px" height="20px" viewBox="0 0 24 24" version="1.1">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <rect x="0" y="0" width="24" height="24"></rect>
        <circle fill="#000000" cx="5" cy="12" r="2"></circle>
        <circle fill="#000000" cx="12" cy="12" r="2"></circle>
        <circle fill="#000000" cx="19" cy="12" r="2"></circle>
      </g>
    </svg>
  );

  const listEmployeeType = async () => {
    // console.log(loginData?.data?.token, "token");

    var data = new FormData();
    data.append("uuid", loginData?.data?.uuid);
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiActiveURL}general/listing/show_all_type`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${loginData?.data?.token}`,
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        console.log(response, "employee type list response");
        setEmployeeData(response.data.data);
      })
      .catch(function (error) {
        // console.log(error);
      });
  };

  const handleDelete = (row) => {
    console.log(row, "delete clicked data");
    setDeleteId(row.original.uuid);
    dispatch({ type: "modalCentered" });
  };

  const DeleteComplaint = () => {
    console.log(deleteId, "delete id");

    var data = new FormData();
    data.append("uuid", deleteId);

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${apiActiveURL}admin/type/delete_type`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${loginData?.data?.token}`,
        // ...data.getHeaders(),
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        // console.log(response.data, "block api response");
        dispatch({ type: "modalCentered" });
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        listEmployeeType();
        // setCities(response.data.data[0].city);
      })
      .catch(function (error) {
        // console.log(error);
        toast.error("Something went wrong", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };

  const handleUpdate = (item) => {
    console.log(item, "update clicked data");
    setUpdateId(item.original.uuid);
    // setDescription(item.original.description);
    setEmployeeType(item.original.type);

    if (item.original.status == "active") {
      setSelectedOption({ id: 1, value: "active", label: "Active" });
    } else {
      setSelectedOption({ id: 2, value: "inactive", label: "In-Active" });
    }
    dispatch({ type: "largeModal" });
  };

  const updateEmployee = async (e) => {
    e.preventDefault();

    let data_obj = {
      employeeType,
      // description,
      selectedOption,
    };

    console.log(data_obj, "final data");
    // return;
    var data = new FormData();
    data.append("uuid", updateId);
    data.append("type", employeeType);
    data.append("slug", employeeType);
    data.append("status", selectedOption.value);
    // data.append("description", description);

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${apiActiveURL}admin/type/update_type`,

      //   url:
      //     loginData?.data?.role?.slug == "admin"
      //       ? `${apiActiveURL}admin/change_password`
      //       : loginData?.data?.role?.slug == "super-admin"
      //       ? `${apiActiveURL}admin/change_password`
      //       : loginData?.data?.role?.slug == "company"
      //       ? `${apiActiveURL}company/change_password`
      //       : loginData?.data?.role?.slug == "employee"
      //       ? `${apiActiveURL}employee/change_password`
      //       : loginData?.data?.role?.slug == "engineer"
      //       ? `${apiActiveURL}employee/change_password`
      //       : null,

      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${loginData?.data?.token}`,
        // ...data.getHeaders(),
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        // console.log(response.data, "create company response");
        listEmployeeType();
        dispatch({ type: "largeModal" });
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch(function (error) {
        // console.log(error);
        toast.error("Something went wrong", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };

  return (
    <>
      <ToastContainer />
      <PageTitle activeMenu="Complain Type List" motherMenu="Complaints" />

      {/* center modal */}
      <Modal
        className="fade"
        show={states.modalCentered}
        onHide={() => dispatch({ type: "modalCentered" })}
      >
        <Modal.Header>
          <Modal.Title>Delete</Modal.Title>
          <Button
            onClick={() => dispatch({ type: "modalCentered" })}
            variant=""
            className="btn-close"
          ></Button>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure want to delete the complaint type ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => dispatch({ type: "modalCentered" })}
            variant="danger light"
          >
            Close
          </Button>
          <Button variant="primary" onClick={DeleteComplaint}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* large modal */}
      <Modal
        className="fade bd-example-modal-lg"
        show={states.largeModal}
        size="lg"
        onHide={() => dispatch({ type: "largeModal" })}
      >
        <Modal.Header>
          <Modal.Title>Update</Modal.Title>
          <Button
            variant=""
            className="btn-close"
            onClick={() => dispatch({ type: "largeModal" })}
          ></Button>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group mb-3 row">
            <label className="col-lg-4 col-form-label" htmlFor="val-username">
              Complaint Type
              <span className="text-danger">*</span>
            </label>
            <div className="col-lg-6">
              <input
                type="text"
                className="form-control"
                id="val-username"
                name="val-username"
                placeholder="Please Enter the complaint Type.."
                value={employeeType}
                onChange={(e) => setEmployeeType(e.target.value)}
              />
            </div>
          </div>
          {/* <div className="form-group mb-3 row">
            <label className="col-lg-4 col-form-label" htmlFor="val-email">
              Description <span className="text-danger">*</span>
            </label>
            <div className="col-lg-6">
              <input
                type="text"
                className="form-control"
                id="val-email"
                name="val-email"
                placeholder="Please Enter the Description.."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div> */}

          <div className="form-group mb-3 row">
            <label className="col-lg-4 col-form-label" htmlFor="val-email">
              Status
              <span className="text-danger">*</span>
            </label>
            <div className="col-lg-6">
              <Select
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={options}
                style={{
                  lineHeight: "40px",
                  color: "#7e7e7e",
                  paddingLeft: " 15px",
                }}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger light"
            onClick={() => dispatch({ type: "largeModal" })}
          >
            Close
          </Button>
          <Button
            variant=""
            type="button"
            className="btn btn-primary"
            onClick={updateEmployee}
          >
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Company List</h4>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <table {...getTableProps()} className="table dataTable display">
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>
                        {column.render("Header")}
                        {column.canFilter ? column.render("Filter") : null}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()} className="">
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <>
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <>
                              {/* {console.log(cell, "data")} */}
                              <>
                                <td {...cell.getCellProps()}>
                                  {" "}
                                  {cell.render("Cell")}{" "}
                                </td>
                              </>
                            </>
                          );
                        })}
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="danger"
                            className="light sharp i-false"
                          >
                            {svg1}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {/* <Dropdown.Item
                              onClick={() => {
                                // console.log(row, "row");
                                handleBlockAndUnBlock(row, "inactive");
                              }}
                            >
                              In-Active
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                // console.log(row, "row");
                                handleBlockAndUnBlock(row, "active");
                              }}
                            >
                              Active
                            </Dropdown.Item> */}
                            <Dropdown.Item
                              onClick={() => {
                                // console.log(row, "row");
                                // handleBlockAndUnBlock(row, "active");
                                handleDelete(row);
                              }}
                            >
                              Delete
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                // console.log(row, "row");
                                // handleBlockAndUnBlock(row, "active");
                                handleUpdate(row);
                              }}
                            >
                              Update
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        {/* <button
                          onClick={() => {
                            console.log(row, "row");
                          }}
                        >
                          Click me
                        </button> */}
                      </tr>
                    </>
                  );
                })}
                <tr></tr>
              </tbody>
            </table>
            <div className="d-flex justify-content-between">
              <span>
                Page{" "}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>
                {""}
              </span>
              <span className="table-index">
                Go to page :{" "}
                <input
                  type="number"
                  className="ml-2"
                  defaultValue={pageIndex + 1}
                  onChange={(e) => {
                    const pageNumber = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    gotoPage(pageNumber);
                  }}
                />
              </span>
            </div>
            <div className="text-center mb-3">
              <div className="filter-pagination  mt-3">
                <button
                  className=" previous-button"
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                >
                  {"<<"}
                </button>

                <button
                  className="previous-button"
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  Previous
                </button>
                <button
                  className="next-button"
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                >
                  Next
                </button>
                <button
                  className=" next-button"
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                >
                  {">>"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default EmployeeTypeList;
