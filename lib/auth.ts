import api from "./axios";
import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
} from "@/types/auth";

import { AuthenticationError, NetworkError, UsernameConflictError } from "./exceptions";

export async function loginUser(data: LoginRequest) {
    const response = await api.post<LoginResponse>(
        "/users/login",
        data
    );

    if(response.status === 200) {
        return response.data;
    }
    else if(response.status === 400) {
        throw new AuthenticationError("Invalid credentials");
    }
    else {
        throw new NetworkError("Something went wrond");
    }

    
}

export async function registerUser(data: RegisterRequest) {
    const response = await api.post(
        "/users/register",
        data
    );

    if(response.status === 201) {
        return response.data;
    }
    else if(response.status === 409) {
        throw new UsernameConflictError("Username alreay taken");
    }
    else {
        throw new NetworkError("Something went wrong");
    }
}