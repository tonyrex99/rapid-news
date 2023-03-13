import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as SQLite from "expo-sqlite";

// The API key and default endpoint for the News API
export const API_KEY = `97d4da96e9c349c6a80fb1426cea7437`;
export const BASE_URL = `https://newsapi.org/v2/top-headlines`;
export const DEFAULT_COUNTRY = "ng";

// The default country for the News API endpoint
export const country = "DEFAULT_COUNTRY";
// The database name and version
const dbName = "news.db";
//const dbVersion = "1.0";

// Create or open the database
const db = SQLite.openDatabase(dbName);

// Create the config table if it doesn't exist
db.transaction((tx) => {
  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS config (id INTEGER PRIMARY KEY AUTOINCREMENT, country TEXT, endpoint TEXT)",
    [],
    (_, error) => {
      console.log("Error creating config table:", error);
    }
  );
});

// Get the endpoint configuration from the database

export async function getEndpoint() {
  try {
    const [result] = await new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM config WHERE id = ?",
          [1],
          (_, { rows }) => resolve(rows._array),
          (_, error) => reject(error)
        );
      });
    });

    if (result) {
      console.log("Endpoint read success:");
      return { endpoint: result.endpoint, country: result.country };
    } else {
      console.log("Endpoint not found in database");
      return null;
    }
  } catch (error) {
    console.log("Endpoint reading error:", error);
    throw error;
  }
}

// Save the endpoint configuration to the database
export async function storeEndpoint({ endpoint, country = "ng" }) {
  try {
    await new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT OR REPLACE INTO config (id, endpoint, country) VALUES (?, ?, ?)",
          [1, endpoint, country],
          (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
              console.log("Endpoint saved success:");
              resolve();
            } else {
              reject(new Error("Failed to save endpoint"));
            }
          },
          (_, error) => {
            console.log("Endpoint saving error:", error);
            reject(error);
          }
        );
      });
    });
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
    console.log("Data saved success:");
  } catch (error) {
    console.log("Data saving error:", error);
    throw error;
  }
}

// stores the user set API KEY to AsyncStorage
export async function storeApi(value) {
  try {
    const jsonValue = JSON.stringify(value);
    await SecureStore.setItemAsync("newsApiKey", jsonValue);
    console.log("api saved success:");
  } catch (error) {
    console.log("api saving error:", error);
    throw error;
  }
}

//Get api key from AsyncStorage
export async function getApi() {
  try {
    const jsonValue = await SecureStore.getItemAsync("newsApiKey");
    console.log("api read success:");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.log("api reading error:", error);
    throw error;
  }
}

// Get news data from AsyncStorage
export async function getData() {
  try {
    const jsonValue = await AsyncStorage.getItem("news");
    console.log("Data read success:");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.log("Data reading error:", error);
    throw error;
  }
}
