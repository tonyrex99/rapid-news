import AsyncStorage from "@react-native-async-storage/async-storage";

// The API key and default endpoint for the News API
export const API_KEY = `97d4da96e9c349c6a80fb1426cea7437`;
export const endpoint = `https://newsapi.org/v2/top-headlines`;

// The default country for the News API endpoint
export const country = "ng";

// Get the endpoint configuration from AsyncStorage
export async function getEndpoint() {
  try {
    const jsonValue = await AsyncStorage.getItem("config");
    console.log("Endpoint read success:", jsonValue);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.log("Endpoint reading error:", error);
    throw error;
  }
}

// Save the endpoint configuration to AsyncStorage
export async function storeEndpoint(value) {
  try {
    value.country = value.country || "ng"; // set default country if not provided
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("config", jsonValue);
    console.log("Endpoint saved success:", jsonValue);
  } catch (error) {
    console.log("Endpoint saving error:", error);
    throw error;
  }
}

// Save news data to AsyncStorage
export async function storeData(value) {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("news", jsonValue);
    console.log("Data saved success:", jsonValue);
  } catch (error) {
    console.log("Data saving error:", error);
    throw error;
  }
}

// Get news data from AsyncStorage
export async function getData() {
  try {
    const jsonValue = await AsyncStorage.getItem("news");
    console.log("Data read success:", jsonValue);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.log("Data reading error:", error);
    throw error;
  }
}
