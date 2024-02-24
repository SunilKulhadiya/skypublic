import {
  STOREUSER,
  VERIFYNEWUSER,
  RECOVER,
  RESETRECOVER,
  LOGOUT,
  UPDATE_PIC,
} from './ActionTypes';

const initialState = {
  isLoggedIn: false,
  redirectToLogin: false,
  profileImage: '',
  customer: {
    userId: '',
    name: '',
    email: '',
    mobile: '',
    user_type: '',
    sub_type: '',
    //   middleName: "",
    // lastName: "",
    // address: "",
    // dob: "",
    // gender: '',
  },
  recoverFor: {
    password: '',
  },
};

const UserReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case STOREUSER:
      return {
        ...state,
        isLoggedIn: payload.isLoggedIn,
        customer: payload.customer,
      };
    case VERIFYNEWUSER:
      return {
        ...state,
        isLoggedIn: payload.isLoggedIn,
      };
    case RESETRECOVER:
      return {
        ...state,
        recoverFor: '',
      };

    case RECOVER:
      return {
        ...state,
        recoverFor: payload.recoverFor,
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        customer: {
          userId: '',
          name: '',
          email: '',
          mobile: '',
          user_type: '',
          sub_type: '',
          // middleName: "",
          // lastName: "",
          // address: "",
          // dob: "",
          // gender: '',
        },
        recoverFor: {
          email: '',
        },
        redirectToLogin: true,
      };
    case UPDATE_PIC:
      return {
        ...state,
        profileImage: payload.image,
      };
    default:
      return state;
  }
};

export default UserReducer;