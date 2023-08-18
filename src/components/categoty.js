import React, { useEffect, useState } from "react";
import { defaultFilter } from "../constant/constant";
import { useNavigate } from "react-router-dom";
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

import categoryService from "../service/category.service";
import { toast } from "react-toastify";
import Confirm from "./Confirm";

const Category = () => {
  const Navigate = useNavigate();
  const [filters, setFilters] = useState(defaultFilter);
  const [categoryRecords, setCategoryRecords] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.keyword === "") delete filters.keyword;
      searchAllCategories({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const searchAllCategories = (filters) => {
    categoryService.getAll(filters).then((res) => {
      setCategoryRecords(res);
    });
  };

  const columns = [
    { id: "id", label: "ID", minWidth: 100 },
    { id: "name", label: "Category Name", minWidth: 100 },
  ];

  const onConfirmDelete = () => {
    categoryService
      .deleteCategory(selectedId)
      .then((res) => {
        toast.success("sucessfull....");
        setOpen(false);
        setFilters({ ...filters });
      })
      .catch((e) => toast.error("something went wrong"));
  };
  return (
    <>
      <Typography
        color="primary"
        align="center"
        variant="h4"
        style={{ marginBottom: 20, fontWeight: "bold" }}
      ><br/>
        Categories Page
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
          style={{ marginInline: 20, width: 300 }}
        />
        <Button
          type="submit"
          size="large"
          className="productbtn"
          variant="contained"
          color="primary"
          onClick={() => Navigate("/add-category")}
        >
          Add
        </Button>
      </div>
      <div style={{ marginBottom: "10px" }}></div>
      <div style={{ margin: "auto", width: "80%" }}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead
              style={{ background: "linear-gradient(120deg,pink,violet,pink)" }}
            >
              <TableRow style={{ width: "100%" }}>
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
              {categoryRecords?.items?.map((row, index) => {
                return (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>

                    <TableCell>
                      <Button
                        type="button"
                        className="green-btn btn"
                        color="primary"
                        variant="contained"
                        disableElevation
                        onClick={() => {
                          Navigate(`/editCategory/${row.id}`);
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
              {!categoryRecords.items.length && (
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
          count={categoryRecords.totalItems}
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
          description="Are you sure you want to delete this Category?"
        />
      </div>
    </>
  );
};

export default Category;
