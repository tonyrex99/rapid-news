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
  ScrollView,
  Divider,
  Image,
  Spinner,
  Skeleton,
} from "native-base";
import { getNews } from "../services/services";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { getData, storeData } from "../config/config";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TechScreen() {
  const altImage =
    "https://st4.depositphotos.com/1152339/20043/i/1600/depositphotos_200433334-stock-photo-news-concept-tech-news-on.jpg";
  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top;
  const [allStore, setAllStore] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = await getData();
        if (storedData && storedData.technology) {
          setAllStore(storedData);
        } else {
          const data = await getNews("technology");
          for (let prop in storedData) {
            if (storedData[prop] === undefined) {
              storedData[prop] = null;
            }
          }
          const newAllStore = {
            general: storedData.general,
            business: data,
            sports: storedData.sports,
            health: storedData.health,
            technology: data,
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

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);

    try {
      const data = await getNews("technology");
      const newAllStore = { technology: data };
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
    if (allStore && allStore.technology) {
      setNewsData(allStore.technology);
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
          <>
            <RenderSkeleton />
          </>
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

    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
});
