import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

// Pantallas de navegación
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';

// Navegador Bottom Tabs Navigator
const Tab = createBottomTabNavigator();

export default function BottomTab({ logueado, setLogueado }) {

  // Función para renderizar HomeScreen con props
  const RenderHomeScreen = props => (
    <HomeScreen {...props} setLogueado={setLogueado} logueado={logueado} />
  );

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeScreen"
        component={RenderHomeScreen}
        options={{
          title: 'Inicio',
          tabBarActiveTintColor: '#6200ee', // Color activo de la pestaña
          headerStyle: {
            backgroundColor: '#6200ee', // Color del header
          },
          headerTintColor: '#fff', // Color del texto en el header
          tabBarIcon: ({ color }) => ( // Función que define el ícono de la pestaña
            <Ionicons name="home" color={color} size={24} /> // `color` proviene de React Navigation
          ),
        }}
      />
    </Tab.Navigator>
  );
}
