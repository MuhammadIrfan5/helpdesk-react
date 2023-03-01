import axios from "axios";
// import { apiActiveURL, appId, appKey } from "../../ApiBaseURL";

export const GetData = () => {
  console.warn("action hit");
  //   return;

  var config = {
    url: `https://datausa.io/api/data?drilldowns=Nation&measures=Population`,
    method: "GET",
    // headers: {
    //   AppKey: appKey,
    //   // Token: "A3Oy18BqjvFPIUTXY94im76ENuh5HVsngbo2lJxkL0reaZftKWcSDQwMpCzR",
    //   AppId: appId,
    //   // Token: token
    // },
  };

  return (dispatch) => {
    axios(config)
      .then((res) => {
        // console.log(res, "data response");
        GetHotelSuccess(dispatch, res.data.data);
        // if (res.data.code === 403) {
        //   GetHotelFail(dispatch);
        // } else {
        //   GetHotelSuccess(dispatch, res);
        // }
      })
      .catch((e) => {
        // console.log(e, "fail");
        // GetHotelFail(dispatch)
      });
  };
};

export const ResetGetHotel = () => {
  return (dispatch) => {
    dispatch({ type: "GET_HOTEL_SUCCESS", payload: null });
  };
};

const GetHotelSuccess = (dispatch, res) => {
  // console.log(res, "data in function");
  dispatch({ type: "GET_HOTEL_SUCCESS", payload: res });
};

const GetHotelFail = (dispatch) => {
  dispatch({ type: "GET_HOTEL_FAIL", payload: "Something Went Wrong" });
};
