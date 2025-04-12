import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, KeyboardAvoidingView, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const NovaReceita = () => {
    const [name, setName] = useState('');
    const [preparationTime, setPreparationTime] = useState('');
    const [portions, setPortions] = useState(1);
    const [difficulty, setDifficulty] = useState('Fácil');
    const [ingredients, setIngredients] = useState('');
    const [description, setDescription] = useState('');

    const handleSave = () => {
        console.log('Nome da Receita:', name);
        console.log('Tempo de Preparo:', preparationTime);
        console.log('Porções:', portions);
        console.log('Nível:', difficulty);
        console.log('Ingredientes:', ingredients);
        console.log('Descrição:', description);
      };

    return (
        <KeyboardAvoidingView style={styles.background}>
            <View style={styles.navbar}>
                <Text style={styles.title}>Nova Receita</Text>
            </View>
            <View style={styles.container}>
                {/* Botão para upload de imagem */}
                <TouchableOpacity style={styles.imageButton}>
                    <Text style={styles.imageButtonText}>Carregar Imagem</Text>
                </TouchableOpacity>
                {/* Campo Nome da Receita */}
                <TextInput
                    style={styles.input}
                    placeholder='Nome da Receita'
                    value={name}
                    onChangeText={setName}
                />
                {/* Campo Tempo de Preparo */}
                <TextInput
                    style={styles.input}
                    placeholder='Tempo de Preparo'
                    value={preparationTime}
                    onChangeText={setPreparationTime}
                    keyboardType="numeric"
                />
                {/* Campo Porções */}
                <View style={styles.row}>
                    <Text style={styles.label}>Porções:</Text>
                    <TextInput
                        style={styles.portionInput}
                        value={String(portions)}
                        onChangeText={(value) => setPortions(Number(value))}
                        keyboardType="numeric"
                    />
                </View>
                {/* Dropdown Nível de Dificuldade */}
                <View style={styles.row}>
                    <Text style={styles.label}>Nível:</Text>
                    <Picker
                    style={styles.picker}
                    selectedValue={difficulty}
                    onValueChange={(value) => setDifficulty(value)}
                    >
                    <Picker.Item label="Fácil" value="Fácil" />
                    <Picker.Item label="Médio" value="Médio" />
                    <Picker.Item label="Difícil" value="Difícil" />
                    </Picker>
                </View>

                {/* Campo Ingredientes */}
                <TextInput
                    style={styles.input}
                    placeholder="Ingredientes"
                    value={ingredients}
                    onChangeText={setIngredients}
                    multiline
                />

                {/* Campo Descrição */}
                <TextInput
                    style={styles.textArea}
                    placeholder="Descreva sua receita..."
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />

                {/* Botão Salvar */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    background:{
        flex:1, /* Pega a tela toda */
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 20
    },
    title:{
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    container:{
        flex: 1,
        padding: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center'
    },
    input:{
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        height: 50,
        marginBottom: 15
    }
});

export default NovaReceita;
