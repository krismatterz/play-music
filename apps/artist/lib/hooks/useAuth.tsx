import { useState } from "react";

// Define user type
type User = {
  displayName: string;
  email: string;
} | null;

// Mock user for demo purposes
const mockUser: User = {
  displayName: "Demo User",
  email: "user@example.com",
};

export function useAuth() {
  const [user, setUser] = useState<User>(mockUser);
  const [loading, setLoading] = useState(false);

  // Mock sign out function
  const signOut = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setUser(null);
    setLoading(false);
    return true;
  };

  return {
    user,
    loading,
    signOut,
  };
}
