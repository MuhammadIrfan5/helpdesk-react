export const isAuthenticated = (state) => {
  // if (state.auth.auth.idToken) return true;
  if (state.UserLogin.data) return true;
  return false;
};
