import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Filters = ({ options, onChange }) => {
  const [activeOption, setActiveOption] = useState(null);

  const handleOptionPress = (option) => {
    if (option === activeOption) {
      setActiveOption(null);
      onChange(null);
    } else {
      setActiveOption(option);
      onChange(option);
    }
  };

  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            option === activeOption && styles.activeOptionButton,
          ]}
          onPress={() => handleOptionPress(option)}
        >
          <Text
            style={[
              styles.optionText,
              option === activeOption && styles.activeOptionText,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingTop: 12,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#dedede",
    backgroundColor: "#f2f2f2",
    marginRight: 10,
  },
  activeOptionButton: {
    backgroundColor: "#606060",
    borderColor: "#8c8c8c",
  },
  optionText: {
    color: "#333",
  },
  activeOptionText: {
    color: "white",
  },
});

export default Filters;
