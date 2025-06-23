export interface User {
    id: string;
    nickname: string;
    email: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

// Simple in-memory storage for demo purposes
// In production, you'd use a proper database
const users: Array<User & { password: string }> = [];

export class AuthService {
    private static readonly SESSION_KEY = 'verbum_dei_user';

    static getStoredUser(): User | null {
        if (typeof window === 'undefined') return null;

        try {
            const stored = sessionStorage.getItem(this.SESSION_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    }

    static setStoredUser(user: User): void {
        if (typeof window === 'undefined') return;
        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
    }

    static clearStoredUser(): void {
        if (typeof window === 'undefined') return;
        sessionStorage.removeItem(this.SESSION_KEY);
    }

    static async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return { success: false, error: 'Invalid email or password' };
        }

        const authUser: User = {
            id: user.id,
            nickname: user.nickname,
            email: user.email
        };

        this.setStoredUser(authUser);
        return { success: true, user: authUser };
    }

    static async register(nickname: string, email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check if user already exists
        if (users.find(u => u.email === email)) {
            return { success: false, error: 'Email already registered' };
        }

        const newUser = {
            id: Date.now().toString(),
            nickname,
            email,
            password
        };

        users.push(newUser);

        const authUser: User = {
            id: newUser.id,
            nickname: newUser.nickname,
            email: newUser.email
        };

        this.setStoredUser(authUser);
        return { success: true, user: authUser };
    }

    static logout(): void {
        this.clearStoredUser();
    }
}
