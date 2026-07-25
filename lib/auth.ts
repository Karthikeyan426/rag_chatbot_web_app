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

    return response.data;
}

export async function registerUser(data: RegisterRequest) {
    const response = await api.post(
        "/users/register",
        data
    );
    
    return response.data;
}