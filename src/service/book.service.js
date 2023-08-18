import request from "./request";
const mainURL = "api/book";

const getAll = async (params) => {
    const url = `${mainURL}`;
    return request.get(url, { params }).then((res) => {
      return res;
    });
  };
  const searchBook = async (searchText) => {
    const url = `${mainURL}/search?keyword=${searchText}`;
    return request.get(url).then((res) => {
      return res;
    });
  };  
  const getById = async (id) => {
    const url = `${mainURL}/byId?id=${id}`;
    return request.get(url).then((res) => {
      return res;
    });
  };
  const deleteBook = async (id) => {
    const url = `${mainURL}?id=${id}`;
    return request.delete(url).then((res) => {
      return res;
    });
  };
  const save = async (data) => {
    if (data.id) {
      const url = `${mainURL}`;
      return request.put(url, data).then((res) => {
        return res;
      });
    } else {
      const url = `${mainURL}`;
      return request.post(url, data).then((res) => {
        return res;
      });
    }
  };
  const bookService = { getAll, getById, deleteBook, save, searchBook };

export default bookService;
