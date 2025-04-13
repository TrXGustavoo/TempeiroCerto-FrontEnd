import React, { useState } from 'react';
import { View, KeyboardAvoidingView, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Home = ({ navigation }) => {
    return (
        <KeyboardAvoidingView style={styles.background}>
            <View style={styles.container}>
                <View style={styles.navbar}>
                    <Text style={styles.title}>Hello admin!</Text>
                </View>
                {/* Conteúdo principal da tela */}
                <View style={styles.content}>
                    <Text style={styles.text}>Conteúdo da Tela</Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.btnNovaReceita} onPress={() => navigation.navigate('NovaReceita')}>
                        <Text style={styles.footerText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    background:{
        flex: 1, // Pega a tela toda
        backgroundColor: '#FFF',
    },
    container: {
        flex: 1,
        justifyContent: 'space-between', // Empurra o footer para o final
      },
      title:{
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        padding: 20
    },
      content: {
        flex: 1, // Faz o conteúdo ocupar o espaço restante
        justifyContent: 'center',
        alignItems: 'center',
      },
      text: {
        fontSize: 18,
      },
      footer: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 0.5,
      },
      footerText: {
        color: '#FFF',
        fontSize: 16,
      },
      btnNovaReceita:{
        backgroundColor: '#F29F05',
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        marginBottom: 60,
    },
});

export default Home;
