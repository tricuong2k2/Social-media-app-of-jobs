export const login = (payload) => ({
  type: "LOGIN",
  payload,
});

export const logout = () => ({
  type: "LOGOUT",
});

export const setAdminInfo = (payload) => ({
  type: "SET_ADMIN_INFO",
  payload,
});

export const setEmployerInfo = (payload) => ({
  type: "SET_EMPLOYER_INFO",
  payload,
});

export const setCandidateInfo = (payload) => ({
  type: "SET_CANDIDATE_INFO",
  payload,
});