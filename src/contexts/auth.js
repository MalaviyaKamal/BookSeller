import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
// import Shared from "../utils/shared";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export const RoutePaths = {
  Login: "/login",
  BookListing: "/bookList",
};

const intialUserValue = {
  id: 0,
  email: "",
  firstName: "",
  lastName: "",
  roleId: 0,
  role: "",
  password: "",
};

const initialState = {
  setUser: () => {},
  user: intialUserValue,
  signOut: () => {},
  appInitialize: false,
};

export const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
  const [appInitialize, setAppInitialize] = useState(false);
  const [user, _setUser] = useState(intialUserValue);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const setUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    _setUser(user);
  };

  useEffect(() => {
    const itemStr = JSON.parse(localStorage.getItem("user")) || intialUserValue;
    // if the item doesn't exist, return null
    if (!itemStr.id) {
      navigate(`${RoutePaths.Login}`);
    }
    _setUser(itemStr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = () => {
    setUser(intialUserValue);
    localStorage.removeItem("user");
    navigate(`${RoutePaths.Login}`);
  };

  useEffect(() => {
    if (pathname === RoutePaths.Login && user.id) {
      navigate(RoutePaths.BookListing);
    }

    if (!user.id) {
      return;
    }
    const access = true;
    if (!access) {
      toast.warning("Sorry, you are not authorized to access this page");
      navigate(RoutePaths.BookListing);
      return;
    }
    setAppInitialize(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, user]);

  let value = {
    user,
    setUser,
    signOut,
    appInitialize,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
