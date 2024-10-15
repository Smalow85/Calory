import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import Statistics from "./screens/Statistics";
import Settings from "./screens/Settings";
import FoodDetailsScreen from "./screens/FoodDetailsScreen"

const RootStack = createNativeStackNavigator();

export const RootNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="HomeScreen" component={HomeScreen}></RootStack.Screen>
      <RootStack.Screen name="screens/Statistics" component={Statistics} ></RootStack.Screen>
      <RootStack.Screen name="screens/Settings" component={Settings}></RootStack.Screen>
      <RootStack.Screen name="screens/FoodDetailsScreen" component={FoodDetailsScreen}></RootStack.Screen>
    </RootStack.Navigator>
  );
};
