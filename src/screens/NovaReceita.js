import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import api from '../services/api';



const NovaReceita = () => {
  const navigation = useNavigation();
  const [recipeImage, setRecipeImage] = useState(null);
  const [recipeName, setRecipeName] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [portions, setPortions] = useState(1);
  const [level, setLevel] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [description, setDescription] = useState('');

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setRecipeImage(imageUri);
      }
    });
  };

  const handleNewRecipe = async () => {

    try {
        const response =  api.post(
            "/recipe/",
            {
                recipeImage,
                recipeName,
                prepTime,
                portions,
                level,
                ingredients,
                description
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );

        console.log(response.data); // token, message, etc.

        navigation.navigate("Home");

    } catch (error) {
        console.error("Erro ao criar receita", error);

    }
  };

  const increasePortions = () => setPortions(portions + 1);
  const decreasePortions = () => setPortions(Math.max(1, portions - 1));

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
            <Icon name="arrow-left" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nova Receita</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="menu" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Imagem */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Imagem</Text>
            <TouchableOpacity style={styles.imageUpload} onPress={handleImagePicker}>
              {recipeImage ? (
                <Image source={{ uri: recipeImage }} style={styles.previewImage} />
              ) : (
                <Text style={styles.uploadText}>Upload da Imagem</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Nome da Receita */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome da Receita</Text>
            <TextInput
              style={styles.input}
              value={recipeName}
              onChangeText={setRecipeName}
              placeholder=""
            />
          </View>

          {/* Tempo de preparo */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tempo de preparo</Text>
            <TextInput
              style={styles.input}
              value={prepTime}
              onChangeText={setPrepTime}
              placeholder=""
            />
          </View>

          {/* Porções e Nível */}
          <View style={styles.rowContainer}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Porções</Text>
              <View style={styles.portionsContainer}>
                <TouchableOpacity onPress={increasePortions} style={styles.portionButton}>
                  <Icon name="chevron-up" size={20} color="#999" />
                </TouchableOpacity>
                <Text style={styles.portionsText}>{portions}</Text>
                <TouchableOpacity onPress={decreasePortions} style={styles.portionButton}>
                  <Icon name="chevron-down" size={20} color="#999" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.formGroup, { flex: 2 }]}>
              <Text style={styles.label}>Nível</Text>
              <TouchableOpacity style={styles.selectInput}>
                <Text style={styles.selectText}>{level || ''}</Text>
                <Icon name="chevron-down" size={20} color="#999" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Ingredientes */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Ingredientes</Text>
            <TextInput
              style={styles.textArea}
              value={ingredients}
              onChangeText={setIngredients}
              placeholder=""
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Descrição */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Descreva sua receita...</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder=""
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Botão Salvar */}
        <TouchableOpacity style={styles.saveButton} onPress={handleNewRecipe}>
          <Text style={styles.saveButtonText}>Salvar</Text>
          <Icon name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  imageUpload: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: '#999',
    fontSize: 16,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  portionsContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    height: 50,
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  portionButton: {
    padding: 5,
  },
  portionsText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  selectInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  saveButton: {
    backgroundColor: '#F9A826',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default NovaReceita;