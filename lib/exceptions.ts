

export class AuthenticationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "Authentication Error";
    }
}

export class NetworkError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "Network Error";
    }
}

export class UsernameConflictError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "Username Conflict Error";
    }
}