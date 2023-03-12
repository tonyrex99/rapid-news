import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import {
  NativeBaseProvider,
  FlatList,
  Divider,
  Image,
  Spinner,
} from "native-base";
import { getNews } from "../services/services";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { getData, storeData } from "../config/config";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SportsScreen() {
  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top;
  const [allStore, setAllStore] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = await getData();
        if (storedData && storedData.sports) {
          //console.log("allstore worked and was read");
          setAllStore(storedData);
          // console.log(storedData.sports);
        } else {
          console.log("allstore void or not read time to write");
          const data = await getNews("sports");
          for (let prop in storedData) {
            if (storedData[prop] === undefined) {
              storedData[prop] = null;
            }
          }
          const newAllStore = {
            general: storedData.general,
            business: data,
            sports: data,
            health: storedData.health,
            technology: storedData.technology,
          };
          setAllStore(newAllStore);
          //console.log("allstore data " + newAllStore.sports.title);
          await storeData(newAllStore);
          //console.log("allstore data after store" + newAllStore.sports.title);
        }
      } catch (error) {
        alert(error);
      }
    };

    fetchData();
  }, []);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);

    try {
      const data = await getNews("sports");
      const newAllStore = { sports: data };
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
    if (allStore && allStore.sports) {
      console.log("async get " + allStore.sports);
      setNewsData(allStore.sports);
    }
  }, [allStore]);

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

  return (
    <NativeBaseProvider>
      <View
        height={850}
        style={{ backgroundColor: "white", paddingTop: statusBarHeight }}
      >
        {newsData.length > 1 ? (
          <FlatList
            data={newsData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
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
