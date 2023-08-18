import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { toast } from "react-toastify";
import { useAuthContext } from "../contexts/auth";
import { materialCommonStyles } from "../utils/materialCommonStyles";
import { defaultFilter } from "../constant/constant";
import categoryService from "../service/category.service";
import bookService from "../service/book.service";
import { useCartContext } from "../contexts/cartContext";
import shared from "../utils/Shared";

export default function BookListing() {
  const authContext = useAuthContext();
  const cartContext = useCartContext();
  //   const classes = productListingStyle();
  const materialClasses = materialCommonStyles();
  const [bookResponse, setBookResponse] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState();
  const [filters, setFilters] = useState(defaultFilter);

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.keyword === "") delete filters.keyword;
      searchAllBooks({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const searchAllBooks = (filters) => {
    bookService.getAll(filters).then((res) => {
      setBookResponse(res);
    });
  };

  const getAllCategories = async () => {
    await categoryService.getAll().then((res) => {
      if (res) {
        setCategories(res);
      }
    });
  };

  const books = useMemo(() => {
    const bookList = [...bookResponse.items];
    if (bookList) {
      bookList.forEach((element) => {
        element.category = categories.find(
          (a) => a.id === element.categoryId
        )?.name;
      });
      return bookList;
    }
    return [];
  }, [categories, bookResponse]);

  const addToCart = (book) => {
    console.log("addToCart:::", book);
    shared.addToCart(book, authContext.user.id).then((res) => {
      if (res.error) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        cartContext.updateCart();
      }
    });
  };

  const sortBooks = (e) => {
    setSortBy(e.target.value);
    const bookList = [...bookResponse.items];

    bookList.sort((a, b) => {
      if (a.name < b.name) {
        return e.target.value === "a-z" ? -1 : 1;
      }
      if (a.name > b.name) {
        return e.target.value === "a-z" ? 1 : -1;
      }
      return 0;
    });
    setBookResponse({ ...bookResponse, items: bookList });
  };

  return (
    <div style={{ overflowX: "hidden" }}>
        <br/>
        <Typography variant="h4" align="center" color="primary" style={{marginBottom:20,fontWeight:'bold'}}>
        <br/>  Book Listing
        </Typography>



      <div className="container">

        {/*  HEDER */}
        <Grid
          container
          className="title-wrapper"
          style={{
            width: "99vw",
            // border: "1px solid black",
            marginInline: "5vw",
            paddingInline: "20px",
          }}
        >
          <Grid item xs={6}>
            <Typography variant="h5">
              Total
              <span> - {bookResponse.totalItems} items</span>
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="text"
              className="dropdown-wrapper"
              name="text"
              placeholder="Search..."
              variant="outlined"
              inputProps={{ className: "small" }}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  keyword: e.target.value,
                  pageIndex: 1,
                });
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl
              className="dropdown-wrapper"
              variant="outlined"
              style={{
                // border: "1px solid black",
                width: 200,
              }}
            >
              <InputLabel
                htmlFor="select"
                style={{ paddingInline: "0", width: "" }}
              >
                Sort By
              </InputLabel>
              <Select
                className={materialClasses.customSelect}
                MenuProps={{
                  classes: { paper: materialClasses.customSelect },
                }}
                onChange={sortBooks}
                value={sortBy}
              >
                <MenuItem value="a-z">a - z</MenuItem>
                <MenuItem value="z-a">z - a</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>



        {/* ITEMS  */}
          <div
            className="product-list-inner-wrapper"
            style={{
                // border: "1px solid red",
              display: "flex",
              width:"90vw",
              marginInline:'auto',
              flexWrap: "wrap",
            }}
          >
            {books.map((book, index) => (
              <div
                className="product-list"
                key={book.id}
                style={{
                  border: "1px solid rgb(0,0,0,0.1)",
                  width: "24%",
                  height: "380px",
                  overflow: "scroll",
                  marginInline:'auto',
                  borderRadius: "10px",
                  boxShadow: "1px 1px 2px grey",   
                  marginBlock: 20,
                  padding: 10,
                  overflow: "hidden",
                  backgroundColor: "rgba(122,122,122,0.05)",
                }}
              >
                <div className="product-list-inner">
                  <em
                    style={{
                      width: "100%",
                      height: 150,
                      //   border: "1px solid black",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={book.base64image}
                      className="image"
                      alt="dummyimage"
                      style={{
                        // width: "100%",
                        height: "150px",
                      }}
                    />
                  </em>
                  <div
                    className="content-wrapper"
                    style={{
                      // border:'1px solid #000',
                      display: "flex",
                      alignItems: "center",
                      // justifyContent: 'flex-start',
                      flexDirection: "column",
                      margin: 10,
                      overflow: "scroll",
                    }}
                  >
                    <Typography
                      variant="h5"
                      color="primary"
                      style={{
                        // fontWeight:'bold'
                        maxHeight: "20",
                        overflow: "hidden",
                      }}
                    >
                      {book.name}
                    </Typography>
                    <Typography variant="subtitle1" color="secondary">{book.category}</Typography>
                    <Typography
                      variant="subtitle2"
                      className="description"
                      style={{
                        height: 48,
                        // lineHeight: 20,
                        // border:'1px solid #000',

                        textAlign: "center",
                        fontSize: 16,
                        overflow: "scroll",
                      }}
                    >
                      {book.description}
                    </Typography>
                    <Typography>MRP &#8377; {book.price}</Typography>
                    <Button variant="contained" color="primary" onClick={() => addToCart(book)}>
                      Add To Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>



        <div className="pagination-wrapper" 
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginBlock:20
        }}>
          <Pagination
            count={bookResponse.totalPages}
            page={filters.pageIndex}
            onChange={(e, newPage) => {
              setFilters({ ...filters, pageIndex: newPage });
            }}
          />
        </div>


      </div>
    </div>
  );
}
