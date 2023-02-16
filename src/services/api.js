import http from "../http-common";

const getAll = () => {
  return http.get("/data");
};

const get = id => {
  return http.get(`/data/${id}`);
};

const create = data => {
  return http.post("/data", data);
};

const update = (id, data) => {
  return http.put(`/data/${id}`, data);
};

const remove = id => {
  return http.delete(`/data/${id}`);
};

const removeAll = () => {
  return http.delete(`/projects`);
};

const findByTitle = title => {
  return http.get(`/projects?title=${title}`);
};

const projectservice = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByTitle
};

export default projectservice;