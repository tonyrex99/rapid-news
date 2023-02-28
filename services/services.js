import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { API_KEY, BASE_URL, DEFAULT_COUNTRY } from "../config/config";

/**

Retrieves news articles from the API based on the provided category and country.

If no category is provided, "general" category will be used.

If a valid endpoint and country are stored in AsyncStorage, they will be used instead of default config.

If no valid endpoint and country are found, default config will be used and stored in AsyncStorage for future use.

@param {string} category - The news category to retrieve.

@returns {Array} An array of news articles.
*/
export async function getNews(category = "general") {
  try {
    // Check if endpoint and country are stored in AsyncStorage
    const storedEndpoint = await AsyncStorage.getItem("endpoint");
    const storedCountry = await AsyncStorage.getItem("country");

    // Use stored endpoint and country if available, otherwise use default config
    const endpoint = storedEndpoint ? storedEndpoint : BASE_URL;
    const country = storedCountry ? storedCountry : DEFAULT_COUNTRY;

    const response = await axios.get(
      `${endpoint}?country=${country}&category=${category}`,
      {
        headers: {
          "X-API-KEY": API_KEY,
        },
      }
    );

    const articles = response.data.articles;

    // Store articles in AsyncStorage
    await AsyncStorage.setItem("news", JSON.stringify(articles));

    return articles;
  } catch (error) {
    console.log("Error fetching news: ", error);
    throw new Error("Unable to retrieve news articles.");
  }
}

/**

Stores the provided value in AsyncStorage under the "endpoint" key.
@param {string} value - The value to store.
*/
export async function storeEndpoint(value) {
  try {
    await AsyncStorage.setItem("endpoint", value);
  } catch (error) {
    console.log("Error storing endpoint: ", error);
  }
}
/**

Retrieves the stored value from AsyncStorage under the "endpoint" key.
@returns {string} The stored value, or null if no value is found.
*/
export async function getEndpoint() {
  try {
    const value = await AsyncStorage.getItem("endpoint");
    return value;
  } catch (error) {
    console.log("Error retrieving endpoint: ", error);
    return null;
  }
}
/**

Stores the provided value in AsyncStorage under the "country" key.
@param {string} value - The value to store.
*/
export async function storeCountry(value) {
  try {
    await AsyncStorage.setItem("country", value);
  } catch (error) {
    console.log("Error storing country: ", error);
  }
}
/**

Retrieves the stored value from AsyncStorage under the "country" key.
@returns {string} The stored value, or null if no value is found.
*/
export async function getCountry() {
  try {
    const value = await AsyncStorage.getItem("country");
    return value;
  } catch (error) {
    console.log("Error retrieving country: ", error);
    return null;
  }
}
