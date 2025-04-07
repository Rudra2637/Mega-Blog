import conf from "../confi/conf";
import { Client, Account,ID } from "appwrite";

export class AuthService{
    client = new Client();
    account;
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({email,password,name}){
        try {
            const data = await this.account.create(ID.unique(),email,password,name);
            if(data){
                return this.login({email,password})           // Insures if the user is created successfully then redirect login the user
            }
            else{
                return data
            } 
        } catch (error) {
            throw error;
        }
    }

    async login({email,password}){
        try {
            return await this.account.createEmailPasswordSession(email,password);
        } catch (error) {
            throw error;
        }
    }

    async getUser(){
        try {
            return await this.account.get();
        } catch (error) {
            throw error;
        }

        return NULL;
    }

    async logout(){
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            throw error;
            return false;
        }
    }


}

const authService = new AuthService()

export default authService


// Can use this service in any component like this 
//Also in future if want to do the authentication in our program  
//can use this as these all the functions are the basic that are required 
//it's like snippets of code that are required for authentication