import React from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { FontAwesome } from 'react-native-vector-icons';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=3' }} style={styles.avatar} />
            <Text style={styles.helloText}>Hello Sara <Text>👋</Text></Text>
          </View>
          <TouchableOpacity>
            <Icon name="menu" size={28} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput placeholder="" style={styles.searchInput} />
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Icon name="search" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Categorias */}
        <Text style={styles.sectionTitle}>Categorias</Text>
        <View style={styles.categories}>
          {['Massas', 'Sopas', 'Sobremesas', 'Bebidas'].map((cat, index) => (
            <View key={index} style={styles.categoryItem}>
              <Image
                source={{ uri: getCategoryImage(cat) }}
                style={styles.categoryImage}
              />
              <Text style={styles.categoryLabel}>{cat}</Text>
            </View>
          ))}
        </View>

        {/* Receitas */}
        <RecipeCard
          title="Molho branco simples"
          category="Massas"
          image="https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb"
          rating={4.0}
        />
        <RecipeCard
          title="Torta Holandesa"
          category="Sobremesas"
          image="https://images.unsplash.com/photo-1551024601-bec78aea704b"
          rating={4.0}
        />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
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
        <TouchableOpacity style={styles.navItem}>
          <Icon name="user" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function RecipeCard({ title, category, image, rating }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4].map((_, i) => (
            <Text key={i} style={styles.starFilled}>★</Text>
          ))}
          <Text style={styles.starEmpty}>★</Text>
          <Text style={styles.ratingText}> {rating.toFixed(1)}</Text>
        </View>
      </View>
      <Image source={{ uri: image }} style={styles.cardImage} />
    </View>
  );
}

function getCategoryImage(category) {
  switch (category) {
    case 'Massas':
      return 'https://i.imgur.com/xVA5ZpB.png';
    case 'Sopas':
      return 'https://i.imgur.com/mZJ0Fgu.png';
    case 'Sobremesas':
      return 'https://i.imgur.com/E1y9Vqo.png';
    case 'Bebidas':
      return 'https://i.imgur.com/d3S0Nbs.png';
    default:
      return '';
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#F9A826',
  },
  helloText: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  searchInputContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    height: '100%',
  },
  searchButton: {
    backgroundColor: '#F9A826',
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  categoryItem: {
    alignItems: 'center'
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#F9A826'
  },
  categoryLabel: {
    fontSize: 16,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F9A826',
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
    paddingRight: 15,
  },
  categoryBadge: {
    backgroundColor: '#F9A826',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  categoryText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  starFilled: {
    fontSize: 24,
    color: '#F9A826',
  },
  starEmpty: {
    fontSize: 24,
    color: '#E0E0E0',
  },
  ratingText: {
    color: '#888',
    fontSize: 24,
  },
  cardImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  fab: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: '#F9A826',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  navItem: {
    alignItems: 'center',
  },
});