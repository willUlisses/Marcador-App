export interface User {
    id : number;
    username : string;
    email : string;
    role: string;
}

export interface PatchUserBody {
    email?: string;
    username?: string;
}

export interface ChangePasswordBody {
    currentPassword: string,
    newPassword: string,
}

export interface UserStatsResponse {
    books_read: number;
    books_in_queue: number;
    total_pages_read: number;
}