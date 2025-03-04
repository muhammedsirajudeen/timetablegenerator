

export const validatePassword = (password: string): string | null => {
    if (!password || password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    return null; 
  };
  
  export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  };
  
  export const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Enter a valid email address.";
    }
    return null;
  };
  