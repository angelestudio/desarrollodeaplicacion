import { defineStore } from "pinia";
import Login from '@/providers/LoginProviders';
import { toast } from "vue3-toastify";

type State ={
    username: string,
    password: string
}

export const loginStore = defineStore('login',{
    actions:{
        validateUser(username: string, password: string){
            return new Promise( r => {
                let request;
                request = Login.login({
                    username :username,
                    password :password
                })
                request.then(res=>{
                    toast('Login Correcto', {type: toast.TYPE.SUCCESS})
                }).catch(e=>{
                    toast('Login Incorrecto', {type: toast.TYPE.ERROR});
                    })
                
            })
        }
    }
})
