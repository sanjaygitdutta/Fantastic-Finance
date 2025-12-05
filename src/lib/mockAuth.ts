// Mock Authentication Service using localStorage
// This provides a temporary authentication solution without requiring Supabase

interface User {
    id: string;
    email: string;
    created_at: string;
}

interface AuthResponse {
    user: User | null;
    error: Error | null;
}

class MockAuthService {
    private USERS_KEY = 'mock_auth_users';
    private SESSION_KEY = 'mock_auth_session';

    private getUsers(): Record<string, { email: string; password: string; created_at: string }> {
        const users = localStorage.getItem(this.USERS_KEY);
        return users ? JSON.parse(users) : {};
    }

    private saveUsers(users: Record<string, { email: string; password: string; created_at: string }>) {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    private getSession(): User | null {
        const session = localStorage.getItem(this.SESSION_KEY);
        return session ? JSON.parse(session) : null;
    }

    private saveSession(user: User | null) {
        if (user) {
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(this.SESSION_KEY);
        }
    }

    private listeners: ((user: User | null) => void)[] = [];

    private notifyListeners() {
        const user = this.getUser();
        this.listeners.forEach(listener => listener(user));
    }

    async signUp(email: string, password: string): Promise<AuthResponse> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = this.getUsers();

                if (users[email]) {
                    resolve({
                        user: null,
                        error: new Error('User already exists')
                    });
                    return;
                }

                const userId = `user_${Date.now()}`;
                const created_at = new Date().toISOString();

                users[email] = { email, password, created_at };
                this.saveUsers(users);

                const user: User = {
                    id: userId,
                    email,
                    created_at
                };

                this.saveSession(user);
                this.notifyListeners();

                resolve({ user, error: null });
            }, 500); // Simulate network delay
        });
    }

    async signIn(email: string, password: string): Promise<AuthResponse> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = this.getUsers();
                const userRecord = users[email];

                if (!userRecord || userRecord.password !== password) {
                    resolve({
                        user: null,
                        error: new Error('Invalid email or password')
                    });
                    return;
                }

                const user: User = {
                    id: `user_${email}`,
                    email,
                    created_at: userRecord.created_at
                };

                this.saveSession(user);
                this.notifyListeners();

                resolve({ user, error: null });
            }, 500); // Simulate network delay
        });
    }

    async signOut(): Promise<{ error: Error | null }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.saveSession(null);
                this.notifyListeners();
                resolve({ error: null });
            }, 300);
        });
    }

    getUser(): User | null {
        return this.getSession();
    }

    onAuthStateChange(callback: (user: User | null) => void) {
        // Initial call
        callback(this.getUser());

        // Add to listeners
        this.listeners.push(callback);

        // Listen for storage changes (for multi-tab support)
        const handler = (e: StorageEvent) => {
            if (e.key === this.SESSION_KEY) {
                callback(this.getUser());
            }
        };

        window.addEventListener('storage', handler);

        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
            window.removeEventListener('storage', handler);
        };
    }
}

export const mockAuth = new MockAuthService();
