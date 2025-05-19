// This file contains authentication-related service functions

// Initialize ApperClient with environment variables
const initApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Logout function
export const logout = async () => {
  try {
    const { ApperUI } = window.ApperSDK;
    await ApperUI.logout();
    return true;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};