import React from "react";
import { SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";

export default function WebFinder({ route }) {
  const { superLink } = route.params;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView source={{ uri: superLink }} />
    </SafeAreaView>
  );
}
