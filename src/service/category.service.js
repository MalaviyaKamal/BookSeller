import request from "./request";

const categoryURL = "api/category";

const getAll = async (params) => {
  let url = `${categoryURL}/all`;
  if (params) {
    url = `${categoryURL}`;
  }
  return request.get(url, { params }).then((res) => {
    return res;
  });
};

const getById = async (id) => {
  const url = `${categoryURL}/byId?id=${id}`;
  return request.get(url).then((res) => {
    return res;
  });
};

const deleteCategory = async (id) => {
  const url = `${categoryURL}?id=${id}`;
  return request.delete(url).then((res) => {
    return res;
  });
};

const save = async (data) => {
  if (data.id) {
    const url = `${categoryURL}`;
    return request.put(url, data).then((res) => {
      return res;
    });
  } else {
    const url = `${categoryURL}`;
    return request.post(url, data).then((res) => {
      return res;
    });
  }
};

const categoryService = { getAll, getById, deleteCategory, save };

export default categoryService;