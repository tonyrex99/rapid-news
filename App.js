import React from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import All from "./screens/All";
import Business from "./screens/Business";
import HealthScreen from "./screens/Health";
import SportsScreen from "./screens/Sports";
import TechScreen from "./screens/Tech";
import SettingsScreen from "./screens/Settings";
import NewsPane from "./screens/NewsPane";
import WebFinder from "./screens/WebFinder";
import { Icon } from "@rneui/themed";

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

function Myhome() {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      lazy={true}
      tabBarOptions={{
        showLabel: false,
        activeTintColor: "blue",
        allowFontScaling: true,
        inactiveTintColor: "black",
        labelStyle: styles.label,
        indicatorStyle: styles.indicator,
        tabStyle: {
          padding: 0,
          marginHorizontal: 2,
        },
      }}
    >
      <Tab.Screen
        name="All"
        component={All}
        options={{
          tabBarIcon: (props) => (
            <Icon type="feather" name="home" color={props.color} />
          ),
        }}
      />

      <Tab.Screen
        name="Business"
        component={Business}
        options={{
          tabBarIcon: (props) => (
            <Icon type="feather" name="dollar-sign" color={props.color} />
          ),
        }}
      />

      <Tab.Screen
        name="Health"
        component={HealthScreen}
        options={{
          tabBarIcon: (props) => (
            <Icon type="font-awesome" name="heartbeat" color={props.color} />
          ),
        }}
      />

      <Tab.Screen
        name="Sports"
        component={SportsScreen}
        options={{
          tabBarIcon: (props) => (
            <Icon type="ionicon" name="football-outline" color={props.color} />
          ),
        }}
      />

      <Tab.Screen
        name="Tech"
        component={TechScreen}
        options={{
          tabBarIcon: (props) => (
            <Icon
              type="ionicon"
              name="hardware-chip-outline"
              color={props.color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: (props) => (
            <Icon type="ionicon" name="settings-outline" color={props.color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Myhome"
          options={{ headerShown: false }}
          component={Myhome}
        />

        <Stack.Screen
          name="NewsPane"
          options={{ title: "Read More" }}
          component={NewsPane}
        />
        <Stack.Screen
          name="WebFinder"
          options={{
            title: "Read More",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
          }}
          component={WebFinder}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerStyle: { height: 100 },
  headerTitleStyle: { fontSize: 20 },
  label: { fontSize: 10, fontWeight: "bold" },
  indicator: { backgroundColor: "transparent", height: 0 },
});
