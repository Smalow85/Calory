import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import Statistics from "./screens/Statistics";
import Settings from "./screens/Settings";

const RootStack = createNativeStackNavigator();

export const RootNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="HomeScreen" component={HomeScreen}></RootStack.Screen>
      <RootStack.Screen name="screens/Statistics" component={Statistics} ></RootStack.Screen>
      <RootStack.Screen name="screens/Settings" component={Settings}></RootStack.Screen>
    </RootStack.Navigator>
  );
};
