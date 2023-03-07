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
import { Button, Form } from "react-bootstrap";
// import ChangePassword from "./ChangePassword";

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

const CreateComplain = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const options = [
    { id: 1, value: "active", label: "Active" },
    { id: 2, value: "inactive", label: "In-Active" },
    // { id: 3, value: "vanilla", label: "Vanilla" },
  ];

  const [complaintType, setComplaintType] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const tokenDetailsString = localStorage.getItem("userDetails");
  console.log(JSON.parse(tokenDetailsString), "userData");
  const loginData = JSON.parse(tokenDetailsString);

  const createComplaint = async (e) => {
    e.preventDefault();

    let data_obj = {
      complaintType,
      description,
      selectedOption,
    };

    console.log(data_obj, "final data");
    // return;
    var data = new FormData();
    data.append("type", complaintType);
    data.append("status", selectedOption.value);
    data.append("description", description);

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${apiActiveURL}company/complain/create_complain_type`,

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
      <form onSubmit={createComplaint}>
        <Fragment>
          {/* <PageTitle
            activeMenu="Validation"
            motherMenu="Form"
            pageContent="Validation"
          /> */}

          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Create Complaint</h4>
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
                              value={complaintType}
                              onChange={(e) => setComplaintType(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-email"
                          >
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
                        </div>

                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-email"
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
                            {/* <input
                              type="text"
                              className="form-control"
                              id="val-email"
                              name="val-email"
                              placeholder="Please Retype your New Password.."
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                            /> */}
                          </div>
                        </div>

                        {/* <div className="col-xl-6">
                          <div className="card">
                            <div className="card-body">
                              <div className="mb-4">
                                <h4 className="card-title">
                                  Loading array data
                                </h4>
                                <p>
                                  You may use the <code>data</code>{" "}
                                  configuration option to load dropdown options
                                  from a local array.
                                </p>
                              </div>

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
                        </div> */}

                        <div className="form-group mb-3 row">
                          <div className="col-lg-8 ms-auto">
                            <button type="submit" className="btn btn-primary">
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
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

export default CreateComplain;
