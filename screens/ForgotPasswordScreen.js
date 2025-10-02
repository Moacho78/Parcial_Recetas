// ForgotPasswordScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState('');

    // Validación de email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('El correo electrónico es obligatorio');
            return false;
        } else if (!emailRegex.test(email)) {
            setEmailError('Introduce un correo electrónico válido');
            return false;
        }
        setEmailError('');
        return true;
    };

    const handleResetPassword = () => {
        if (!validateEmail(email)) return;

        setIsLoading(true);
        const auth = getAuth();

        sendPasswordResetEmail(auth, email)
            .then(() => {
                // Password reset email sent!
                Alert.alert(
                    'Correo enviado',
                    'Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico',
                    [{ text: 'OK', onPress: () => navigation.navigate('GastroGo') }]
                );
            })
            .catch((error) => {
                const errorMessage = error.message;
                Alert.alert('Error', errorMessage);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recuperar Contraseña</Text>
            <Text style={styles.subtitle}>
                Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
            </Text>

            <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                placeholder="Email"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) validateEmail(text);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <TouchableOpacity
                style={[styles.button, isLoading ? styles.buttonDisabled : null]}
                onPress={handleResetPassword}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.buttonText}>Enviar correo</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Volver a Iniciar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#f9fafb',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
        color: '#ff6347',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
        color: '#64748b',
    },
    input: {
        height: 50,
        borderColor: '#d1d5db',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: 'white',
    },
    inputError: {
        borderColor: '#ef4444',
    },
    errorText: {
        color: '#ef4444',
        marginBottom: 8,
        fontSize: 12,
        marginLeft: 4,
    },
    button: {
        backgroundColor: '#ff6347',
        padding: 14,
        borderRadius: 8,
        marginTop: 8,
    },
    buttonDisabled: {
        backgroundColor: '#93c5fd',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
    linkText: {
        color: '#ff6347',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14,
    },
});
