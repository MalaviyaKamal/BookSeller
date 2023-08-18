import request from "./request";

const Carturl = "api/cart";

const add = async (data) => {
  const url = `${Carturl}`;
  return request
    .post(url, data)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return Promise.reject(e.response);
    });
};

const getList = async (id) => {
  const url = `${Carturl}?userId=${id}`;
  return request.get(url).then((res) => {
    return res;
  });
};

const updateItem = async (data) => {
  const url = `${Carturl}`;
  return request
    .put(url, data)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return Promise.reject(e);
    });
};

const removeItem = async (id) => {
  const url = `${Carturl}?id=${id}`;
  return request
    .delete(url)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e;
    });
};

const cartService = { add, getList, updateItem, removeItem };

export default cartService;