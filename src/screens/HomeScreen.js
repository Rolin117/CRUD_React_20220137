import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, FlatList, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, Modal, Dialog, Paragraph, Portal, PaperProvider } from 'react-native-paper';
import fetchData from '../../api/components';

// Componente de pantalla principal
const HomeScreen = ({ logueado, setLogueado }) => {

  // Estados para manejar la visibilidad de los modales y diálogos
  const [visible, setVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [idToUpdate, setIdToUpdate] = useState(null);

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    setIdToUpdate(null); // Restablecer idToUpdate a null cuando se cierra el modal
    limpiarCampos();
  };

  const showDeleteDialog = (id) => {
    setIdToDelete(id);
    setDeleteDialogVisible(true);
  };
  const hideDeleteDialog = () => setDeleteDialogVisible(false);

  // URL de la API para el usuario
  const USER_API = 'services/admin/administrador.php';

  // Estados para manejar los datos, carga y errores
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [alias, setAlias] = useState('');
  const [clave, setClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [error, setError] = useState(null);

  // Función para obtener datos de la API
  const fillList = async () => {
    try {
      const data = await fetchData(USER_API, 'readAll');
      setResponse(data.dataset);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Ejecuta fillList al montar el componente
  useEffect(() => {
    fillList();
  }, []);

  // Ejecuta fillList cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      fillList();
    }, [])
  );

  // Confirmar eliminación de registros
  const confirmarEliminacion = () => {
    eliminarRegistros(idToDelete);
  };

  // Eliminar registros de la API
  const eliminarRegistros = async (idA) => {
    try {
      const form = new FormData();
      form.append('idAdministrador', idA);
      const data = await fetchData(USER_API, 'deleteRow', form);
      if (data.status) {
        Alert.alert(data.message);
        fillList();
      } else {
        Alert.alert('Error ' + data.error);
      }
    } catch (error) {
      Alert.alert('No se pudo acceder a la API ' + error);
    }
    hideDeleteDialog();
  };

  // Actualizar registros en la API
  const actualizarRegistros = async () => {
    try {
      const form = new FormData();
      form.append('idAdministrador', idToUpdate);
      form.append('nombreAdministrador', nombre);
      form.append('apellidoAdministrador', apellido);
      form.append('correoAdministrador', correo);
      const data = await fetchData(USER_API, 'updateRow', form);
      if (data.status) {
        console.log(data.message)
        Alert.alert(data.message);
        limpiarCampos();
        fillList();
        hideModal();
      } else {
        Alert.alert('Error ' + data.error);
      }
    } catch (error) {
      Alert.alert('No se pudo acceder a la API ' + error);
    }
  };

  // Limpiar campos del formulario
  const limpiarCampos = async () => {
    setNombre('');
    setApellido('');
    setCorreo('');
    setAlias('');
    setClave('');
    setConfirmarClave('');
  };

  // Insertar nuevos registros en la API
  const insertarRegistros = async () => {
    try {
      const form = new FormData();
      form.append('nombreAdministrador', nombre);
      form.append('apellidoAdministrador', apellido);
      form.append('correoAdministrador', correo);
      form.append('aliasAdministrador', alias);
      form.append('claveAdministrador', clave);
      form.append('confirmarClave', confirmarClave);
      const data = await fetchData(USER_API, 'createRow', form);
      if (data.status) {
        Alert.alert(data.message);
        limpiarCampos();
        fillList();
        hideModal();
      } else {
        Alert.alert('Error ' + data.error);
      }
    } catch (error) {
      Alert.alert('No se pudo acceder a la API ' + error);
    }
  };

  // Manejo de edición de un ítem
  const openUpdate = async (id) => {
    const form = new FormData();
    form.append('idAdministrador', id);
    const data = await fetchData(USER_API, 'readOne', form);
    if (data.status) {
      const row = data.dataset;
      setIdToUpdate(row.id_administrador);
      setNombre(row.nombre_administrador);
      setApellido(row.apellido_administrador);
      setCorreo(row.correo_administrador);
      setAlias('');
      setClave('');
      setConfirmarClave('');
      showModal();
    } else {
      Alert.alert('Error', data.error);
    }
  };

  // Identificador de si se ingresa o se actualiza
  const handleSubmit = () => {
    if (idToUpdate) {
      actualizarRegistros();
    } else {
      insertarRegistros();
    }
  };

  // Renderizar cada ítem de la lista
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}><Text style={styles.cardLabel}>ID: </Text>{item.id_administrador}</Text>
      <Text style={styles.cardText}><Text style={styles.cardLabel}>Nombre: </Text>{item.nombre_administrador}</Text>
      <Text style={styles.cardText}><Text style={styles.cardLabel}>Apellido: </Text>{item.apellido_administrador}</Text>
      <Text style={styles.cardText}><Text style={styles.cardLabel}>Correo: </Text>{item.correo_administrador}</Text>
      <Text style={styles.cardText}><Text style={styles.cardLabel}>Alias: </Text>{item.alias_administrador}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonActualizar} onPress={() => openUpdate(item.id_administrador)}>
          <Text style={styles.botonTexto}>Actualizar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonEliminar} onPress={() => showDeleteDialog(item.id_administrador)}>
          <Text style={styles.botonTexto}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  // Manejo de cierre de sesión
  const handleLogOut = async () => {
    const data = await fetchData(USER_API, 'logOut');
    try {
      if (data.status) {
        setLogueado(false)
      }else{
        Alert.alert('Error sesion', data.error);
      }
    } catch (error) {
      console.log(data);
      Alert.alert('Error sesion', data.error);
    }
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ee" />;
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>¡Bienvenido a la aplicación!</Text>
        {error && (
          <Text style={styles.errorText}>Error: {error.message}</Text>
        )}
        <Portal>
          <Modal visible={visible} onDismiss={hideModal} style={styles.modal}>
            <View style={styles.containerInput}>
              <View style={styles.containerRow}>
                <Text style={styles.title}>
                  {idToUpdate ? 'Actualizar Administrador' : 'Agregar Administrador'}
                </Text>
                <TouchableOpacity style={styles.buttonClose} onPress={hideModal}>
                  <Text style={styles.botonTexto}>X</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                placeholder='Nombre del administrador'
                onChangeText={setNombre}
                value={nombre}
                keyboardType='default'
                style={styles.input}
              />
              <TextInput
                placeholder='Apellido del administrador'
                onChangeText={setApellido}
                value={apellido}
                keyboardType='default'
                style={styles.input}
              />
              <TextInput
                placeholder='Correo del administrador'
                onChangeText={setCorreo}
                value={correo}
                keyboardType='email-address'
                style={styles.input}
              />
              <TextInput
                placeholder='Alias del administrador'
                onChangeText={setAlias}
                value={alias}
                keyboardType='default'
                style={styles.input}
                editable={!idToUpdate} // Deshabilitar en actualización
              />
              <TextInput
                placeholder='Clave del administrador'
                onChangeText={setClave}
                value={clave}
                secureTextEntry
                style={styles.input}
                editable={!idToUpdate} // Deshabilitar en actualización
              />
              <TextInput
                placeholder='Repetir clave del administrador'
                onChangeText={setConfirmarClave}
                value={confirmarClave}
                secureTextEntry
                style={styles.input}
                editable={!idToUpdate} // Deshabilitar en actualización
              />
              <TouchableOpacity style={styles.botonAgregar} onPress={handleSubmit}>
                <Text style={styles.botonTexto}>{idToUpdate ? 'Actualizar administrador' : 'Agregar administrador'}</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Dialog visible={deleteDialogVisible} onDismiss={hideDeleteDialog}>
            <Dialog.Title>Confirmar Eliminación</Dialog.Title>
            <Dialog.Content>
              <Paragraph>¿Estás seguro de que deseas eliminar este registro?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDeleteDialog}>Cancelar</Button>
              <Button onPress={confirmarEliminacion}>Aceptar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Button style={styles.botonAgregar} onPress={showModal}>
          <Text style={styles.botonTexto}>Agregar registro</Text>
        </Button>
        <FlatList
          data={response}
          renderItem={renderItem}
          keyExtractor={item => item.id_administrador.toString()}
          contentContainerStyle={styles.list}
        />
        <Button mode="contained" onPress={handleLogOut} style={styles.button}>
          Cerrar Sesión
        </Button>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f7fa', // Cambiado a un tono azul claro
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00796b', // Cambiado a un tono verde oscuro
    textAlign: 'center',
    margin: 20,
  },
  button: {
    marginTop: 10,
    padding: 15, // Aumentado el padding para mejor apariencia
    backgroundColor: '#00796b', // Cambiado a un tono verde oscuro
    borderRadius: 12, // Redondeado aumentado
  },
  containerInput: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
  containerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderColor: '#80cbc4', // Cambiado a un tono verde claro
    borderWidth: 1,
    borderRadius: 8, // Redondeado aumentado
    padding: 10,
    marginVertical: 5,
  },
  botonAgregar: {
    backgroundColor: '#00796b', // Cambiado a un tono verde oscuro
    padding: 15, // Aumentado el padding para mejor apariencia
    borderRadius: 8,
    marginTop: 10,
  },
  botonTexto: {
    color: '#ffffff', // Cambiado a un tono blanco
    fontSize: 16,
    textAlign: 'center',
  },
  buttonActualizar: {
    padding: 15, // Aumentado el padding para mejor apariencia
    backgroundColor: '#388e3c', // Cambiado a un tono verde
    borderRadius: 12, // Redondeado aumentado
    marginVertical: 5,
  },
  buttonEliminar: {
    padding: 15, // Aumentado el padding para mejor apariencia
    backgroundColor: '#d32f2f', // Cambiado a un tono rojo oscuro
    borderRadius: 12, // Redondeado aumentado
    marginVertical: 5,
  },
  buttonClose: {
    padding: 15, // Aumentado el padding para mejor apariencia
    backgroundColor: '#d32f2f', // Cambiado a un tono rojo oscuro
    borderRadius: 12, // Redondeado aumentado
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#00796b', // Agregado color para título
  },
  card: {
    backgroundColor: '#ffffff', // Fondo blanco
    padding: 20,
    marginBottom: 10,
    borderRadius: 12, // Redondeado aumentado
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width: '100%',
  },
  cardText: {
    fontSize: 18,
    marginBottom: 5,
    color: '#00796b', // Cambiado a un tono verde oscuro
  },
  cardLabel: {
    fontWeight: 'bold',
    color: '#00796b', // Cambiado a un tono verde oscuro
  },
  errorText: {
    fontSize: 18,
    color: '#d32f2f', // Cambiado a un tono rojo oscuro
  },
  list: {
    paddingBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modal: {
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fondo blanco con opacidad
    padding: 20,
    margin: 20,
    borderRadius: 10, // Redondeado aumentado
    elevation: 5,
  }
});


export default HomeScreen;
