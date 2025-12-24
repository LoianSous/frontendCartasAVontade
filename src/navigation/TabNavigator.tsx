import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { TabParamList } from '../types/types';
import { useTheme } from '../theme/ThemeContext';
import Usuario from '../screens/Usuario/ScreenUser';
import MinhasCartas from '../screens/MinhasCartas/ScreenMinhasCartas';
import Perfil from '../screens/Perfil/ScreenPerfil';

const Tab = createBottomTabNavigator<TabParamList>();

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.text,

        tabBarStyle: {
          backgroundColor: theme.buttonBackground,
          borderTopWidth: 0,
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },

        tabBarIcon: ({ color, size, focused }) => {
          let iconName: IconName;

          if (route.name === "Usuario") {
            iconName = (focused ? "home-heart" : "home-heart") as IconName;
          } else if (route.name === "MinhasCartas") {
            iconName = (focused ? "heart-box" : "heart-box") as IconName;
          } else {
            iconName = (focused ? "account-heart-outline" : "account-heart-outline") as IconName;
          }
          return (
            <View
              style={{
                borderRadius: 20,
                width: 35,
                height: 35,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? theme.circlebar : 'transparent',
              }}
            >
              <MaterialCommunityIcons
                name={iconName}
                size={24}
                color={focused ? theme.iconbar : color}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Usuario"
        component={Usuario}
        options={{ title: 'Inicio' }}
      />

      <Tab.Screen
        name="MinhasCartas"
        component={MinhasCartas}
        options={{ title: 'Minhas Cartas' }}
      />

      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{ title: 'Meu perfil' }}
      />
    </Tab.Navigator>
  );
}
