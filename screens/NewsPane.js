import React, { useCallback } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Image, NativeBaseProvider, ScrollView } from "native-base";

import moment from "moment";

import { useNavigation } from "@react-navigation/native";

export default function NewsPane({ route }) {
  const navigation = useNavigation();
  const webfind = (item) => {
    navigation.navigate("WebFinder", {
      superLink: item,
    });
  };

  const OpenURLButton = ({ url }) => {
    const handlePress = useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        webfind(url);
        //  to open the link externally await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);

    return (
      <>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Read More</Text>
        </TouchableOpacity>
      </>
    );
  };

  const { title, description, image, date, superLink } = route.params;
  return (
    <NativeBaseProvider>
      <ScrollView>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.date}> {moment(date).format("LLL")}</Text>
          <Image
            width={550}
            height={250}
            resizeMode={"cover"}
            source={{
              uri: image,
            }}
            alt="Alternate Text"
          />
          <Text style={styles.newsDescription}>{description}</Text>
          <OpenURLButton url={superLink} />
        </View>
      </ScrollView>
    </NativeBaseProvider>
  );
}
const styles = StyleSheet.create({
  newsContainer: {
    padding: 10,
  },

  button: {
    backgroundColor: "#007aff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
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
