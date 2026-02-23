export const selectAuthState = (state) => {
  if (state.adminAuth?.token) {
    return {
      token: state.adminAuth.token,
      role: 'Admin',
      user: state.adminAuth.admin,
    };
  }

  if (state.auth?.token) {
    return {
      token: state.auth.token,
      role: state.auth.user?.role,
      user: state.auth.user,
    };
  }

  return {
    token: null,
    role: null,
    user: null,
  };
};
