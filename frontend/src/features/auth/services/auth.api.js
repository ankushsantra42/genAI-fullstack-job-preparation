import axios from "axios";

export async function registerUser(userData){
    try{
        const response = await axios.post("http://localhost:3000/api/auth/register", userData,{withCredentials:true});
        console.log(response);
        
        return response.data;
    }
    catch(error){
        console.log(error);
    }
}


export async function loginUser(userData){
    try{
        const response = await axios.post("http://localhost:3000/api/auth/login", userData,{withCredentials:true});
        console.log(response);
        
        return response.data;
    }
    catch(error){
        console.log(error);
    }
}

export async function logoutUser(){
    try {
        const response = await axios.post("http://localhost:3000/api/auth/logout",{},{withCredentials:true});
        console.log(response);
        return response.data;
    } catch (error) {
        console.log(error);
        
    }
}

export async function getCurrentUser(){
    try {
        const response = await axios.get("http://localhost:3000/api/auth/current-user",{withCredentials:true});
        console.log(response);
        return response.data;
    } catch (error) {
        console.log(error);
        
    }
}