import agent from "@/agent";
import { APP_LOAD, LOGIN, LOGOUT } from '@/store/constants';

const emptyStoredValues = async () => {
	if(localStorage.getItem('jwt')) { localStorage.setItem("jwt", ""); }
	localStorage.setItem("LSLT", "");
	localStorage.setItem("OSTL", "");
	agent.setToken(null);
}

const setStoredValues = async (payload: any) => {
	localStorage.setItem("jwt", payload.token);
	localStorage.setItem("LSLT", new Date().getTime().toString());
	agent.setToken(payload.token);
}

const authMiddleware = (store: any) => (next: any) => (action: any) => {
	if (action.type === LOGIN) {
		//console.log("action",action)
		if (action && !action.error && action?.payload?.isSuccess === true && action?.payload?.data?.token) {
			setStoredValues(action.payload.data)
		}
	} else if (action.type === LOGOUT) {
		emptyStoredValues()
	} else if (action.type === APP_LOAD) {
		if (action.error) {
			emptyStoredValues();
		}
		if(action.payload == null && action.token == "") {
			emptyStoredValues();
		}
	}

	next(action);
}

export default authMiddleware;