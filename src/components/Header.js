import React from "react";
import { NavLink } from "react-router-dom";
import siteLogo from '../assets/Tatvasoftlogo.svg';
import { List, Button, Input, ListItem, ListItemText } from "@material-ui/core";
import "./Header.css";
import bookService from "../service/book.service";
import { useAuthContext } from "../contexts/auth";
import { useCartContext } from "../contexts/cartContext";
import shared from "../utils/Shared";


export default function Header() {
  const authContext = useAuthContext();
  const cartContext = useCartContext();
  const [value, setValue] = React.useState("");
  let [bookList, setBookList] = React.useState([]);
  const [showSearch, setShowSearch] = React.useState(false);
  const [showList, setShowList] = React.useState(false);

  const addToCart = (book) => {
    shared.addToCart(book, authContext.user.id).then((res) => {
      if (res.error) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        cartContext.updateCart();
      }
    });
  };

  const SearchBar = (
    <Input
      name="search"
      label="First Name"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      style={{
        marginInline: 30,
        width: 400,
        backgroundColor: "white",
        position: "absolute",
        right: 25,
        top: 8,
        paddingInline: 10,
        zIndex: 110,
      }}
    />
  );

  const toogleSearch = () => {
    setShowSearch((prev) => !prev);
    setBookList([]);
    setValue("");
    setShowList(false);
  };
  const onSearch = async () => {
    if (!showSearch) {
      toogleSearch();
      return;
    }
    console.log("searching....");
    const res = await bookService.searchBook(value);
    setBookList(res);
    setShowList(true);
    console.log("BOOKLIST ", bookList);
  };


  return (
    <>
    <div className="header">
   
       
           <div className='headerWrapper'>
           <div className='headerLogo' style={{ textAlign: 'left' }}>
           <img src={siteLogo} alt='logo' />
           </div>
           </div>
        
        
      
        {authContext.user.id!=0 && 
           (
            <>
          <div className='headerWrapper2'>
           <div className='headerLogo2' style={{ textAlign: 'left' }}>
           <img src={siteLogo} alt='logo' />
           </div>
           </div>

            <NavLink to="/">HOME</NavLink>
            <NavLink to="/product">ViewBook</NavLink>
            <NavLink to="/add-book">AddBook</NavLink>
            {/* <NavLink to="/bookList">Book List</NavLink> */}
            <NavLink to="/users">Users</NavLink>
            <NavLink to="/category">Categories</NavLink>
            <NavLink to="/cart">Cart</NavLink>
            {/* <NavLink to="/update-profile">Update Profile</NavLink> */}
            <Button color='primary' onClick={()=>authContext.signOut()}>LogOut</Button>
          
        
          </>
        )}
  

        {!authContext.user.id && <NavLink to="/register">Register</NavLink>}
        {!authContext.user.id && <NavLink to="/login">Login</NavLink>}

        <div className="search" onClick={onSearch}>
          🔎
        </div>
      </div>
      {showSearch && SearchBar}
      {showSearch && <div className="overlay" onClick={toogleSearch}></div>}
      {showSearch && showList && (
        <List
          style={{
            zIndex: 120,
            width: 400,
            position: "absolute",
            right: 55,
            backgroundColor: "violet",
            paddingInline: 10,
            maxHeight: 280,
            overflowY: "scroll",
          }}
        >
          {bookList.length === 0 && <ListItem>No Book Found</ListItem>}
          {bookList.map((book) => {
            console.log(book);
            return (
              <ListItem
                key={book.id}
                style={{
                  boxShadow: "1px 1px 1px grey",
                  backgroundColor: "rgba(255, 255,255)",
                  borderRadius: 10,
                  marginBlock: 10,
                }}
              >
                <ListItemText
                  primary={book.name}
                  secondary={book.category}
                  primaryTypographyProps={{ color: "primary" }}
                  secondaryTypographyProps={{ color: "secondary" }}
                />
                <Button variant="contained" color="secondary" onClick={() => addToCart(book)}>
                  Add to Cart
                </Button>
              </ListItem>
            );
          })}
        </List>
      )}
    </>
  );
}
