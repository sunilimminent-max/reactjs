import axios from 'axios';
import agent from '../../agent';
import store from '../../Store';
import { io } from "socket.io-client";
export default {
    namespaced: true,
    state: {
        isLogin: false,
        user: null,
        token: null,
        socketid: null,
    },
    getters: {
        isLogin(state) {
            return state.isLogin
        },
        user(state) {
            return state.user
        },
        token(state) {
            return state.token
        }
    },
    mutations: {
        setSocket(state, socketid) {
          state.socketid = socketid;
        },
        setLogin(state, value) {
            state.isLogin = value
        },
        setUser(state, value) {
            state.user = value
        },
        setToken(state, value) {
            state.token = value
            state.isLogin = true
        },
        LogOut(state){
            state.user = null
            state.token = null
            state.isLogin = false
        },
    },
    actions: {
        async getUser({commit}) {
                  await agent.Auth.user().then(response => {

                      if(response.data.data.user){
                        store.commit('auth/setUser', response.data.data.user);
                      }
                      return response;
                  })
                  .catch(error => {
                     commit('setUser', null)
                     commit('setToken', null)
                     commit('setLogin', false)
                     //this.$router.push('/')
                     window.location.reload();
                  });
        },
        async getUserRole({commit}) {

            return await agent.Auth.getUserRole();
        },
        async logout({commit}) {
                commit('setUser', null)
                commit('setToken', null)
                commit('setLogin', false)
                window.location.reload();
        },
        async initializeSocket({commit}) {

            if(this.state.auth && this.state.auth.token){
                let __that = this;
                var token = this.state.auth.token;
                let socket = io(`${import.meta.env.VITE_API_URL}`, {
                    transports: ["websocket"],
                    auth: {
                      token: token
                    }
                });

                socket.on("connect", async function() {
                   console.log("connected to server", socket);
                   socket.emit('add-client', __that.state.auth.user);
                });

                return socket;

            }else{
                return null;
            }
        },
    }
}