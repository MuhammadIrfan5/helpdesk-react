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

const AddCompany = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const options = [
    { id: 1, value: "choc", label: "Chocolate", name: "bilal", max: 12 },
    { id: 2, value: "strawberry", label: "Strawberry" },
    { id: 3, value: "vanilla", label: "Vanilla" },
  ];

  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState();
  const [companyAddress, setCompanyAddress] = useState("");
  const [enggLimit, setEnggLimit] = useState();
  const [empLimit, setEmpLimit] = useState();
  const [selectedCountry, setSelectedCountry] = useState();
  const [country, setCountry] = useState([]);
  const [selectedCity, setSelectedCity] = useState();
  const [cities, setCities] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState();
  const [packages, setPackages] = useState([]);

  const tokenDetailsString = localStorage.getItem("userDetails");
  // console.log(JSON.parse(tokenDetailsString), "userData");
  const loginData = JSON.parse(tokenDetailsString);
  const addNewCompany = async (e) => {
    e.preventDefault();
    let data_obj = {
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      enggLimit,
      empLimit,
      country_id: selectedCountry,
      package_id: selectedPackage,
      city_id: selectedCity,
    };

    console.log(data_obj, "final data");
    var data = new FormData();
    data.append("country_id", selectedCountry.uuid);
    data.append("city_id", selectedCity.uuid);
    data.append("package_id", selectedPackage.uuid);
    data.append("name", companyName);
    data.append("email", companyEmail);
    data.append("phone_no", companyPhone);
    data.append("latitude", "28.928");
    data.append("longitude", "28.092");
    data.append("is_approved", "1");
    data.append("address", companyAddress);
    data.append("engineer_limit", enggLimit);
    data.append("employee_limit", empLimit);
    data.append("status", "active");

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://helpdeskapis.gulfresource.org/public/api/company/company_create",
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
    listPackages();
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

  const listPackages = async () => {
    // console.log(loginData?.data?.token, "token");
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiActiveURL}general/listing/show_all_packages`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${loginData?.data?.token}`,
      },
    };

    await axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        // console.log(response.data, "packages response");
        setPackages(response.data.data);
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
            activeMenu="Validation"
            motherMenu="Form"
            pageContent="Validation"
          />

          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Create Company</h4>
                </div>
                <div className="card-body">
                  <div className="form-validation">
                    {/* <form
                  className="form-valide"
                  action="#"
                  method="post"
                  onSubmit={addNewCompany}
                > */}
                    <div className="row">
                      <div className="col-xl-6">
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-username"
                          >
                            Company Name
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              className="form-control"
                              id="val-username"
                              name="val-username"
                              placeholder="Please Enter a Company Name.."
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
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
                              type="text"
                              className="form-control"
                              id="val-email"
                              name="val-email"
                              placeholder="Company valid email.."
                              value={companyEmail}
                              onChange={(e) => setCompanyEmail(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-phoneus"
                          >
                            Company Phone (US)
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              className="form-control"
                              id="val-phoneus"
                              name="val-phoneus"
                              placeholder="212-999-0000"
                              value={companyPhone}
                              onChange={(e) => setCompanyPhone(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="form-group mb-3 row">
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
                        </div>
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-number"
                          >
                            Engineer Limit{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="number"
                              className="form-control"
                              id="val-number"
                              name="val-number"
                              placeholder="5.0"
                              value={enggLimit}
                              onChange={(e) => setEnggLimit(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="form-group mb-3 row">
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
                        </div>
                      </div>
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
                            Package
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <Select
                              defaultValue={selectedPackage}
                              onChange={setSelectedPackage}
                              options={packages}
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

export default AddCompany;
