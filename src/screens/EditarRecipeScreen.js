import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator // Import ActivityIndicator para o loading
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../services/api";
import { Picker } from '@react-native-picker/picker'; // Picker já está importado

export default function EditRecipeScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { recipeId, token, userId } = route.params; // Adicione userId se precisar para navegação de volta

  // Removido recipeData, pois os estados individuais são suficientes
  const [loading, setLoading] = useState(true);

  // Estados para os campos do formulário
  const [recipeName, setRecipeName] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [portions, setPortions] = useState("1"); // Inicialize como string se o input for controlado assim
  const [level, setLevel] = useState(""); // Estado para o nível (será usado pelo Picker)
  const [categorias, setCategorias] = useState(''); // Estado para a categoria (será usado pelo Picker)
  const [ingredients, setIngredients] = useState([""]); // Inicialize com um ingrediente vazio
  const [description, setDescription] = useState("");


  // Buscar os dados da receita ao carregar a tela
  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true); // Começa a carregar
      try {
        const response = await api.get(`/recipe/${recipeId}`, { // Adicione headers se a leitura for protegida
           headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;

        // Define os estados com os dados recebidos da API
        setRecipeName(data.recipeName || "");
        setPrepTime(data.prepTime || "");
        setPortions(data.portions?.toString() || "1"); // Converta para string e use um padrão
        setLevel(data.level || ""); // Define o nível inicial
        setCategorias(data.categorias || ""); // <-- Define a categoria inicial
        // Certifique-se que ingredients seja sempre um array, mesmo que vazio
        setIngredients(Array.isArray(data.ingredients) && data.ingredients.length > 0 ? data.ingredients : [""]);
        setDescription(data.description || "");

      } catch (error) {
        console.error("Erro ao buscar receita para edição:", error.response?.data || error.message);
        Alert.alert("Erro", "Não foi possível carregar os dados da receita.");
        // Talvez navegar de volta ou mostrar uma mensagem mais persistente
         navigation.goBack();
      } finally {
        setLoading(false); // Termina de carregar (sucesso ou erro)
      }
    };

    fetchRecipe();
  }, [recipeId, token]); // Inclua token se a leitura for protegida


  // Função para atualizar a receita
  const handleUpdate = async () => {
    // Validação simples (pode ser mais robusta)
    if (!recipeName || !prepTime || !level || !categorias || ingredients.some(ing => !ing) || !description) {
       Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
       return;
    }

    try {
      const updatedRecipe = {
        recipeName,
        prepTime,
        portions: parseInt(portions, 10) || 1, 
        level,
        categorias,         
        ingredients: ingredients.filter(ing => ing.trim() !== ""),
        description,
      };

      console.log("Atualizando com dados:", updatedRecipe); 

      await api.put(`/recipe/${recipeId}`, updatedRecipe, { 
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Sucesso", "Receita atualizada com sucesso!");
       navigation.navigate("Home", { token, userId }); 

    } catch (error) {
      console.error("Erro ao atualizar receita:", error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível atualizar a receita. Verifique os dados e tente novamente.");
    }
  };

  
   const handleIngredientChange = (text, index) => {
     const newIngredients = [...ingredients];
     newIngredients[index] = text;
     setIngredients(newIngredients);
   };

   const addIngredientField = () => {
     setIngredients([...ingredients, ""]); // Adiciona um novo campo vazio
   };

   const removeIngredientField = (index) => {
      if (ingredients.length <= 1) return; // Não remover o último campo
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
   };


  // Tela de Carregamento
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F9A826" />
        <Text>Carregando dados da receita...</Text>
      </View>
    );
  }

  // Formulário de Edição
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Editar Receita</Text>

      {/* Nome da Receita */}
      <Text style={styles.label}>Nome da Receita</Text>
      <TextInput
        style={styles.input}
        value={recipeName}
        onChangeText={setRecipeName}
        placeholder="Ex: Bolo de Cenoura"
      />

      {/* Tempo de Preparo */}
      <Text style={styles.label}>Tempo de preparo</Text>
      <TextInput
        style={styles.input}
        value={prepTime}
        onChangeText={setPrepTime}
        placeholder="Ex: 45 minutos"
      />

       {/* Porções */}
       {/* Se quiser o controle +/- como em NovaReceita, teria que adaptar aqui */}
      <Text style={styles.label}>Porções</Text>
      <TextInput
        style={styles.input}
        value={portions}
        onChangeText={setPortions}
        keyboardType="numeric"
        placeholder="Ex: 8"
      />

      {/* Nível */}
      <Text style={styles.label}>Nível</Text>
      <View style={styles.pickerWrapper}> {/* Wrapper para estilização */}
        <Picker
          selectedValue={level}
          onValueChange={(itemValue) => setLevel(itemValue)}
          style={styles.picker}
          mode="dropdown"
        >
          <Picker.Item label="Selecione o nível..." value="" enabled={false} style={styles.pickerItemPlaceholder}/>
          <Picker.Item label="Fácil" value="facil" style={styles.pickerItem} />
          <Picker.Item label="Médio" value="medio" style={styles.pickerItem} />
          <Picker.Item label="Difícil" value="dificil" style={styles.pickerItem} />
        </Picker>
      </View>

      {/* Categoria */}
      <Text style={styles.label}>Categoria</Text>
      <View style={styles.pickerWrapper}> {/* Wrapper para estilização */}
        <Picker
          selectedValue={categorias}
          onValueChange={(itemValue) => setCategorias(itemValue)}
          style={styles.picker}
          mode="dropdown"
        >
          <Picker.Item label="Selecione a categoria..." value="" enabled={false} style={styles.pickerItemPlaceholder}/>
          <Picker.Item label="Salgados" value="salgados" style={styles.pickerItem} />
          <Picker.Item label="Massas" value="massas" style={styles.pickerItem} />
          <Picker.Item label="Sopas" value="sopas" style={styles.pickerItem} />
          <Picker.Item label="Bebidas" value="bebidas" style={styles.pickerItem} />
          <Picker.Item label="Doces" value="doces" style={styles.pickerItem} />
          <Picker.Item label="Carnes" value="carnes" style={styles.pickerItem} />
        </Picker>
      </View>

      {/* Ingredientes */}
      <Text style={styles.label}>Ingredientes</Text>
      {ingredients.map((ingredient, index) => (
         <View key={index} style={styles.ingredientContainer}>
           <TextInput
             style={styles.ingredientInput}
             value={ingredient}
             onChangeText={(text) => handleIngredientChange(text, index)}
             placeholder={`Ingrediente ${index + 1}`}
           />
           {ingredients.length > 1 && ( // Só mostra botão de remover se houver mais de 1
              <TouchableOpacity onPress={() => removeIngredientField(index)} style={styles.removeButton}>
                 <Text style={styles.removeButtonText}>X</Text>
              </TouchableOpacity>
           )}
         </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={addIngredientField}>
        <Text style={styles.addButtonText}>+ Adicionar Ingrediente</Text>
      </TouchableOpacity>

      {/* Descrição */}
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.textArea]} // Combine estilos
        multiline
        value={description}
        onChangeText={setDescription}
        placeholder="Descreva o modo de preparo..."
      />

      {/* Botão Salvar */}
      <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
      </TouchableOpacity>

       {/* Espaço extra no final para melhor scroll */}
       <View style={{ height: 50 }} />
    </ScrollView>
  );
}

// Estilos (ajustados e adicionados para Pickers e Ingredientes)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24, // Ajustado
    fontWeight: "bold",
    marginBottom: 25, // Ajustado
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 8, // Ajustado
    color: "#555",
    fontWeight: '600', // Destaque
  },
  input: {
    backgroundColor: "#f2f2f2", // Fundo suave
    borderWidth: 1,            // Borda sutil
    borderColor: '#e0e0e0',    // Cor da borda
    borderRadius: 8,
    paddingHorizontal: 15,     // Mais padding
    paddingVertical: 12,       // Mais padding
    marginBottom: 20,          // Espaçamento maior
    fontSize: 16,
  },
  textArea: {
     height: 150,              // Aumentado
     textAlignVertical: "top",
  },
  // Estilo para envolver os Pickers
  pickerWrapper: {
    backgroundColor: "#f2f2f2",
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 20,
    height: 55, // Ajuste a altura conforme necessário para o Picker caber bem
    justifyContent: 'center', // Centraliza o picker verticalmente
  },
  picker: {
     width: '100%',
    // backgroundColor: 'transparent', // Para não sobrepor o fundo do wrapper
    // color: '#333' // Cor do texto do item selecionado (pode precisar no Android)
  },
  pickerItemPlaceholder: {
    color: '#999', // Cor para o texto do placeholder
    // fontSize: 16, // Mantenha consistente se necessário
  },
  pickerItem: {
    // fontSize: 16,
    // color: '#333', // Cor do texto dos itens normais
  },
  // Estilos para a lista de ingredientes
  ingredientContainer: {
     flexDirection: 'row',
     alignItems: 'center',
     marginBottom: 10,
  },
  ingredientInput: {
     flex: 1, // Ocupa a maior parte do espaço
     backgroundColor: "#f2f2f2",
     borderWidth: 1,
     borderColor: '#e0e0e0',
     borderRadius: 8,
     paddingHorizontal: 15,
     paddingVertical: 10, // Menor padding vertical
     fontSize: 16,
     marginRight: 10, // Espaço antes do botão remover
  },
  removeButton: {
     padding: 8,
     backgroundColor: '#ffdddd', // Fundo vermelho claro
     borderRadius: 5,
  },
  removeButtonText: {
     color: '#cc0000', // Vermelho escuro
     fontWeight: 'bold',
     fontSize: 14,
  },
  addButton: {
    alignSelf: 'flex-start', // Alinha à esquerda
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e0f2fe', // Fundo azul claro
    borderRadius: 5,
    marginBottom: 20,
  },
  addButtonText: {
    color: "#0288d1", // Azul
    fontSize: 15,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: "#F9A826", // Cor principal
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10, // Espaço antes do botão
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});