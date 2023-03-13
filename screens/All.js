import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  RefreshControl,
} from "react-native";
import {
  NativeBaseProvider,
  FlatList,
  Divider,
  Image,
  Spinner,
  ScrollView,
  Skeleton,
} from "native-base";
import { getNews, searchNews, useThemeColors } from "../services/services";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { getData, storeData } from "../config/config";
import { SearchBar } from "@rneui/themed";
import { useColorScheme } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Filters from "./Filters";
import { Icon } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function All() {
  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top;
  const [filterOption, setFilterOption] = useState(null);
  const handleFilterChange = (option) => {
    setFilterOption(option);
    updateSearch(searchValue);

    // perform other actions based on the selected filter option
  };
  const altImage =
    "https://media.istockphoto.com/id/540113610/vector/breaking-news-newspaper.jpg?s=612x612&w=0&k=20&c=ooJw5_ROQBHL1DHNUUcQIc-Kf6fH49XlbvfyPtHdu30=";
  const filterOptions = ["Popularity", "Relevancy", "PublishedAt"];

  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === "dark" ? "#000" : "#fff";
  const [allStore, setAllStore] = useState({});
  const colors = useThemeColors();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setTheme(resolveTheme());
        const storedData = await getData();
        if (storedData && storedData.general) {
          setAllStore(storedData);
        } else {
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
          await storeData(newAllStore);
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

    try {
      const data = await searchNews(search, startDate, endDate, sortBy);
      const newAllStore = { general: data };
      setAllStore(newAllStore);
      await storeData(newAllStore);
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
      image: item.urlToImage ? item.urlToImage : altImage,
      date: item.publishedAt,
      superLink: item.url,
    });
  };

  const [newsData, setNewsData] = useState([]);
  useEffect(() => {
    if (allStore && allStore.general) {
      setNewsData(allStore.general);
    }
  }, [allStore]);

  const [openFromDateModal, setOpenFromDateModal] = useState(false);
  const [openToDateModal, setOpenToDateModal] = useState(false);
  const [iconColor, setIconColor] = useState("blue");

  class NewsItem extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
      // Only re-render if the item prop has changed
      return nextProps.item !== this.props.item;
    }

    render() {
      const { item, navfind } = this.props;

      return (
        <TouchableOpacity onPress={() => navfind(item)}>
          <View>
            <View style={styles.newsContainer}>
              <Image
                width={550}
                height={250}
                resizeMode={"cover"}
                source={{
                  uri: item.urlToImage ? item.urlToImage : altImage,
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
    }
  }

  const RenderSkeleton = () => {
    return (
      <View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.newsContainer}>
            {/* Skeleton image */}
            <Skeleton height={210} />
            {/* Skeleton Title*/}
            <Skeleton height={4} width={300} marginTop={3} marginBottom={0.5} />
            <Skeleton
              height={4}
              width={330}
              marginTop={0.5}
              marginBottom={0.5}
            />
            <Skeleton height={4} width={250} marginTop={0.5} marginBottom={2} />
            {/* Skeleton Date */}
            <Skeleton height={2} width={150} marginBottom={1} />

            {/* Skeleton Description */}
            <Skeleton height={2} width={300} marginTop={5} />
            <Skeleton height={2} width={250} marginTop={1} />
            <Skeleton height={2} width={210} marginTop={1} />
          </View>
          <Spinner color="danger.400" />
          <View style={styles.newsContainer}>
            {/* Skeleton image */}
            <Skeleton height={210} marginTop={15} />
            {/* Skeleton Title*/}
            <Skeleton height={4} width={300} marginTop={3} marginBottom={0.5} />
            <Skeleton
              height={4}
              width={330}
              marginTop={0.5}
              marginBottom={0.5}
            />
            <Skeleton height={4} width={250} marginTop={0.5} marginBottom={2} />
            {/* Skeleton Date */}
            <Skeleton height={2} width={150} marginBottom={1} />

            {/* Skeleton Description */}
            <Skeleton height={2} width={300} marginTop={5} />
            <Skeleton height={2} width={250} marginTop={1} />
            <Skeleton height={2} width={210} marginTop={1} />
          </View>

          <View style={styles.newsContainer}>
            {/* Skeleton image */}
            <Skeleton height={210} marginTop={15} />
            {/* Skeleton Title*/}
            <Skeleton height={4} width={300} marginTop={3} marginBottom={0.5} />
            <Skeleton
              height={4}
              width={330}
              marginTop={0.5}
              marginBottom={0.5}
            />
            <Skeleton height={4} width={250} marginTop={0.5} marginBottom={2} />
            {/* Skeleton Date */}
            <Skeleton height={2} width={150} marginBottom={1} />

            {/* Skeleton Description */}
            <Skeleton height={2} width={300} marginTop={5} />
            <Skeleton height={2} width={250} marginTop={1} />
            <Skeleton height={2} width={210} marginTop={1} />
          </View>
        </ScrollView>
      </View>
    );
  };

  const [Theme, setTheme] = useState(true);
  function resolveTheme() {
    var searchtheme = colorScheme;
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
    hideFromDatePicker();
    updateSearch(searchValue);
  };
  const handleToDateConfirm = (date) => {
    var finalEndDate = moment(date).format("YYYY-DD-MM");
    setEndDate(finalEndDate);
    hideToDatePicker();
    updateSearch(searchValue);
  };
  const hideFromDatePicker = () => {
    setOpenFromDateModal(false);
  };
  const hideToDatePicker = () => {
    setOpenToDateModal(false);
  };
  function showFilter() {
    setShowView(!showView);
    showView == false ? setIconColor("blue") : setIconColor("black");
  }

  return (
    <NativeBaseProvider>
      <StatusBar backgroundColor="#000000" style="light" />
      <View>
        <View style={{ backgroundColor: "white" }}>
          <View
            style={{
              flexDirection: "row",
              paddingTop: statusBarHeight,
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
                    color={"#000000"}
                  />
                  <Text style={{ color: "#000000" }}> From</Text>
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
                    color={"#000000"}
                  />
                  <Text style={{ color: "#000000" }}> To</Text>
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
              data={newsData}
              renderItem={({ item }) => (
                <NewsItem item={item} navfind={navfind} />
              )}
              keyExtractor={(item) => item.id}
              onRefresh={onRefresh}
              refreshing={refreshing}
            />
          ) : (
            <>
              <RenderSkeleton />
            </>
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
    borderColor: "#dedede",
    backgroundColor: "#f2f2f2",
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
