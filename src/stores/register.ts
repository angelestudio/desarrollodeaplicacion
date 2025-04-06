import { defineStore } from "pinia";
import register from '@/providers/RegisterProviders';
import { toast } from "vue3-toastify";

type State ={

    Nombre: string,
    Apellido: string,
    rol: string,
    phone: string,
    email: string,
    password: string,
    confirmPassword: string
}

export const registerStore = defineStore('register',{
    actions:{
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validateUser(Nombre: string, Apellido: string, rol: string,phone: string,email: string,password: string, confirmPassword: string){
            return new Promise( r => {
                let request;
                request = register.register({
                    
                     Nombre: Nombre,
                    Apellido: Apellido,
                    rol:  rol,
                     phone:  phone,
                     email: email,
                    password:password ,
                     confirmPassword: confirmPassword
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