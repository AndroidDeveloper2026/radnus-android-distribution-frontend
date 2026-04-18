export const selectAuthState = (state) => {
  // // Check for admin auth first
  // if (state.adminAuth?.token) {
  //   return {
  //     token: state.adminAuth.token,
  //     role: 'Admin',
  //     user: state.adminAuth.admin,
  //     loading: state.adminAuth.loading || false,
  //     error: state.adminAuth.error || null,
  //     isCheckingAuth: false,
  //   };
  // }

    // ✅ Check for admin auth first
  if (state.adminAuth?.token && state.adminAuth?.admin) {
    return {
      token: state.adminAuth.token,
      role: 'Admin',
      user: state.adminAuth.admin,  // ← Admin data in 'user' field
      loading: state.adminAuth.loading || false,
      error: state.adminAuth.error || null,
      isCheckingAuth: state.adminAuth.isCheckingAuth || false,
    };
  }

  // Check for regular user auth
  if (state.auth?.token && state.auth?.user) {
    // ✅ Make sure role is properly extracted
    const userRole = state.auth.user.role || 
                     state.auth.user?.role || 
                     (state.auth.user?.authenticated ? null : null);
    
    
    return {
      token: state.auth.token,
      role: userRole,
      user: state.auth.user,
      loading: state.auth.loading || false,
      error: state.auth.error || null,
      isCheckingAuth: state.auth.isCheckingAuth || false,
    };
  }

  // Default state (not logged in)
  return {
    token: null,
    role: null,
    user: null,
    loading: false,
    error: null, 
    isCheckingAuth: state.auth?.isCheckingAuth || false,
  };
};