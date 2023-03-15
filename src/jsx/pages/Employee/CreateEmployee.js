import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import PageTitle from "../../../layouts/PageTitle";
import PageTitle from "../../layouts/PageTitle";
import { Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import axios from "axios";
import { apiActiveURL } from "../../../ApiBaseURL";
import { ToastContainer, toast } from "react-toastify";

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Your username must consist of at least 3 characters ")
    .max(50, "Your username must consist of at least 3 characters ")
    .required("Please enter a username"),
  password: Yup.string()
    .min(5, "Your password must be at least 5 characters long")
    .max(50, "Your password must be at least 5 characters long")
    .required("Please provide a password"),
});

const CreateEmployee = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const options = [
    { id: 1, value: "active", label: "Active" },
    { id: 2, value: "inactive", label: "In-Active" },
  ];

  const [employeeName, setEmployeeName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [employeePhone, setEmployeePhone] = useState();
  // const [companyAddress, setCompanyAddress] = useState("");
  const [employeeCode, setEmployeeCode] = useState();
  const [empLimit, setEmpLimit] = useState();

  const [selectedCountry, setSelectedCountry] = useState();
  const [country, setCountry] = useState([]);

  const [selectedCity, setSelectedCity] = useState();
  const [cities, setCities] = useState([]);

  const [selectedBranch, setSelectedBranch] = useState();
  const [branches, setBranches] = useState([]);

  const [selectedRole, setSelectedRole] = useState();
  const [roles, setRoles] = useState([]);

  const [selectedEmployeeType, setSelectedEmployeeType] = useState();
  const [employeeTypes, setEmployeeTypes] = useState([]);

  const tokenDetailsString = localStorage.getItem("userDetails");
  // console.log(JSON.parse(tokenDetailsString), "userData");
  const loginData = JSON.parse(tokenDetailsString);
  const addNewCompany = async (e) => {
    e.preventDefault();
    let data_obj = {
      employeeName,
      companyEmail,
      employeePhone,
      employeeCode,
      country_id: selectedCountry,
      city_id: selectedCity,
      branch_id: selectedBranch,
      roles_id: selectedRole,
      employeetype_id: selectedEmployeeType,
      status: selectedOption,
    };

    console.log(data_obj, "final data");

    // return;
    var data = new FormData();
    data.append("company_id", loginData.data.uuid);
    data.append("country_id", selectedCountry.uuid);
    data.append("city_id", selectedCity.uuid);
    data.append("branch_id", selectedBranch.uuid);
    data.append("role_id", selectedRole.uuid);
    data.append("employee_type_id", selectedEmployeeType.uuid);
    data.append("status", selectedOption.value);
    data.append("first_name", employeeName);
    data.append("company_email", companyEmail);
    data.append("primary_phone_no", employeePhone);
    data.append("employee_code", employeeCode);

    data.append("status", "active");

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${apiActiveURL}employee/employee_create`,
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

  useEffect(() => {
    // const tokenDetailsString = localStorage.getItem("userDetails");
    // console.log(JSON.parse(tokenDetailsString), "userData");
    // const loginData = JSON.parse(tokenDetailsString);
    listCountries();
    listBranches();
    listRoles();
    listEmployeeTypes();
    // listCities();
    // options={country}
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      listCities(selectedCountry);
    } else return;
  }, [selectedCountry]);

  const listCountries = async () => {
    // console.log(loginData?.data?.token, "token");
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiActiveURL}general/listing/list_all_country`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${loginData?.data?.token}`,
      },
    };

    await axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        // console.log(response.data, "country response");
        setCountry(response.data.data);
      })
      .catch(function (error) {
        // console.log(error);
      });
  };

  const listCities = async (value) => {
    // var FormData = require("form-data");
    // console.log(value, "selected country");
    var data = new FormData();
    data.append("uuid", value.uuid);

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${apiActiveURL}general/listing/show_cities_by_country`,
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
        // console.log(response.data.data[0].city, "cities response");
        setCities(response.data.data[0].city);
      })
      .catch(function (error) {
        // console.log(error);
      });
  };

  const listBranches = async () => {
    // console.log(loginData?.data?.token, "token");
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiActiveURL}general/listing/show_branch_by_company`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${loginData?.data?.token}`,
      },
    };

    await axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        // console.log(response.data.data, "branches response");
        setBranches(response.data.data.data);
      })
      .catch(function (error) {
        // console.log(error);
      });
  };

  const listRoles = async () => {
    // console.log(loginData?.data?.token, "token");
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiActiveURL}general/listing/show_all_roles`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${loginData?.data?.token}`,
      },
    };

    await axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        // console.log(response.data, "roles response");
        setRoles(response.data.data);
      })
      .catch(function (error) {
        // console.log(error);
      });
  };

  const listEmployeeTypes = async () => {
    // console.log(loginData?.data?.token, "token");
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiActiveURL}general/listing/show_all_type`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${loginData?.data?.token}`,
      },
    };

    await axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        console.log(response.data, "employee type response");
        setEmployeeTypes(response.data.data);
      })
      .catch(function (error) {
        // console.log(error);
      });
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={addNewCompany}>
        <Fragment>
          <PageTitle
            activeMenu="Create Employee "
            motherMenu="Dashboard"
            pageContent="Create Employee"
          />

          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Create Employee</h4>
                </div>
                <div className="card-body">
                  <div className="form-validation">
                    <div className="row">
                      <div className="col-xl-6">
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-username"
                          >
                            Employee Name
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              className="form-control"
                              id="val-username"
                              name="val-username"
                              placeholder="Please Enter the Employee Name.."
                              value={employeeName}
                              onChange={(e) => setEmployeeName(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-email"
                          >
                            Company Email <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="email"
                              className="form-control"
                              id="val-email"
                              name="val-email"
                              placeholder="Company valid email.."
                              value={companyEmail}
                              onChange={(e) => setCompanyEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-phoneus"
                          >
                            Employee Phone
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              className="form-control"
                              id="val-phoneus"
                              name="val-phoneus"
                              placeholder="212-999-0000"
                              value={employeePhone}
                              onChange={(e) => setEmployeePhone(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        {/* <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-username"
                          >
                            Company Address
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              className="form-control"
                              id="val-username"
                              name="val-username"
                              placeholder="Please Enter a Company Address.."
                              value={companyAddress}
                              onChange={(e) =>
                                setCompanyAddress(e.target.value)
                              }
                            />
                          </div>
                        </div> */}
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-number"
                          >
                            Employee Code <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="number"
                              className="form-control"
                              id="val-number"
                              name="val-number"
                              placeholder="5.0"
                              value={employeeCode}
                              onChange={(e) => setEmployeeCode(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        {/* <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-number"
                          >
                            Employee Limit{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="number"
                              className="form-control"
                              id="val-number"
                              name="val-number"
                              placeholder="5.0"
                              value={empLimit}
                              onChange={(e) => setEmpLimit(e.target.value)}
                            />
                          </div>
                        </div> */}
                      </div>
                      {/* 2nd Column */}
                      <div className="col-xl-6">
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-skill"
                          >
                            Country
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <Select
                              defaultValue={selectedCountry}
                              onChange={setSelectedCountry}
                              options={country}
                              style={{
                                lineHeight: "40px",
                                color: "#7e7e7e",
                                paddingLeft: " 15px",
                              }}
                            />
                          </div>
                        </div>
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-skill"
                          >
                            City
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <Select
                              isDisabled={selectedCountry ? false : true}
                              defaultValue={selectedCity}
                              onChange={setSelectedCity}
                              options={cities}
                              style={{
                                lineHeight: "40px",
                                color: "#7e7e7e",
                                paddingLeft: " 15px",
                              }}
                            />
                          </div>
                        </div>
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-skill"
                          >
                            Branch
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <Select
                              defaultValue={selectedBranch}
                              onChange={setSelectedBranch}
                              options={branches}
                              style={{
                                lineHeight: "40px",
                                color: "#7e7e7e",
                                paddingLeft: " 15px",
                              }}
                            />
                          </div>
                        </div>
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-skill"
                          >
                            Roles
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <Select
                              defaultValue={selectedRole}
                              onChange={setSelectedRole}
                              options={roles}
                              style={{
                                lineHeight: "40px",
                                color: "#7e7e7e",
                                paddingLeft: " 15px",
                              }}
                            />
                          </div>
                        </div>
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-skill"
                          >
                            Employee Type
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <Select
                              defaultValue={selectedEmployeeType}
                              onChange={setSelectedEmployeeType}
                              options={employeeTypes}
                              style={{
                                lineHeight: "40px",
                                color: "#7e7e7e",
                                paddingLeft: " 15px",
                              }}
                            />
                          </div>
                        </div>
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-skill"
                          >
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

                        <div className="form-group mb-3 row">
                          <div className="col-lg-8 ms-auto">
                            <button type="submit" className="btn btn-primary">
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* </form> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      </form>
    </>
  );
};

export default CreateEmployee;
