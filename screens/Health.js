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

export default function HealthScreen() {
  var allStore = { id: 1 };
  allStore = getData();
  console.log("async get " + allStore.health);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    getNews("health")
      .then((data) => {
        allStore.health = data;
        console.log("allstore data" + allStore);
        console.log("health data" + data.health);
        setNewsData(data);
        storeData(allStore);
      })
      .catch((error) => {
        alert(error);
      });
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

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
    const fetchData = async () => {
      try {
        const storedData = await getData();
        if (storedData && storedData.health) {
          console.log("allstore worked and was read");
          setNewsData(storedData.health);
          console.log(storedData.health);
        } else {
          console.log("allstore void or not read time to write");
          const data = await getNews("health");
          allStore = { health: data }; // initialize allStore with the fetched data
          setNewsData(data);
          console.log("allstore data " + allStore.health.title);

          await storeData(allStore);
          console.log("allstore data after store" + allStore.health.title);
        }
      } catch (error) {
        alert(error);
      }
    };

    fetchData();
  }, []);

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
      <View height={850}>
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
