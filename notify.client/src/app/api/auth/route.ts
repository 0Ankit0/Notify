// Typescript interface for our user object
export interface User {
    id: string;
    username: string;
    email: string;
    // Add any other user properties you need
  }
  
  // Function to make the AJAX call to the server
  export async function loginUser(username: string, password: string): Promise<User | null> {
    try {
      const response = await fetch('https://localhost:44320/api/User/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const user: User = await response.json();
      return user;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }
  
  // Function to save user data to sessionStorage
  export function saveUserSession(user: User): void {
    sessionStorage.setItem('user', JSON.stringify(user));
  }
  
  // Function to get user data from sessionStorage
  export function getUserSession(): User | null {
    const userJson = sessionStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
  
  // Function to remove user data from sessionStorage
  export function clearUserSession(): void {
    sessionStorage.removeItem('user');
  }
  
  // Function to check if user is authenticated
  export function isAuthenticated(): boolean {
    return getUserSession() !== null;
  }