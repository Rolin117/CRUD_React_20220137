import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import fetchData from '../../api/components';

// Componente de pantalla de inicio de sesión
const LoginScreen = ({ logueado, setLogueado }) => {

  // Estados para los campos de alias y clave
  const [alias, setAlias] = useState('');
  const [clave, setClave] = useState('');

  // URL de la API para el usuario
  const USER_API = 'services/admin/administrador.php';

  // Manejo de inicio de sesión
  const handleLogin = async () => {
    // Creación del formulario para la petición
    const formData = new FormData();
    formData.append('alias', alias);
    formData.append('clave', clave);

    try {
      // Realización de la petición de inicio de sesión
      const data = await fetchData(USER_API, 'logIn', formData);
      if (data.status) {
        setLogueado(!logueado);
      } else {
        console.log(data);
        Alert.alert('Error sesion', data.error);
      }
    } catch (error) {
      console.log(data.error);
      Alert.alert('Error sesion', data.error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>
      <TextInput
        label="Usuario"
        value={alias}
        onChangeText={setAlias}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        label="Contraseña"
        value={clave}
        onChangeText={setClave}
        style={styles.input}
        secureTextEntry
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Iniciar Sesión
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#e0f7fa', // Cambiado a un tono azul claro
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#00796b', // Cambiado a un tono verde oscuro
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#ffffff', // Fondo blanco
    borderColor: '#80cbc4', // Borde verde claro
    borderWidth: 1,
    borderRadius: 8, // Bordes redondeados
    padding: 10,
  },
  button: {
    marginTop: 10,
    padding: 15, // Aumentado el padding para mejor apariencia
    backgroundColor: '#00796b', // Cambiado a un tono verde oscuro
    borderRadius: 12, // Bordes redondeados
    alignItems: 'center', // Centrado del texto
  },
  buttonText: {
    color: '#ffffff', // Texto blanco
    fontSize: 16, // Tamaño de fuente aumentado
  },
});

export default LoginScreen;
