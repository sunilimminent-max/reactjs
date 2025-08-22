import {
	APP_LOAD, ASYNC_START, ASYNC_END, LOGIN, LOGOUT, REGISTER, EMPTY_LOGOUT, OTP_VERIFY, RESEND_OTP, CLEAR_OTP,
	RESET, EMPTY_RESET, RESET_OTP, RESEND_RESET_OTP, RESET_PASSWORD, UPDATE_PROFILE, CHANGE_PASSWORD, APP_LOGIN_CHECK,SET_HIDE_BAR, LOAD_PAGE,UNREAD_COUNT_CALLING, SET_SOCKET, SET_TOKEN
} from '../constants';

const initialState = {
  	appName: "Project Management",
  	token: null,
  	appLoaded: false,
  	newRegistration: false,
  	isLoggedIn: false
}

export default (state = initialState, action: any) => {
	// console.log('*************************************************** '+action.type)

	switch (action.type) {
		case APP_LOAD: {
			return {
				...state,
				appLoaded: true,
				currentUser: action?.payload?.user?.id ? action.payload.user : null,
				isLoggedIn: action?.payload?.user?.id ? true : false
			};
		}
		case LOAD_PAGE: {
			return {
				...state,
				pageLoaded: action.payload,
			};
		}
		case APP_LOGIN_CHECK: {
			return {
				...state,
				isLoggedIn: action.payload
			}
		}
		case SET_HIDE_BAR: {
			var HideBar = false;
			if(action.payload && action.payload.action == true){
				HideBar = true;
			}
			return { ...state, HideBar: HideBar  };
		}
		case ASYNC_START:
	        	return { 
	        		...state,
	        	};
	    case ASYNC_END:
	        return { 
	        	...state,
	        };
		case LOGOUT:
			return {
				...state,
				currentUser: null,
				isLoggedIn: false
			}
	    case LOGIN:
		case REGISTER:{

			//console.log("action",action)
      		return {
      			...state,
      			loginData: action?.payload ? action?.payload : null,
				token: action?.payload?.isSuccess && action?.payload?.data?.token ? action?.payload?.data?.token : null,
      		}
		}	
      	case EMPTY_LOGOUT:
      		return {
      			...state,
      			loginSuccess: null,
      			loginError: null,
      			logoutSuccess: false,
      			registerStatus: null
      		}
      	case RESET_PASSWORD:
      		return {
      			...state,
      			changePasswordValue: action && action.payload && action.payload.success ? 'success' : 'error',
      		}
      	case UPDATE_PROFILE:
                  return {
                        ...state,
                        currentUser: action && action.payload && action.payload.success ? action.payload.data : null,
                        profileStatus: action && action.payload && action.payload.success ? 'success' : 'error',
                  }
        case CHANGE_PASSWORD:
	            return {
	                  ...state,
	                  changePasswordStatus: action && action.payload && action.payload.success ? 'success' : 'error',
	            }	
        case UNREAD_COUNT_CALLING:

	            return {
	                  ...state,
	                  unreadCountCalling: action && action.success == "true" ? true : false,
	            }	
        case SET_SOCKET:
			return { ...state, socket: action.payload };
		case SET_TOKEN:
			return { ...state, token: action.payload };
      	case EMPTY_RESET:
      		return {
      			...state,
      			forgotPassword: null,
      			resetOtp: null,
      			resendReset: null,
      			changePasswordValue: null,
      			profileStatus: null,
                changePasswordStatus: null,
				loginData: null,
				token: null,
      		}
		default:
      		return state;
	}
}