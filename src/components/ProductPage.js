import React, { useEffect } from "react";

import bookService from "../service/book.service";
import categoryService from "../service/category.service";
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
import Confirm from "./Confirm";
import { useNavigate } from "react-router-dom";

const ProductPage = () => {
  // initial filter while page is rendering
  const defaultFilter = {
    pageIndex: 1,
    pageSize: 4,
  };

  // set Book Records:In this pageIndex,pageSize,totalPages is for the navigation purpose
  // and items array is used for add Book records in page
  const [bookRecords, setBookRecords] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });

  const [categories, setCategories] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [filters, setFilters] = useState(defaultFilter);
  const [open, setOpen] = useState(false);
  const Navigate = useNavigate();
  const columns = [
    { id: "id", label: "ID", width: 50 },
    { id: "name", label: "Book Name", width: 70 },
    { id: "price", label: "Price", width: 70 },
    { id: "category", label: "Category", width: 70 },
  ];

  useEffect(() => {
    categoryService.getAll().then((res) => {
      if (res) {
        setCategories(res);
      }
    });
  }, []);
  const searchAllBooks = (filters) => {
    bookService.getAll(filters).then((res) => {
      setBookRecords(res);
    });
  };
  useEffect(() => {
    searchAllBooks({ ...filters });
  }, [filters]);
  const onConfirmDelete = () => {
    bookService.deleteBook(selectedId).then((res) => {
      toast.success("Record Deleted Successfully...");
      setOpen(false);
      setFilters({ ...filters });
    });
  };

  return (
    <>
      <Typography color="primary" align="center" variant="h4" style={{marginBottom:20,fontWeight:'bold'}}>
        <br/>Product Page
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
            if(e.target.value == '')
            {
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
          onClick={() => Navigate("/add-book")}
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
              {bookRecords?.items?.map((row, index) => {
                return (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.price}</TableCell>
                    <TableCell>
                      {categories.find((c) => c.id === row.categoryId)?.name}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        className="green-btn btn"
                        color="primary"
                        variant="contained"
                        disableElevation
                        onClick={() => {
                          Navigate(`/editBook/${row.id}`);
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
              {!bookRecords.items.length && (
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
          count={bookRecords.totalItems}
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
          description="Are you sure you want to delete this book?"
        />
      </div>
    </>
  );
};
export default ProductPage;
