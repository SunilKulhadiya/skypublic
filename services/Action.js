import { STOREUSER, LOGOUT } from "./ActionTypes";

export const Login = user => ({
    type: STOREUSER,
    payload: {
        customer: user,
        isLoggedIn: true,
      },
});

export const Logout = () => ({
    type: LOGOUT,
});