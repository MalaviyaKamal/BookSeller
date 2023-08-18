import React, { useEffect, useState } from "react";
import { cartStyle } from "./style";
import { Typography, Button, Link } from "@material-ui/core";
import cartService from "../service/cart.service";
import { useAuthContext } from "../contexts/auth";
import { toast } from "react-toastify";
import { Grid } from "@material-ui/core";
import orderService from "../service/order.service";
import Shared from "../utils/Shared";
import { useCartContext } from "../contexts/cartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const authContext = useAuthContext();
  const cartContext = useCartContext();
  const navigate = useNavigate();

  const [cartList, setCartList] = useState([]);
  const [itemsInCart, setItemsInCart] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const classes = cartStyle();

  const getTotalPrice = (itemList) => {
    let totalPrice = 0;
    itemList.forEach((item) => {
      const itemPrice = item.quantity * parseInt(item.book.price);
      totalPrice = totalPrice + itemPrice;
    });
    setTotalPrice(totalPrice);
  };

  useEffect(() => {
    setCartList(cartContext.cartData);
    setItemsInCart(cartContext.cartData.length);
    getTotalPrice(cartContext.cartData);
  }, [cartContext.cartData]);

  const removeItem = async (id) => {
    try {
      const res = await cartService.removeItem(id);
      if (res) {
        cartContext.updateCart();
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const updateQuantity = async (cartItem, inc) => {
    const currentCount = cartItem.quantity;
    const quantity = inc ? currentCount + 1 : currentCount - 1;
    if (quantity === 0) {
      toast.error("Item quantity should not be zero");
      return;
    }

    try {
      const res = await cartService.updateItem({
        id: cartItem.id,
        userId: cartItem.userId,
        bookId: cartItem.book.id,
        quantity,
      });
      if (res) {
        const updatedCartList = cartList.map((item) =>
          item.id === cartItem.id ? { ...item, quantity } : item
        );
        cartContext.updateCart(updatedCartList);
        const updatedPrice =
          totalPrice +
          (inc
            ? parseInt(cartItem.book.price)
            : -parseInt(cartItem.book.price));
        setTotalPrice(updatedPrice);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const placeOrder = async () => {
    if (authContext.user.id) {
      const userCart = await cartService.getList(authContext.user.id);
      if (userCart.length) {
        try {
          let cartIds = userCart.map((element) => element.id);
          const newOrder = {
            userId: authContext.user.id,
            cartIds,
          };
          const res = await orderService.placeOrder(newOrder);
          if (res) {
            cartContext.updateCart();
            navigate("/");
            toast.success("sucessfullly ordered");
          }
        } catch (error) {
          toast.error(`Order cannot be placed ${error}`);
        }
      } else {
        toast.error("Your cart is empty");
      }
    }
  };

  return (
    <>
      <Typography variant="h4" color="primary" align="center">
        <br/>
        YOUR CART
      </Typography>
      <br />
      <Grid
        container
        justifyContent="space-between"
        style={{ Width: "80vw", maxWidth: "700px", marginInline: "auto" }}
      >
        <Grid item xs={6}>
          <Typography variant="h5" color="secondary">
            My Shopping Cart ({itemsInCart} items)
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6">Total price: {totalPrice}</Typography>
        </Grid>
      </Grid>
      <br />
      <div className="container">
        <div
          className="cart-list-wrapper"
          style={{
            border: "1px solid black",
            Width: "80vw",
            maxWidth: "700px",
            marginInline: "auto",
            borderRadius: "5px",
            maxHeight:'400px',
            overflowY: "auto",
          }}
        >
          {cartList.map((cartItem) => {
            return (
              <div
                key={cartItem.id}
                style={{
                  border: "1px solid grey",
                  display: "flex",
                  backgroundColor:'rgba(122,122,122,0.1)',
                  width: "90%",
                  maxWidth: "700px",
                  borderRadius: 5,
                  marginInline: "auto",
                  marginBlock: "10px",
                  height: "120px",

                }}
              >
                <div
                  className="cart-item-img"
                  style={{
                    width: "100px",
                    height: "100px",
                    marginBlock: "auto",
                    marginInline: 10,
                  }}
                >
                  <img
                    src={cartItem.book.base64image}
                    alt="dummy-pic"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
                <div
                  className="cart-item-content"
                  style={{
                    width: "80%",
                    height:'100%',
                    display:'flex',
                    flexDirection:'column',
                    alignContent:'space-between',
                    justifyContent:'space-evenly',
                  }}
                >
                  <div
                    className="cart-item-top-content"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div className="cart-item-left">
                      <Typography variant="h6" color="primary">
                        {cartItem.book.name}
                      </Typography>
                      <Typography variant="subtitle2">
                        {cartItem.book.category}
                      </Typography>
                    </div>
                    <div className="price-block">
                      <Typography variant="h6">
                        MRP &#8377; {cartItem.book.price}
                      </Typography>
                    </div>
                  </div>

                  <div
                    className="cart-item-bottom-content"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div className="qty-group"
                    style={{
                        display: "flex",
                    }}>
                      <Button
                        color="primary"
                        variant="outlined"
                        size="small"
                        onClick={() => updateQuantity(cartItem, true)}
                      >
                        +
                      </Button>
                      <Typography variant="h6" style={{marginInline:10}}>{cartItem.quantity}</Typography>
                      <Button
                        color="primary"
                        variant="outlined"
                        size="small"
                        onClick={() => updateQuantity(cartItem, false)}
                      >
                        -
                      </Button>
                    </div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => removeItem(cartItem.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="btn-wrapper">
          <Button variant="contained" color="secondary" onClick={placeOrder}
          style={{
            position: "absolute",
            bottom: 20,
            right: 50,
          }}>
            Place order
          </Button>
        </div>
      </div>
    </>
  );
};

export default Cart;
