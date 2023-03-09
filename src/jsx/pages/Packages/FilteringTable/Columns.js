import { format } from "date-fns";
import { ColumnFilter } from "./ColumnFilter";
export const COLUMNS = [
  // {
  //   Header: "Id",
  //   Footer: "Id",
  //   accessor: "id",
  //   Filter: ColumnFilter,
  //   //disableFilters: true,
  // },
  {
    Header: "Package Name",
    Footer: "Package Name",
    accessor: "name",
    Filter: ColumnFilter,
  },
  {
    Header: "Package Cost",
    Footer: "Package Cost",
    accessor: "package_cost",
    Filter: ColumnFilter,
  },
  // {
  //   Header: "Complaint Type",
  //   Footer: "Company Address",
  //   accessor: "type",
  //   Filter: ColumnFilter,
  // },
  // {
  //   Header: "Company Address",
  //   Footer: "Company Address",
  //   accessor: "address",
  //   Filter: ColumnFilter,
  // },
  {
    Header: "Created At",
    Footer: "Created At",
    accessor: "created_at",
    Cell: ({ value }) => {
      return format(new Date(value), "dd/mm/yyyy");
    },
    Filter: ColumnFilter,
  },
  {
    Header: "Status",
    Footer: "Status",
    accessor: "status",
    Filter: ColumnFilter,
    Cell: ({ value }) => {
      if (value === "active") {
        return (
          <div className="d-flex align-items-center">
            <i className="fa fa-circle text-success me-1"></i> {value}
          </div>
        );
      }
      if (value === "inactive") {
        return (
          <div className="d-flex align-items-center">
            <i className="fa fa-circle text-danger me-1"></i> {value}
          </div>
        );
      }

      // return format(new Date(value), "dd/mm/yyyy");
    },
  },
  // {
  //   Header: "Phone",
  //   Footer: "Phone",
  //   accessor: "phone",
  //   Filter: ColumnFilter,
  // },

  // if (value === "active") {
  //   //         return <Chip label="Active" color="secondary" />;
  //   //       }
];

export const GROUPED_COLUMNS = [
  {
    Header: "Id",
    Footer: "Id",
    accessor: "id",
  },
  {
    Header: "Name",
    Footer: "Name",
    columns: [
      {
        Header: "First Name",
        Footer: "First Name",
        accessor: "first_name",
      },
      {
        Header: "Last Name",
        Footer: "Last Name",
        accessor: "last_name",
      },
    ],
  },
  {
    Header: "Info",
    Footer: "Info",
    columns: [
      {
        Header: "Date of  Birth",
        Footer: "Date of  Birth",
        accessor: "date_of_birth",
      },
      {
        Header: "Country",
        Footer: "Country",
        accessor: "country",
      },
      {
        Header: "Phone",
        Footer: "Phone",
        accessor: "phone",
      },
    ],
  },
];
