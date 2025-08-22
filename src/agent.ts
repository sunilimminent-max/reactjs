import axios from 'axios';
import store from '@/store';

const API_ROOT = "/api";
let token: any = null;
const tokenPlugin = (req: any) => {
  	// if (token) {
    // 	req.set("Authorization", `Bearer ${token}`);
  	// }
};

const instance = axios.create({});

instance.interceptors.request.use(
  config => {
    if(token){
	   //	console.log("token",token)
    	config.headers["Authorization"] = "Bearer " + token;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// Response interceptor for customizing responses
instance.interceptors.response.use(
  (response: any) => {
    // Customize successful responses
    const { data, status, statusText } = response;
    
    // Log successful responses (optional)
    //console.log(`✅ API Response [${status}]:`, data);
    
    // Transform response data if needed
    if (data && typeof data === 'object') {
      // Add timestamp to response
      data._timestamp = new Date().toISOString();
      
      // Handle pagination data
      if (data.pagination) {
        data.hasMore = data.pagination.currentPage < data.pagination.totalPages;
      }
      
      // Handle success messages
      if (data.message && !data.success) {
        data.success = true;
      }
    }
    
    // Return the original response with modified data
    response = {
      data: data?.data || data,
      isSuccess: data?.isSuccess || true,
      message: data?.message || '',
      outParam: data?.outParam || null,
      status,
      statusText
    };
    
    return response;
  },
  error => {
    // Customize error responses
    const { response, request, message } = error;
    
    // console.error(`❌ API Error:`, {
    //   message: message,
    //   status: response?.status,
    //   data: response?.data,
    //   url: request?.responseURL
    // });
    
    // Handle different types of errors
    let customError: any = {
      isSuccess: false,
      message: 'An unexpected error occurred',
      status: 500,
      data: null
    };
    
    if (response) {
      // Server responded with error status
      const { status, data } = response;
      
      switch (status) {
        case 400:
          customError = {
            isSuccess: false,
            message: data?.message || 'Bad Request',
            status,
            data: data?.data || data
          };
          break;
        case 401:
          customError = {
            isSuccess: false,
            message: data?.message || 'Unauthorized - Please login again',
            status,
            data: data?.data || data
          };
          // Handle token expiration
          if (token) {
            console.log('Token expired, redirecting to login...');
            // You can dispatch a logout action here
            // store.dispatch({ type: 'auth/logout' });
          }
          break;
        case 403:
          customError = {
            isSuccess: false,
            message: data?.message || 'Forbidden - Access denied',
            status,
            data: data?.data || data
          };
          break;
        case 404:
          customError = {
            isSuccess: false,
            message: data?.message || 'Resource not found',
            status,
            data: data?.data || data
          };
          break;
        case 422:
          customError = {
            isSuccess: false,
            message: data?.message || 'Validation failed',
            status,
            data: data?.data || data,
            errors: data?.errors || []
          };
          break;
        case 500:
          customError = {
            isSuccess: false,
            message: data?.message || 'Internal server error',
            status,
            data: data?.data || data
          };
          break;
        default:
          customError = {
            isSuccess: false,
            message: data?.message || `HTTP Error ${status}`,
            status,
            data: data?.data || data
          };
      }
    } else if (request) {
      // Request was made but no response received
      customError = {
        isSuccess: false,
        message: 'No response from server - Please check your connection',
        status: 0,
        data: null
      };
    } else {
      // Something else happened
      customError = {
        isSuccess: false,
        message: message || 'Network error',
        status: 0,
        data: null
      };
    }
    
    // Add timestamp to error
    customError._timestamp = new Date().toISOString();
    
    return Promise.reject(customError);
  }
);


const requests = {


	del: (url: string) =>
		instance.delete(`${API_ROOT}${url}`),
	get: (url: string, body: any = "") =>	{
		if(body != ""){
			  body = { params: body }
		}
		return instance.get(`${API_ROOT}${url}`, body)
	},
	put: (url: string, body: any) =>
		instance
			.put(`${API_ROOT}${url}`, body),
	post: (url: string, body: any, config: any = "") =>
		instance
			.post(`${API_ROOT}${url}`, body, config)
}

const Auth = {
	user: () => requests.get("/auth/user"),
	logout: () => requests.post("/auth/logout",{}),
	login: (formData: any) => requests.post("/auth/login", formData),
	getUserRole: () => requests.get("/auth/getUserRole"),
}
const User = {
	updateProfile: (formData: any) => requests.post("/auth/updateProfile",formData),
}
const Admin = {
	getUsers: (data: any) => requests.get("/user/getUsers",data),
	AddEditUser: (formData: any) => requests.post("/user/AddEditUser",formData),
	getUserById: (data: any) => requests.get("/user/getUserById/"+data.userid,""),
}
const Manager = {
	getProjects: (data: any) => requests.get("/project/getProjects",data),
	AddEditProject: (formData: any) => requests.post("/project/AddEditProject",formData),
	getProjectById: (data: any) => requests.get("/project/getProjectById/"+data.id,""),
}
const Project = {
	getAllProject: () => requests.get("/project/getAllProject"),
}
const Task = {
	AddEditTask: (formData: any) => requests.post("/task/AddEditTask",formData),
	getTasks: (data: any) => requests.get("/task/getTasks",data),
	getTaskById: (data: any) => requests.get("/task/getTaskById/"+data.id,""),
	AddComment: (formData: any) => requests.post("/task/AddComment/",formData),
	getComments: (data: any) => requests.get("/task/getComments/"+data.id,data),
}
const Chat = {
	sendMessage: (formData: any) => requests.post("/chat/sendMessage",formData),
	sendFileMessage: (formData: any,config: any) => requests.post("/chat/sendFileMessage",formData, config),
	getChatByConId: (formData: any) => requests.post("/chat/getChatByConId",formData),
	addChatUser: (formData: any) => requests.post("/chat/addChatUser",formData),
	getConversations: () => requests.get("/chat/getConversations"),
}
const Page = {
	getPages: () => requests.get("/pages"),
	pages: (formData: any) => requests.post("/pages",formData),
	getHomePage: () => requests.get("/pages/home"),
	saveHomePage: (formData: any) => requests.post("/pages/home",formData),
}
const Group = {
	getGroup: () => requests.get("/custom-fields/groups"),
	groupFields: (group_id: any) => requests.get(`/api/custom-fields/groups/${group_id}/fields`),
	createGroup: (formData: any) => requests.post("/custom-fields/groups",formData),
	createField: (formData: any) => requests.post("/custom-fields/fields",formData),
  
} 
// Utility functions for response customization
const responseUtils = {
  // Transform paginated data
  transformPaginatedData: (data: any) => {
    if (data && data.pagination) {
      return {
        ...data,
        hasMore: data.pagination.currentPage < data.pagination.totalPages,
        totalPages: data.pagination.totalPages,
        currentPage: data.pagination.currentPage,
        totalItems: data.pagination.totalItems
      };
    }
    return data;
  },

  // Add metadata to response
  addMetadata: (data: any, metadata: any = {}) => {
    return {
      ...data,
      _metadata: {
        timestamp: new Date().toISOString(),
        ...metadata
      }
    };
  },

  // Validate response structure
  validateResponse: (data: any) => {
    if (!data) return false;
    if (typeof data === 'object' && data.success === false) return false;
    return true;
  }
};

export default {
	Auth,
	User,
	Admin,
	Manager,
	Project,
	Task,
	Chat,
  Page,
  Group,
	setToken: (_token: any) => {
    	token = _token;
  },
	responseUtils,
};