import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Button } from "react-native";
import {
  NativeBaseProvider,
  FlatList,
  Divider,
  Image,
  Spinner,
  ScrollView,
} from "native-base";
import { getNews, searchNews, useThemeColors } from "../services/services";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import {
  getData,
  storeData,
  getEndpoint,
  storeEndpoint,
} from "../config/config";
import { SearchBar } from "@rneui/themed";
import { Appearance, useColorScheme } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Filters from "./Filters";
import { Icon } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";

export default function All() {
  const [filterOption, setFilterOption] = useState(null);
  const handleFilterChange = (option) => {
    setFilterOption(option);
    updateSearch(searchValue);

    // perform other actions based on the selected filter option
  };

  const filterOptions = ["popularity", "relevancy", "publishedAt"];

  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === "dark" ? "#000" : "#fff";
  const [allStore, setAllStore] = useState({});
  const colors = useThemeColors();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setTheme(resolveTheme());
        console.log("resolvethem is", resolveTheme());
        console.log("resolvethem is", typeof resolveTheme());
        const storedData = await getData();
        if (storedData && storedData.general) {
          console.log("allstore worked and was read");
          setAllStore(storedData);
          //console.log(storedData.general);
        } else {
          console.log("allstore void or not read time to write");
          const data = await getNews("general");
          for (let prop in storedData) {
            if (storedData[prop] === undefined) {
              storedData[prop] = null;
            }
          }

          const newAllStore = {
            general: data,
            business: storedData.business,
            sports: storedData.sports,
            health: storedData.health,
            technology: storedData.technology,
          };
          setAllStore(newAllStore);
          // console.log("allstore data " + newAllStore.general.title);
          await storeData(newAllStore);
          //console.log("allstore data after store" + newAllStore.general.title);
        }
      } catch (error) {
        alert(error);
      }
    };

    fetchData();
  }, []);
  // Get the year, month, and day from the Date object
  var currentDate = new Date();
  // Combine the year, month, and day into the desired format
  var formattedDate = moment(currentDate).format("YYYY-DD-MM");
  const [searchLoad, setSearchLoad] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState(formattedDate);
  const [endDate, setEndDate] = useState(formattedDate);
  // Create a new Date object

  async function updateSearch(search) {
    var sortBy;
    setSearchLoad(true);
    setSearchValue(search);
    if (filterOption == null) {
      sortBy = "popularity";
    } else {
      sortBy = filterOption;
    }
    console.log("searched value: ", search);
    console.log("Start date: ", startDate);
    console.log("End date: ", endDate);
    console.log("Sort by", sortBy);
    try {
      const data = await searchNews(search, startDate, endDate, sortBy);
      const newAllStore = { general: data };
      setAllStore(newAllStore);
      await storeData(newAllStore);
      console.log("search updated");
    } catch (error) {
      alert(error);
    }

    setSearchLoad(false);
  }

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);

    try {
      const data = await getNews("general");
      const newAllStore = { general: data };
      setAllStore(newAllStore);
      await storeData(newAllStore);
    } catch (error) {
      alert(error);
    }

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const navigation = useNavigation();
  const navfind = (item) => {
    navigation.navigate("NewsPane", {
      title: item.title,
      description: item.content,
      image: item.urlToImage,
      date: item.publishedAt,
      superLink: item.url,
    });
  };

  const [newsData, setNewsData] = useState([]);
  useEffect(() => {
    if (allStore && allStore.general) {
      console.log("async get " + allStore.general);
      setNewsData(allStore.general);
    }
  }, [allStore]);

  const [openFromDateModal, setOpenFromDateModal] = useState(false);
  const [openToDateModal, setOpenToDateModal] = useState(false);
  const [iconColor, setIconColor] = useState("blue");
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navfind(item)}>
      <View>
        <View style={styles.newsContainer}>
          <Image
            width={550}
            height={250}
            resizeMode={"cover"}
            source={{
              uri: item.urlToImage,
            }}
            alt="Alternate Text"
          />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>
            {moment(item.publishedAt).format("LLL")}
          </Text>
          <Text style={styles.newsDescription}>{item.description}</Text>
        </View>
        <Divider my={2} bg="#e0e0e0" />
      </View>
    </TouchableOpacity>
  );
  const flatlistStyle = StyleSheet.create({
    container: { backgroundColor: colors.background },
  });
  const [Theme, setTheme] = useState(true);
  function resolveTheme() {
    var searchtheme = colorScheme;
    console.log("colorscheme is" + searchtheme);
    if (searchtheme == "light") {
      return true;
    } else {
      return false;
    }
  }
  const [showView, setShowView] = useState(true);
  const handleFromDateConfirm = (date) => {
    var finalDate = moment(date).format("YYYY-DD-MM");
    setStartDate(finalDate);
    console.log("startdate ", finalDate);
    hideFromDatePicker();
    updateSearch(searchValue);
  };
  const handleToDateConfirm = (date) => {
    var finalEndDate = moment(date).format("YYYY-DD-MM");
    setEndDate(finalEndDate);
    hideToDatePicker();
    console.log("enddate ", finalEndDate);
    updateSearch(searchValue);
  };
  const hideFromDatePicker = () => {
    setOpenFromDateModal(false);
  };
  const hideToDatePicker = () => {
    setOpenToDateModal(false);
  };
  function showFilter() {
    const startTime = Date.now(); // record start time

    setShowView(!showView);
    showView == false ? setIconColor("blue") : setIconColor("black");
    const endTime = Date.now(); // record end time
    const elapsedTime = endTime - startTime; // calculate elapsed time
    console.log(`Elapsed time: ${elapsedTime}ms`); // log elapsed time to console
  }
  return (
    <NativeBaseProvider>
      <StatusBar backgroundColor="#ffffff" barStyle="auto" />
      <View style={{ paddingTop: 20 }}>
        <View>
          <View
            style={{
              flexDirection: "row",
              paddingTop: StatusBar.currentHeight,
            }}
          >
            <View style={[styles.showSearchFilterButton]}>
              <TouchableOpacity onPress={showFilter}>
                <Icon type="ionicon" name="filter" color={iconColor} />
              </TouchableOpacity>
            </View>
            <SearchBar
              placeholder="Type Here..."
              onChangeText={updateSearch}
              showLoading={searchLoad}
              lightTheme={Theme}
              platform={"ios"}
              value={searchValue}
              containerStyle={{ flex: 1 }}
            />
          </View>
          <View style={showView ? styles.visible : styles.hidden}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <View style={styles.filterContainer}>
                <TouchableOpacity
                  style={styles.dateFilterButton}
                  onPress={() => setOpenFromDateModal(true)}
                >
                  <Icon
                    type="ionicon"
                    name="calendar-outline"
                    color={"#347af0"}
                  />
                  <Text> From</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={openFromDateModal}
                  mode="date"
                  onConfirm={handleFromDateConfirm}
                  onCancel={hideFromDatePicker}
                />
                <TouchableOpacity
                  style={styles.dateFilterButton}
                  onPress={() => setOpenToDateModal(true)}
                >
                  <Icon
                    type="ionicon"
                    name="calendar-outline"
                    color={"#347af0"}
                  />
                  <Text> To</Text>
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={openToDateModal}
                  mode="date"
                  onConfirm={handleToDateConfirm}
                  onCancel={hideToDatePicker}
                />
                <Filters
                  options={filterOptions}
                  onChange={handleFilterChange}
                />
              </View>
            </ScrollView>
          </View>
          <Text style={{ display: "none" }}>
            Selected option: {filterOption}
          </Text>
        </View>

        <View height={850}>
          {newsData.length > 1 ? (
            <FlatList
              contentContainerStyle={flatlistStyle.container}
              data={newsData}
              renderItem={renderItem}
              keyExtractor={(item) => {
                item.title;
              }}
              onRefresh={onRefresh}
              refreshing={refreshing}
            />
          ) : (
            <View style={styles.spinner}>
              <Spinner color="danger.400" />
            </View>
          )}
        </View>
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  newsContainer: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: "600",
  },
  dateFilterButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  showSearchFilterButton: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "white",

    flexDirection: "row",
    alignItems: "center",
    width: 40,
  },
  showSearchFilterActiveButton: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "#347af0",

    flexDirection: "row",
    alignItems: "center",
    width: 40,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  newsDescription: {
    fontSize: 16,
    marginTop: 10,
  },
  date: {
    fontSize: 14,
  },
  spinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 400,
  },
  visible: {
    display: "flex",
  },
  hidden: {
    display: "none",
  },
});
