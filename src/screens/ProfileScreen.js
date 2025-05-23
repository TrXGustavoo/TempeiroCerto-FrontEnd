"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native"
import Icon from "react-native-vector-icons/Feather"
import LinearGradient from "react-native-linear-gradient"
import api from "../services/api"

const { width } = Dimensions.get("window")

export default function ProfileScreen({ navigation, route }) {
  const [activeTab, setActiveTab] = useState("Receitas")
  const [userRecipes, setUserRecipes] = useState([])
  const [favoriteRecipes, setFavoriteRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)

  // Extrair userId e token dos parâmetros da rota
  const { userId, token } = route.params || {}

  // Buscar dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingUser(true)
        const response = await api.get(`/users/${userId}`)
        setUserData(response.data)
        setLoadingUser(false)
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error)
        setLoadingUser(false)
      }
    }

    if (userId) {
      fetchUserData()
    }
  }, [userId])

  // Buscar receitas do usuário
  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/recipe/minhas-receitas`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        setUserRecipes(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Erro ao buscar receitas do usuário:", error)
        setLoading(false)
      }
    }

    if (userId) {
      fetchUserRecipes()
    }
  }, [userId])

  // Função para renderizar o card de receita
  const renderRecipeCard = (recipe) => (
    <View key={recipe.id} style={styles.recipeCard}>
      <Image source={{ uri: recipe.image || "https://via.placeholder.com/400x200" }} style={styles.recipeImage} />
      <View style={styles.recipeOverlay}>
        <View style={styles.recipeContent}>
          <Text style={styles.recipeTitle}>{recipe.recipeName}</Text>
          <Text style={styles.recipeChef}>By {userData ? userData.username || userData.name : "Chef"}</Text>
        </View>
        <View style={styles.recipeFooter}>
          <View style={styles.timeContainer}>
            <Icon name="clock" size={16} color="#fff" />
            <Text style={styles.timeText}>{recipe.prepTime || "20"} min</Text>
          </View>
          <TouchableOpacity style={styles.favoriteButton}>
            <View style={styles.favoriteCircle}>
              <Icon name="heart" size={20} color="#000" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.ratingContainer}>
        <Icon name="star" size={14} color="#F9A826" />
        <Text style={styles.ratingText}>{recipe.rating || "4.0"}</Text>
      </View>
    </View>
  )

  // Renderizar o conteúdo do perfil
  const renderProfileContent = () => {
    if (loadingUser) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F9A826" />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      )
    }

    return (
      <>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: userData?.profileImage || "https://i.pravatar.cc/150?img=3",
              }}
              style={styles.profileImage}
            />
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.statsLabel}>Receitas</Text>
            <Text style={styles.statsNumber}>{userRecipes.length || 0}</Text>
          </View>
        </View>

        <Text style={styles.userName}>{userData?.username || userData?.name || "Usuário"}</Text>
        <Text style={styles.userSubtitle}>{userData?.email || "Meu nome"}</Text>
        <Text style={styles.userBio}>{userData?.bio || "Aqui vai a BIO..."}</Text>
      </>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <TouchableOpacity>
          <Icon name="menu" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderProfileContent()}

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "Receitas" && styles.activeTabButton]}
            onPress={() => setActiveTab("Receitas")}
          >
            <Text style={[styles.tabText, activeTab === "Receitas" && styles.activeTabText]}>Receitas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === "Favoritos" && styles.activeTabButton]}
            onPress={() => setActiveTab("Favoritos")}
          >
            <Text style={[styles.tabText, activeTab === "Favoritos" && styles.activeTabText]}>Favoritos</Text>
          </TouchableOpacity>
        </View>

        {/* Recipe List */}
        <View style={styles.recipeList}>
          {activeTab === "Receitas" ? (
            loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F9A826" />
                <Text style={styles.loadingText}>Carregando receitas...</Text>
              </View>
            ) : userRecipes.length > 0 ? (
              userRecipes.map((recipe) => renderRecipeCard(recipe))
            ) : (
              <Text style={styles.emptyText}>Você ainda não criou nenhuma receita</Text>
            )
          ) : (
            <Text style={styles.emptyText}>Nenhum favorito ainda</Text>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate("NovaReceita", {
            token,
            userId,
            userName: userData?.username || userData?.name,
          })
        }
      >
        <LinearGradient colors={["#F9A826", "#F9A826"]} style={styles.fabGradient}>
          <Icon name="plus" size={24} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home", { token, userId })}>
          <Icon name="home" size={24} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="bookmark" size={24} color="#ccc" />
        </TouchableOpacity>
        <View style={styles.navItem} />
        <TouchableOpacity style={styles.navItem}>
          <LinearGradient colors={["#F9A826", "#F9A826"]} style={styles.activeNavIcon}>
            <Icon name="user" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
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
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#F9A826",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  statsContainer: {
    marginLeft: 30,
    alignItems: "center",
  },
  statsLabel: {
    fontSize: 18,
    color: "#000",
  },
  statsNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
  },
  userName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginTop: 15,
    paddingHorizontal: 20,
  },
  userSubtitle: {
    fontSize: 16,
    color: "#888",
    paddingHorizontal: 20,
  },
  userBio: {
    fontSize: 16,
    color: "#000",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  activeTabButton: {
    backgroundColor: "#F9A826",
    borderRadius: 10,
  },
  tabText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#888",
  },
  activeTabText: {
    color: "#000",
  },
  recipeList: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for FAB and bottom nav
  },
  recipeCard: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
  },
  recipeImage: {
    width: "100%",
    height: "100%",
  },
  recipeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "space-between",
    padding: 15,
  },
  recipeContent: {
    flex: 1,
    justifyContent: "flex-end",
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  recipeChef: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
  },
  recipeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    color: "#fff",
    marginLeft: 5,
  },
  favoriteButton: {
    padding: 5,
  },
  favoriteCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  ratingContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
  },
  ratingText: {
    marginLeft: 3,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
  fab: {
    position: "absolute",
    bottom: 75,
    alignSelf: "center",
    elevation: 5,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomNav: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activeNavIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
})
