import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import {
  API_KEY,
  BASE_URL,
  DEFAULT_COUNTRY,
  storeEndpoint,
  getEndpoint,
  storeApi,
  getApi,
} from "../config/config";
import { useColorScheme } from "react-native";

const Colors = {
  light: {
    background: "white",
    text: "black",
  },
  dark: {
    background: "black",
    text: "white",
  },
};

export const useThemeColors = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return colors;
};

/**

Retrieves news articles from the API based on the provided category and country.

If no category is provided, "general" category will be used.

If a valid endpoint and country are stored in AsyncStorage, they will be used instead of default config.

If no valid endpoint and country are found, default config will be used and stored in AsyncStorage for future use.

@param {string} category - The news category to retrieve.

@returns {Array} An array of news articles.
*/

const STORED_API_KEY = getApi().api;
const CURRENT_API_KEY = STORED_API_KEY ? STORED_API_KEY : API_KEY;
const VALID_KEY = { api: CURRENT_API_KEY };
storeApi(VALID_KEY);
export async function getNews(category = "general") {
  try {
    // Check if endpoint and country are stored in AsyncStorage
    const storedEndpoint = getEndpoint().endpoint;
    console.log("get serive endpoint worked", storedEndpoint);
    const storedCountry = getEndpoint().country;
    console.log("get serive endpoint worked", storedCountry);

    // Use stored endpoint and country if available, otherwise use default config
    const endpoint = storedEndpoint ? storedEndpoint : BASE_URL;
    const country = storedCountry ? storedCountry : DEFAULT_COUNTRY;
    const CurrentResolver = { endpoint: endpoint, country: country };
    storeEndpoint(CurrentResolver);
    console.log("current resolver stored ", CurrentResolver);

    const response = await axios.get(
      `${endpoint}?country=${country}&category=${category}`,
      {
        headers: {
          "X-API-KEY": CURRENT_API_KEY,
        },
      }
    );

    const articles = response.data.articles;

    // Store articles in AsyncStorage
    await AsyncStorage.setItem("news", JSON.stringify(articles));

    return articles;
  } catch (error) {
    console.log("Error fetching news: ", error);
    console.log("the erro type is", error.response.data.message);
    throw new Error("NewsApi.org says: " + error.response.data.message);
  }
}

// Create a new Date object
var currentDate = new Date();

// Get the year, month, and day from the Date object
var year = currentDate.getFullYear();
var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
var day = ("0" + currentDate.getDate()).slice(-2);

// Combine the year, month, and day into the desired format
var formattedDate = year + "-" + month + "-" + day;
export async function searchNews(
  searchQuery = "general",
  startDate = formattedDate,
  endDate = formattedDate,
  sortBy = "popularity"
) {
  try {
    // search news api for a category

    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${searchQuery}&from=${startDate}&to=${endDate}&sortBy=${sortBy}`,
      {
        headers: {
          "X-API-KEY": CURRENT_API_KEY,
        },
      }
    );

    const articles = response.data.articles;

    // Store articles in AsyncStorage
    await AsyncStorage.setItem("news", JSON.stringify(articles));

    return articles;
  } catch (error) {
    console.log("Error fetching news: ", error);
    console.log("the erro type is", typeof error);
    throw new Error("Unable to retrieve news articles.");
  }
}

/**

Stores the provided value in AsyncStorage under the "endpoint" key.
@param {string} value - The value to store.

export async function storeEndpoint(value) {
  try {
    await AsyncStorage.setItem("endpoint", value);
  } catch (error) {
    console.log("Error storing endpoint: ", error);
  }
}
*/
/**

Retrieves the stored value from AsyncStorage under the "endpoint" key.
@returns {string} The stored value, or null if no value is found.

export async function getEndpoint() {
  try {
    const value = await AsyncStorage.getItem("endpoint");
    return value;
  } catch (error) {
    console.log("Error retrieving endpoint: ", error);
    return null;
  }
}
*/
/**

Stores the provided value in AsyncStorage under the "country" key.
@param {string} value - The value to store.

export async function storeCountry(value) {
  try {
    await AsyncStorage.setItem("country", value);
  } catch (error) {
    console.log("Error storing country: ", error);
  }
}
*/
/**

Retrieves the stored value from AsyncStorage under the "country" key.
@returns {string} The stored value, or null if no value is found.

export async function getCountry() {
  try {
    const value = await AsyncStorage.getItem("country");
    return value;
  } catch (error) {
    console.log("Error retrieving country: ", error);
    return null;
  }
}
*/
