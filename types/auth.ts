export interface LoginRequest {
    user_name: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
}

export interface RegisterRequest {
    user_name: string;
    password: string;
}