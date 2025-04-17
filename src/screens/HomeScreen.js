"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native"
import { ScrollSView as HorizontalScrollView } from 'react-native';
import { useRoute, useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import api from "../services/api"

export default function HomeScreen({ navigation }) {
  const route = useRoute()
  const { token, userId } = route.params

  const [receitas, setReceitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [favoritedRecipes, setFavoritedRecipes] = useState([])
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair da sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sair",
          onPress: () => {
            // Navegar para a tela de login e limpar a pilha de navegação
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  // Buscar dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/users/${userId}`)
        setUserData(response.data)

        // Se o usuário tiver favoritos, armazene-os no estado
        if (response.data.favorites && Array.isArray(response.data.favorites)) {
          setFavoritedRecipes(response.data.favorites)
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error)
      }
    }

    if (userId) {
      fetchUserData()
    }
  }, [userId])

  // Buscar todas as receitas
  useEffect(() => {
    const fetchReceitas = async () => {
      try {
        setLoading(true)
        const response = await api.get("/recipe/list")
        setReceitas(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Erro ao buscar receitas:", error)
        setLoading(false)
      }
    }

    fetchReceitas()
  }, [])


  const toggleFavorite = async (recipeId) => {
    try {
      if (!userId) {
        Alert.alert("Erro", "Você precisa estar logado para favoritar receitas.");
        return;
      }

      const isFavorited = favoritedRecipes.includes(recipeId);


      const endpoint = isFavorited
        ? `/users/desfavoritar/${userId}/${recipeId}`
        : `/users/favoritar/${userId}/${recipeId}`;

      const response = await api.post(endpoint);

      if (response.data && response.data.favorites) {
        setFavoritedRecipes(response.data.favorites);
        setUserData({
          ...userData,
          favorites: response.data.favorites,
        });

        Alert.alert("Sucesso", isFavorited
          ? "Receita removida dos favoritos!"
          : "Receita adicionada aos favoritos!");
      }
    } catch (error) {
      console.error("Erro ao (des)favoritar receita:", error);
      Alert.alert("Erro", "Não foi possível atualizar os favoritos. Tente novamente.");
    }
  };

  // Verificar se uma receita está favoritada
  const isRecipeFavorited = (recipeId) => {
    return favoritedRecipes.includes(recipeId)
  }

  const filteredReceitas = selectedCategoria
    ? receitas.filter(recipe => recipe.caregotia === selectedCategoria)
    : receitas;


  const handleCategoryPress = (categoria) => {
    setSelectedCategoria(selectedCategoria === categoria ? null : categoria);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image
              source={{
                uri: userData?.profileImage || "https://cdn.pixabay.com/photo/2017/02/25/22/04/user-icon-2098873_640.png",
              }}
              style={styles.avatar}
            />
            <Text style={styles.helloText}>
              Olá {userData?.username || userData?.username || "Usuário"} <Text>👋</Text>
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Icon name="log-out" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="menu" size={28} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput placeholder="Buscar receitas..." style={styles.searchInput} />
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Icon name="search" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Categorias */}
        <Text style={styles.sectionTitle}>Categorias</Text>
        <View style={styles.categories}>
          {["Massas", "Sopas", "Sobremesas", "Bebidas"].map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryItem}
              onPress={() => handleCategoryPress(cat)}
            >
              <View style={[
                styles.categoryImageContainer,
                selectedCategoria === cat && styles.selectedCategory
              ]}>
                <Image
                  source={{ uri: getCategoryImage(cat) }}
                  style={styles.categoryImage}
                />
              </View>
              <Text style={styles.categoryLabel}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Receitas */}
        <Text style={styles.sectionTitle}>
          {selectedCategoria ? `Receitas de ${selectedCategoria}` : 'Todas as Receitas'}
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F9A826" />
            <Text style={styles.loadingText}>Carregando receitas...</Text>
          </View>
        ) : filteredReceitas.length > 0 ? (
          filteredReceitas.map((receita, index) => (
            <RecipeCard
              key={index}
              recipe={receita}
              token={token}
              userId={userId}
              isFavorited={isRecipeFavorited(receita._id || receita.id)}
              onFavoritePress={() => toggleFavorite(receita._id || receita.id)}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>
            {selectedCategoria
              ? `Nenhuma receita encontrada na categoria ${selectedCategoria}`
              : "Nenhuma receita encontrada."}
          </Text>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("NovaReceita", { token, userId })}>
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={24} color="#F9A826" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="bookmark" size={24} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Profile", { token, userId })}>
          <Icon name="user" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

function RecipeCard({ recipe, token, userId, isFavorited, onFavoritePress }) {
  console.log("RecipeCard", recipe.categorias)
  const navigation = useNavigation();


  const getDefaultRecipeImage = (category) => {
    switch (category) {
      case 'massas':
        return 'https://cdn.pixabay.com/photo/2018/07/18/19/12/pasta-3547078_1280.jpg';
      case 'sopas':
        return 'https://cdn.pixabay.com/photo/2017/03/17/17/33/potato-soup-2152254_640.jpg';
      case 'doces':
        return 'https://cdn.pixabay.com/photo/2021/09/04/05/06/brigadier-6597018_640.jpg';
      case 'bebidas':
        return 'https://cdn.pixabay.com/photo/2016/07/21/11/17/drink-1532300_1280.jpg';
      default:
        return 'https://cdn.pixabay.com/photo/2016/05/06/12/25/cook-1375797_640.jpg';
    }
  };

  // Determina a imagem a ser usad
  const recipeImage = recipe.image ||
    getDefaultRecipeImage(recipe.categorias?.[0]) ||
    'https://cdn.pixabay.com/photo/2016/05/06/12/25/cook-1375797_640.jpg';

  return (
    <TouchableOpacity onPress={() => navigation.navigate('RecipeDetail', {
      recipeId: recipe._id,
      token,
      userId,
    })}>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{recipe.categorias?.[0] || "Outros"}</Text>
          </View>
          <Text style={styles.cardTitle}>{recipe.recipeName}</Text>
        </View>
        <View style={styles.cardImageContainer}>
          <Image
            source={{ uri: recipeImage }}
            style={styles.cardImage}
            defaultSource={{ uri: 'https://cdn.pixabay.com/photo/2016/05/06/12/25/cook-1375797_640.jpg' }}
          />
          <TouchableOpacity style={styles.favoriteButton} onPress={onFavoritePress}>
            <View style={styles.favoriteCircle}>
              <Icon name="heart" size={20} color={isFavorited ? "#F9A826" : "#000"} solid={isFavorited} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

function getCategoryImage(category) {
  switch (category) {
    case "Massas":
      return "https://cdn.pixabay.com/photo/2020/05/10/14/32/fresh-pasta-5154248_1280.jpg"
    case "Sopas":
      return "https://cdn.pixabay.com/photo/2017/03/17/17/33/potato-soup-2152254_640.jpg"
    case "Sobremesas":
      return "https://cdn.pixabay.com/photo/2016/11/22/19/31/macarons-1850216_1280.jpg"
    case "Bebidas":
      return "https://cdn.pixabay.com/photo/2016/11/29/13/33/cocktails-1869868_1280.jpg"
    default:
      return "https://cdn.pixabay.com/photo/2016/05/06/12/25/cook-1375797_640.jpg"
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#F9A826",
  },
  helloText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#888",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  searchInputContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 15,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    height: "100%",
  },
  searchButton: {
    backgroundColor: "#F9A826",
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  categories: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  categoryItem: {
    alignItems: "center",
  },
  categoryImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#F9A826",
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
  selectedCategory: {
    borderColor: "#FF5722",
    backgroundColor: '#FFF3E0',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryLabel: {
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F9A826",
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardContent: {
    flex: 1,
    paddingRight: 15,
  },
  categoryBadge: {
    backgroundColor: "#F9A826",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  categoryText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  starFilled: {
    fontSize: 24,
    color: "#F9A826",
  },
  starEmpty: {
    fontSize: 24,
    color: "#E0E0E0",
  },
  ratingText: {
    color: "#888",
    fontSize: 24,
  },
  cardImageContainer: {
    position: "relative",
  },
  cardImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  favoriteButton: {
    position: "absolute",
    bottom: -10,
    right: -10,
    zIndex: 10,
  },
  favoriteCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  fab: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    backgroundColor: "#F9A826",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  navItem: {
    alignItems: "center",
  },
})