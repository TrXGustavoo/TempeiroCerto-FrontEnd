import React from 'react';
import { View, KeyboardAvoidingView, TextInput, TouchableOpacity, Text, StyleSheet }from 'react-native';

export default function LoginScreen({ navigation }) {
    return (
        <KeyboardAvoidingView style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.title}>Login</Text>
                <TextInput style={styles.input}
                    placeholder="Email"
                    autoCorrect={false}
                    onChangeText={()=> {}}
                />

                <TextInput style={styles.input}
                    placeholder="Senha"
                    autoCorrect={false}
                    onChangeText={()=> {}}
                />

                <TouchableOpacity style={styles.btnSubmit} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.submitText}>LOGIN</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnRegister} onPress={() => navigation.navigate('Cadastro')}>
                    <Text style={styles.registerText}>Don't have an account? Sign Up</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    background:{
        flex:1, /* Pega a tela toda */
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        padding: 20
    },
    title:{
        fontSize: 30,
        color: 'rgb(0, 0, 0)',
        //marginTop: 200,
        marginBottom: 30
    },
    container:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        paddingBottom: 100,
    },
    input:{
        backgroundColor: '#FFF',
        width: '90%',
        marginBottom: 15,
        color: '#F29F05',
        fontSize: 17,
        padding: 10,
    },
    btnSubmit:{
        backgroundColor: '#F29F05',
        width: '90%',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
    },
    submitText:{
        color: 'rgb(0, 0, 0)',
        fontSize: 18
    },
    btnRegister:{
        marginTop: 10,
    },
    registerText:{
        color: '#F29F05'
    }
});