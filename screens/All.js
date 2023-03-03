import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Button } from "react-native";
import {
  NativeBaseProvider,
  FlatList,
  Divider,
  Image,
  Spinner,
} from "native-base";
import { getNews, searchNews, useThemeColors } from "../services/services";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { getData, storeData } from "../config/config";
import { SearchBar } from "@rneui/themed";
import { useColorScheme } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
export default function All() {
  const colorScheme = useColorScheme();
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
          const newAllStore = { general: data };
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

  const [searchLoad, setSearchLoad] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState(formattedDate);
  // Create a new Date object
  var currentDate = new Date();

  // Get the year, month, and day from the Date object

  // Combine the year, month, and day into the desired format
  var formattedDate = moment(currentDate).format("YYYY-DD-MM");
  async function updateSearch(search) {
    setSearchLoad(true);
    setSearchValue(search);
    try {
      const data = await searchNews(
        search,
        startDate,
        (endDate = startDate)
        //  (sortBy = "relevancy")
      );
      const newAllStore = { general: data };
      setAllStore(newAllStore);
      await storeData(newAllStore);
      console.log("search updated");
    } catch (error) {
      alert(error);
    }

    setSearchLoad(false);
  }

  var search = "general";

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

  const [openDateModal, setOpenDateModal] = useState(false);
  const [modalDate, setModalDate] = useState(new Date());
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
  const handleDateConfirm = (date) => {
    var finalDate = moment(currentDate).format("YYYY-DD-MM");
    setStartDate(finalDate);
    hideDatePicker();
  };
  const hideDatePicker = () => {
    setOpenDateModal(false);
  };

  const handleFilterClick = (selectedFilter) => {
    // Toggle filter
    setActiveFilter((prevFilter) =>
      prevFilter === selectedFilter ? null : selectedFilter
    );
    setFilter(selectedFilter);
  };
  return (
    <NativeBaseProvider>
      <View>
        <SearchBar
          placeholder="Type Here..."
          onChangeText={updateSearch}
          showLoading={searchLoad}
          lightTheme={Theme}
          platform={"ios"}
          value={searchValue}
        />

        <Button title="From" onPress={() => setOpenDateModal(true)} />
        <Button title="to" onPress={() => setOpenDateModal(true)} />
        <DateTimePickerModal
          isVisible={openDateModal}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
        />
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
  newsDescription: {
    fontSize: 16,
    marginTop: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  activeButton: {
    backgroundColor: "green",
  },
  inactiveButton: {
    backgroundColor: "grey",
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
});
