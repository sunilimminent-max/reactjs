import { ASYNC_START, ASYNC_END } from '@/store/constants';

function isPromise(v: any) {
  	return v && typeof v.then === "function";
}

const mainMiddleware = (store: any) => (next: any) => (action: any) => {
	//console.log("mainMiddleware", action)
	if (isPromise(action.payload)) {
		store.dispatch({ type: ASYNC_START, subtype: action.type });
		//const skipTracking = action.skipTracking;

		action.payload.then((res: any) => {
			action.payload = res;
			store.dispatch({ type: ASYNC_END, promise: action.payload });
			store.dispatch(action);
		}, (error: any) => {			
			action.error = true;
			action.payload =
				error && error.response && error.response.body
				? error.response.body
				: error.response || error;
			if (!action.skipTracking) {
				store.dispatch({ type: ASYNC_END, promise: action.payload });
			}
			
			store.dispatch(action);
		});

		return;
	}

	next(action);
}

export default mainMiddleware;