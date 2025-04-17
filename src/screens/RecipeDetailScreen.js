"use client"

import { useState, useEffect } from "react"
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    TextInput,
    Alert,
    Button,
} from "react-native"
import { useRoute, useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import api from "../services/api"
import moment from "moment";

export default function RecipeDetailScreen() {
    const route = useRoute()
    const navigation = useNavigation()
    const { recipeId, token, userId } = route.params


    const [recipe, setRecipe] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isFavorited, setIsFavorited] = useState(false)
    const [userData, setUserData] = useState(null)


    const [comentario, setComentario] = useState('');
    const [comentarios, setComentarios] = useState([]);



    // Buscar dados do usuário
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get(`/users/${userId}`)
                setUserData(response.data)

                if (response.data.favorites && Array.isArray(response.data.favorites)) {
                    setIsFavorited(response.data.favorites.includes(recipeId))
                }
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error)
            }
        }

        if (userId) {
            fetchUserData()
        }
    }, [userId, recipeId])

    // Buscar detalhes da receita
    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                setLoading(true)
                const response = await api.get(`/recipe/${recipeId}`)
                setRecipe(response.data)
                setComentarios(response.data.comentarios || []);
                setLoading(false)
            } catch (error) {
                console.error("Erro ao buscar detalhes da receita:", error)
                setLoading(false)
            }
        }

        fetchRecipeDetails()
    }, [recipeId])

    const fetchComentarios = async () => {
        try {
            const response = await api.get(`/recipe/${recipeId}`);
            setComentarios(response.data.comentarios || []);
        } catch (error) {
            console.error("Erro ao buscar comentários:", error);
        }
    };


    const handleComentar = async () => {
        try {
            const response = await api.put(
                `/recipe/comentar/${recipeId}`,
                { texto: comentario },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchComentarios();
            setComentario("");
        } catch (error) {
            console.error("Erro ao comentar:", error);
            Alert.alert("Erro", "Não foi possível adicionar o comentário");
        }
    };

    // Favoritar/desfavoritar
    const toggleFavorite = async () => {
        try {
            if (!userId) {
                Alert.alert("Erro", "Você precisa estar logado para favoritar receitas.")
                return
            }

            const endpoint = isFavorited
                ? `/users/desfavoritar/${userId}/${recipeId}`
                : `/users/favoritar/${userId}/${recipeId}`

            const response = await api.post(endpoint)

            if (response.data && response.data.favorites) {
                setIsFavorited(!isFavorited)
                setUserData({
                    ...userData,
                    favorites: response.data.favorites,
                })
            }
        } catch (error) {
            console.error("Erro ao (des)favoritar receita:", error)
        }
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F9A826" />
                <Text style={styles.loadingText}>Carregando receita...</Text>
            </View>
        )
    }

    const recipeData = recipe
    const isOwner = recipeData?.usuario._id === userId
    console.log("isOwner:", isOwner)



    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={28} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Icon name="menu" size={28} color="#000" />
                    </TouchableOpacity>
                </View>

                <Image
                    source={{ uri: recipeData?.image || "https://cdn.pixabay.com/photo/2016/05/06/12/25/cook-1375797_640.jpg" }}
                    style={styles.recipeImage}
                />

                <View style={styles.titleContainer}>
                    <Text style={styles.recipeTitle}>{recipeData?.recipeName}</Text>
                    <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
                        <Icon name="heart" size={28} color={isFavorited ? "#F9A826" : "#000"} />
                    </TouchableOpacity>
                </View>

                <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4].map((_, i) => (
                        <Text key={i} style={styles.starFilled}>★</Text>
                    ))}
                    <Text style={styles.starEmpty}>★</Text>
                    <Text style={styles.ratingText}> {recipeData?.rating}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Tempo de prep(Minutos).</Text>
                        <Text style={styles.infoValue} adjustsFontSizeToFit>{recipeData?.prepTime}</Text>

                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Porções</Text>
                        <Text style={styles.infoValue} adjustsFontSizeToFit>{recipeData?.portions}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Nível</Text>
                        <Text style={styles.infoValue} adjustsFontSizeToFit>{recipeData?.level}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ingredientes</Text>
                    {Array.isArray(recipeData?.ingredients) &&
                        recipeData.ingredients.map((ingredient, index) => (
                            <View key={index} style={styles.ingredientItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.ingredientText}>{ingredient}</Text>
                            </View>
                        ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Descrição</Text>
                    <Text style={styles.instructionText}>
                        {recipeData?.description || "Sem descrição disponível."}
                    </Text>
                </View>

                
                {comentarios.length === 0 ? (
                    <Text style={{ color: "#999" }}>Nenhum comentário ainda.</Text>
                ) : (
                    comentarios.map((comentario, index) => (
                        <View key={index} style={styles.commentContainer}>
                            <View style={styles.avatarContainer}>
                                <Image
                                    source={{
                                        uri: comentario.usuario?.avatar || "https://cdn.pixabay.com/photo/2017/02/25/22/04/user-icon-2098873_640.png",
                                    }}
                                    style={styles.avatar}
                                />
                            </View>
                            
                            <View style={styles.bubble}>
                                
                                <Text style={styles.username}>
                                    
                                    {comentario.usuario?.username || "Anônimo"}
                                </Text>
                                <Text style={styles.commentText}>{comentario.texto}</Text>
                                <Text style={styles.commentDate}>
                                    {moment(comentario.dataCriacao).format("DD/MM/YYYY HH:mm")}
                                </Text>
                            </View>
                        </View>
                    ))
                )}

                

                {/* Campo de adicionar comentário */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Comentar</Text>
                    <TextInput
                        value={comentario}
                        onChangeText={setComentario}
                        placeholder="Escreva um comentário..."
                        multiline
                        style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10 }}
                    />
                    <Button title="Enviar Comentário" onPress={handleComentar} />
                </View>

                {isOwner && (
                    <View style={styles.ownerButtonsContainer}>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() =>
                                navigation.navigate("EditarRecipe", {
                                    recipeId,
                                    token,
                                    userId,
                                })
                            }
                        >
                            <Text style={styles.buttonText}>Editar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => {
                                Alert.alert(
                                    "Excluir Receita",
                                    "Tem certeza que deseja excluir esta receita?",
                                    [
                                        { text: "Cancelar", style: "cancel" },
                                        {
                                            text: "Excluir",
                                            style: "destructive",
                                            onPress: async () => {
                                                try {
                                                    await api.delete(`/recipe/${recipeId}`, {
                                                        headers: { Authorization: `Bearer ${token}` },
                                                    })
                                                    Alert.alert("Sucesso", "Receita excluída com sucesso!")
                                                    navigation.goBack()
                                                } catch (error) {
                                                    console.error("Erro ao excluir receita:", error)
                                                    Alert.alert("Erro", "Não foi possível excluir a receita.")
                                                }
                                            },
                                        },
                                    ]
                                )
                            }}
                        >
                            <Text style={styles.buttonText}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            <TouchableOpacity style={styles.fab}>
                <Icon name="plus" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home', { token, userId })}>
                    <Icon name="home" size={24} color="#ccc" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Icon name="bookmark" size={24} color="#F9A826" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile', { token, userId })}>
                    <Icon name="user" size={24} color="#ccc" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#888",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
    },
    recipeImage: {
        width: "100%",
        height: 300,
        resizeMode: "cover",
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    recipeTitle: {
        fontSize: 32,
        fontWeight: "bold",
        flex: 1,
    },
    favoriteButton: {
        padding: 10,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        marginTop: 5,
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
        fontSize: 20,
        color: "#888",
    },
    infoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    infoItem: {
        alignItems: "center",
        flex: 1,
    },
    infoLabel: {
        fontSize: 18,
        color: "#888",
        marginBottom: 5,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    divider: {
        height: 1,
        backgroundColor: "#E0E0E0",
        marginHorizontal: 80,
        marginBottom: 30,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
    },
    ingredientItem: {
        flexDirection: "row",
        marginBottom: 15,
        alignItems: "flex-start",
    },
    bulletPoint: {
        fontSize: 20,
        marginRight: 10,
        color: "#000",
    },
    ingredientText: {
        fontSize: 18,
        flex: 1,
    },
    instructionItem: {
        flexDirection: "row",
        marginBottom: 20,
        alignItems: "flex-start",
    },
    instructionNumber: {
        fontSize: 18,
        fontWeight: "bold",
        marginRight: 10,
    },
    instructionText: {
        fontSize: 18,
        flex: 1,
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
    ownerButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
        marginBottom: 40,
    },

    editButton: {
        backgroundColor: "#F9A826",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },

    deleteButton: {
        backgroundColor: "#FF4C4C",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },

    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    commentContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 20,
    },
    
    avatarContainer: {
        marginRight: 10,
    },
    
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#eee",
    },
    
    bubble: {
        backgroundColor: "#f0f0f0",
        padding: 12,
        borderRadius: 16,
        maxWidth: "80%",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 1,
    },
    
    username: {
        fontWeight: "bold",
        marginBottom: 4,
    },
    
    commentText: {
        fontSize: 16,
        marginBottom: 6,
    },
    
    commentDate: {
        fontSize: 12,
        color: "#888",
        textAlign: "right",
    },
})
