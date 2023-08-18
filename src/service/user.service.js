import request from "./request";

const mainURL = "api/user";

const getAllUsers = async (params) => {
  const url = `${mainURL}`;
  return request.get(url, { params }).then((res) => {
    return res;
  });
};

const getAllRoles = async () => {
  const url = `${mainURL}/roles`;
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

const deleteUser = async (id) => {
  const url = `${mainURL}/?id=${id}`;
  return request.delete(url).then((res) => {
    return res;
  });
};

const update = async (data) => {
  const url = `${mainURL}`;
  return request.put(url, data).then((res) => {
    return res;
  });
};

const updateProfile = async (data) => {
  const url = `${mainURL}`;
  return request.put(url, data).then((res) => {
    return res;
  });
};

const userService = {
  getAllUsers,
  getAllRoles,
  getById,
  deleteUser,
  update,
  updateProfile,
};

export default userService;
