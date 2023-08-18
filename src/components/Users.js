import React, { useEffect } from "react";

import { toast } from "react-toastify";
import {
  Typography,
  Button,
  Table,
  TableCell,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
} from "@material-ui/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Confirm from "./Confirm";
import userService from "../service/user.service";

const Users = () => {
  // initial filter while page is rendering
  const defaultFilter = {
    pageIndex: 1,
    pageSize: 10,
  };
  const [filters, setFilters] = useState(defaultFilter);
  const [user, setUser] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });

  const [selectedId, setSelectedId] = useState(0);
  const [open, setOpen] = useState(false);
  const Navigate = useNavigate();
  const columns = [
    { id: "ID", label: "ID", width: 70 },
    { id: "firstName", label: "First Name", width: 70 },
    { id: "lastName", label: "Last Name", width: 70 },
    {
      id: "email",
      label: "Email",
      width: 150,
    },
    {
      id: "role",
      label: "Role",
      width: 70,
    },
  ];

  useEffect(() => {
    getAllUsers({ ...filters });
  }, [filters]);

  const getAllUsers = async (filters) => {
    await userService.getAllUsers(filters).then((res) => {
      if (res) {
        setUser(res);
      }
    });
  };
  const onConfirmDelete = () => {
    userService.deleteUser(selectedId).then((res) => {
      if (res) {
        toast.success("User Deleted Successfully...");
        setOpen(false);
        setFilters({ ...filters });
      }
    });
  };

  return (
    <>
      <Typography
        color="primary"
        align="center"
        variant="h4"
        style={{ marginBottom: 20, fontWeight: "bold" }}
      > <br/>
        Users Page
      </Typography>
      <div
        className="searchContainer"
        style={{
          width: "80vw",
          // border:'1px solid black',
          marginInline: "auto",
          display: "flex",
          justifyContent: "right",
          // paddingInline: '10px'
        }}
      >
        <TextField
          id="text"
          label="search"
          className="dropdown-wrapper"
          name="text"
          placeholder="Search..."
          variant="outlined"
          inputProps={{ className: "small" }}
          onChange={(e) => {
            if (e.target.value == "") {
              setFilters(defaultFilter);
              return;
            }
            setFilters({
              ...filters,
              keyword: e.target.value,
              pageIndex: 1,
            });
          }}
          style={{width: 300 }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}></div>
      <div style={{ margin: "auto", width: "80%" }}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead
              style={{ background: "linear-gradient(120deg,pink,violet,pink)" }}
            >
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} style={{ minWidth: column.width }}>
                    <Typography color="primary" variant="h6">
                      {column.label}
                    </Typography>
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {user?.items?.map((row, index) => {
                return (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.firstName}</TableCell>
                    <TableCell>{row.lastName}</TableCell>
                    <TableCell>
                      {row.email}
                    </TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        className="green-btn btn"
                        color="primary"
                        variant="contained"
                        disableElevation
                        onClick={() => {
                          Navigate(`/editUser/${row.id}`);
                        }}
                      >
                        Edit
                      </Button>
                      <span style={{ marginRight: "20px" }}></span>
                      <Button
                        type="button"
                        className="btn pink-btn"
                        color="secondary"
                        variant="contained"
                        disableElevation
                        onClick={() => {
                          setOpen(true);
                          setSelectedId(row.id ?? 0);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {!user.items.length && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography align="center" className="noDataText">
                      No Books
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[4, 5, 10, 100]}
          component="div"
          count={user.totalItems}
          rowsPerPage={filters.pageSize || 0}
          page={filters.pageIndex - 1}
          onPageChange={(e, newPage) => {
            setFilters({ ...filters, pageIndex: newPage + 1 });
          }}
          onRowsPerPageChange={(e) => {
            setFilters({
              ...filters,
              pageIndex: 1,
              pageSize: Number(e.target.value),
            });
          }}
        />
        <Confirm
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => onConfirmDelete()}
          title="Delete book"
          description="Are you sure you want to delete this user?"
        />
      </div>
    </>
  );
};
export default Users;
