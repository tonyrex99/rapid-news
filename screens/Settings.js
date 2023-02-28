import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { getEndpoint, storeEndpoint } from "../config/config";
import { Picker } from "@react-native-picker/picker";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";

const countries = [
  { title: "Argentina", id: "ar" },
  { title: "Australia", id: "au" },
  { title: "Austria", id: "at" },
  { title: "Belgium", id: "be" },
  { title: "Brazil", id: "br" },
  { title: "Bulgaria", id: "bg" },
  { title: "Canada", id: "ca" },
  { title: "China", id: "cn" },
  { title: "Colombia", id: "co" },
  { title: "Cuba", id: "cu" },
  { title: "Czech Republic", id: "cz" },
  { title: "Egypt", id: "eg" },
  { title: "France", id: "fr" },
  { title: "Germany", id: "de" },
  { title: "Greece", id: "gr" },
  { title: "Hong Kong", id: "hk" },
  { title: "Hungary", id: "hu" },
  { title: "India", id: "in" },
  { title: "Indonesia", id: "title" },
  { title: "Ireland", id: "ie" },
  { title: "Israel", id: "il" },
  { title: "Italy", id: "it" },
  { title: "Japan", id: "jp" },
  { title: "Latvia", id: "lv" },
  { title: "Lithuania", id: "lt" },
  { title: "Malaysia", id: "my" },
  { title: "Mexico", id: "mx" },
  { title: "Morocco", id: "ma" },
  { title: "Netherlands", id: "nl" },
  { title: "New Zealand", id: "nz" },
  { title: "Nigeria", id: "ng" },
  { title: "Norway", id: "no" },
  { title: "Philippines", id: "ph" },
  { title: "Poland", id: "pl" },
  { title: "Portugal", id: "pt" },
  { title: "Romania", id: "ro" },
  { title: "Russia", id: "ru" },
  { title: "Saudi Arabia", id: "sa" },
  { title: "Serbia", id: "rs" },
  { title: "Singapore", id: "sg" },
  { title: "Slovakia", id: "sk" },
  { title: "Slovenia", id: "si" },
  { title: "South Africa", id: "za" },
  { title: "South Korea", id: "kr" },
  { title: "Sweden", id: "se" },
  { title: "Switzerland", id: "ch" },
  { title: "Taiwan", id: "tw" },
  { title: "Thailand", id: "th" },
  { title: "Turkey", id: "tr" },
  { title: "UAE", id: "ae" },
  { title: "Ukraine", id: "ua" },
  { title: "United Kingdom", id: "gb" },
  { title: "United States", id: "us" },
];

const SettingsScreen = () => {
  const defaultSettings = {
    endpoint: "https://newsapi.org/v2/top-headlines",
    country: "ng",
  };
  const [endpoint, setEndpoint] = useState(getEndpoint().endpoint);

  const [selectedCountry, setSelectedCountry] = useState("");

  const handleSubmit = () => {
    const UserProfile = { endpoint: endpoint, country: convertSelectedCountry };
    storeEndpoint(UserProfile);
  };

  const handleSaveSettings = () => {
    handleSubmit();
  };

  const handleResetSettings = () => {
    storeEndpoint(defaultSettings);
    setEndpoint(defaultSettings.endpoint);
    setSelectedCountry(defaultSettings.country);
  };

  const handleEndpointChange = (value) => {
    setEndpoint(value);
    console.log(endpoint);
  };

  const initialValue = getInitialCountry();
  function getInitialCountry() {
    return getEndpoint().country ? getEndpoint().country : "ng";
  }

  const headlineSource = {
    top: defaultSettings.endpoint,
    source: "https://newsapi.org/v2/top-headlines/sources",
  };
  var convertSelectedCountry;
  var countryObject;
  const OpenURLButton = ({ url }) => {
    console.log(url);

    // countryObject = url;
    //convertSelectedCountry = url.title;
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>API Endpoint</Text>
          <Picker
            selectedValue={endpoint}
            onValueChange={handleEndpointChange}
            mode="dropdown"
          >
            <Picker.Item label="Top Headlines" value={headlineSource.top} />
            <Picker.Item
              label="Top Headlines / Sources"
              value={headlineSource.source}
            />
          </Picker>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Country</Text>
          <AutocompleteDropdown
            onSelectItem={setSelectedCountry}
            initialValue={initialValue}
            dataSet={countries}
          />
          <OpenURLButton url={selectedCountry} />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSaveSettings}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleResetSettings}>
          <Text style={styles.buttonText}>Reset to Default</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textInput: {
    borderWtitleth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
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
});
