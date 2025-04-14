import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, KeyboardAvoidingView, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const NovaReceita = ({ navigation }) => {
    const [name, setName] = useState('');
    const [preparationTime, setPreparationTime] = useState('');
    const [portions, setPortions] = useState(0);
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
                <Text style={styles.label}>Imagem</Text>
                <TouchableOpacity style={styles.imageButton}>
                    <Text style={styles.imageButtonText}>Upload da Imagem</Text>
                </TouchableOpacity>
                {/* Campo Nome da Receita */}
                <Text style={styles.label}>Nome da Receita</Text>
                <TextInput
                    style={styles.input}
                    // placeholder='Nome da Receita'
                    value={name}
                    onChangeText={setName}
                />
                {/* Campo Tempo de Preparo */}
                <Text style={styles.label}>Tempo de Preparo</Text>
                <TextInput
                    style={styles.input}
                    // placeholder='Tempo de Preparo'
                    value={preparationTime}
                    onChangeText={setPreparationTime}
                    keyboardType="numeric"
                />
                {/* Campo Porções */}
                <View style={styles.row}>
                    <Text style={styles.label}>Porções</Text>
                    <TextInput
                        style={styles.portionInput}
                        value={String(portions)}
                        onChangeText={(value) => setPortions(Number(value))}
                        keyboardType="numeric"
                    />
                </View>
                {/* Dropdown Nível de Dificuldade */}
                <View style={styles.row}>
                    <Text style={styles.label}>Nível</Text>
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
                <Text style={styles.label}>Ingredientes</Text>
                <TextInput
                    style={styles.input}
                    // placeholder="Ingredientes"
                    value={ingredients}
                    onChangeText={setIngredients}
                    multiline
                />

                {/* Campo Descrição */}
                <Text style={styles.label}>Descreva sua receita...</Text>
                <TextInput
                    style={styles.textArea}
                    // placeholder="Descreva sua receita..."
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
    },
    title:{
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 20
    },
    container:{
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'center'
    },
    imageButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
      },
    imageButtonText: {
        color: '#ccc',
        fontSize: 12,
    },
    input:{
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        width: 300,
        height: 50,
        marginBottom: 15
    },
    textArea: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        height: 50,
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginRight: 10,
        marginBottom: 5,
    },
    portionInput: {
        width: 50,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 5,
        textAlign: 'center',
    },
    picker: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    saveButton: {
        backgroundColor: '#F29F05',
        padding: 15,
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 50,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default NovaReceita;
