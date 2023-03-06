import React, { useMemo, useEffect, useState, useReducer } from "react";
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
    // case "modalCentered":
    //   return { ...state, modalCentered: !state.modalCentered };
    // case "modalWithTooltip":
    //   return { ...state, modalWithTooltip: !state.modalWithTooltip };
    // case "gridInsideModal":
    //   return { ...state, gridInsideModal: !state.gridInsideModal };
    // case "largeModal":
    //   return { ...state, largeModal: !state.largeModal };
    // case "smallModal":
    //   return { ...state, smallModal: !state.smallModal };
    default:
      return states;
  }
};

export const CompanyList = () => {
  const tokenDetailsString = localStorage.getItem("userDetails");
  const loginData = JSON.parse(tokenDetailsString);
  const columns = useMemo(() => COLUMNS, []);
  // const data = useMemo(() => MOCK_DATA, []);
  const [states, dispatch] = useReducer(reducer, init);

  const [companyStatus, setCompanyStatus] = useState("");
  const [companyId, setCompanyId] = useState("");

  const [companyData, setCompanyData] = useState([]);
  const tableInstance = useTable(
    {
      columns,
      // data,
      data: companyData,
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
    listCompanies();
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

  const listCompanies = async () => {
    // console.log(loginData?.data?.token, "token");
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiActiveURL}company/show_all_companies`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${loginData?.data?.token}`,
      },
    };

    await axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        // console.log(response.data.data, "company response");
        setCompanyData(response.data.data);
      })
      .catch(function (error) {
        // console.log(error);
      });
  };

  const handleBlockAndUnBlock = (item, status) => {
    // console.log(item, status, "clicked-data");
    setCompanyStatus(status);
    setCompanyId(item.original.uuid);
    dispatch({ type: "basicModal" });
  };

  const BlockCompany = async () => {
    // console.log(companyId, companyStatus, "final data");
    // return;
    var data = new FormData();
    data.append("uuid", companyId);
    data.append("status", companyStatus);

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${apiActiveURL}company/block_unblock_company_account`,
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
        dispatch({ type: "basicModal" });
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
        listCompanies();
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

  return (
    <>
      <ToastContainer />
      <PageTitle activeMenu="Company List" motherMenu="List" />

      <Modal
        className="fade"
        show={states.basicModal}
        onHide={() => dispatch({ type: "basicModal" })}
      >
        <Modal.Header>
          <Modal.Title>Modal title</Modal.Title>
          <Button
            variant=""
            className="btn-close"
            onClick={() => dispatch({ type: "basicModal" })}
          ></Button>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {companyStatus} the company.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger light"
            onClick={() => dispatch({ type: "basicModal" })}
          >
            Close
          </Button>
          <Button variant="primary" onClick={BlockCompany}>
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
                            <Dropdown.Item
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
export default CompanyList;
