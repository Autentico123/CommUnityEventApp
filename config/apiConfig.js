// Environment Configuration
// Update this file based on your development environment

// Determine the correct API URL based on your setup
const getApiUrl = () => {
  // DEVELOPMENT CONFIGURATIONS:

  // 1. Local development (default)
  // Use this when running Expo on the same machine as backend
  const LOCAL = "http://localhost:5000/api";

  // 2. Android Emulator
  // Android emulator requires special IP to access host machine
  const ANDROID_EMULATOR = "http://10.0.2.2:5000/api";

  // 3. Physical Device / iOS Simulator on different machine
  // Replace with your computer's local IP address
  // Find your IP:
  //   Windows: ipconfig
  //   Mac/Linux: ifconfig or ip addr
  const PHYSICAL_DEVICE = "http://10.0.1.63:5000/api"; // UPDATE THIS!


  // 4. Production (when you deploy)
  const PRODUCTION = "https://your-backend.herokuapp.com/api"; // UPDATE THIS!

  // CHOOSE YOUR ENVIRONMENT:
  // Uncomment the line that matches your setup:

  return PHYSICAL_DEVICE; // ← Default: localhost
  // return ANDROID_EMULATOR;      // ← Uncomment for Android Emulator
  // return PHYSICAL_DEVICE;       // ← Uncomment for physical device
  // return PRODUCTION;            // ← Uncomment for production
};

export const API_URL = getApiUrl();

// API Configuration
export const API_CONFIG = {
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
};

// Helper function to check if API is reachable
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_URL.replace("/api", "")}/api/health`, {
      method: "GET",
      timeout: 5000,
    });
    const data = await response.json();
    return data.status === "OK";
  } catch (error) {
    console.error("API health check failed:", error);
    return false;
  }
};

// Export for easy debugging
export const logApiConfig = () => {
  console.log("=================================");
  console.log("API Configuration:");
  console.log("URL:", API_URL);
  console.log("=================================");
};

export default {
  API_URL,
  API_CONFIG,
  checkApiHealth,
  logApiConfig,
};
