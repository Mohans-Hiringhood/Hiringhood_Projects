export const loginUser = (email: string) => {
    localStorage.setItem("authUser", email); // Store user in LocalStorage
  };
  
  export const logoutUser = () => {
    localStorage.removeItem("authUser");
  };
  
  export const isUserAuthenticated = () => {
    return !!localStorage.getItem("authUser"); // Returns true if logged in
  };
  