export interface User {
    userId: number;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    surName?: string;
    isAdmin: boolean;
}

export interface Activity {
    activityId: number;
    activityName: string;
    activityDescription?: string;
    activityTime: Date | string;
    endTime: Date | string;
    requestingUser: User;
    category: string;
}

export interface Comment {
    commentId: number;
    content: string;
    author: User;
    createdAt: Date | string;
}