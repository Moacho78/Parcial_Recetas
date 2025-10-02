// RegisterScreen.js
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Estados para errores de validación
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    // Validación del nombre
    const validateName = (name) => {
        if (!name.trim()) {
            setNameError('El nombre es obligatorio');
            return false;
        }
        setNameError('');
        return true;
    };

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

    // Validación de contraseña
    const validatePassword = (password) => {
        if (!password) {
            setPasswordError('La contraseña es obligatoria');
            return false;
        } else if (password.length < 6) {
            setPasswordError('La contraseña debe tener al menos 6 caracteres');
            return false;
        }
        setPasswordError('');
        return true;
    };

    // Validación de confirmación de contraseña
    const validateConfirmPassword = (confirmPassword) => {
        if (!confirmPassword) {
            setConfirmPasswordError('Por favor confirma tu contraseña');
            return false;
        } else if (confirmPassword !== password) {
            setConfirmPasswordError('Las contraseñas no coinciden');
            return false;
        }
        setConfirmPasswordError('');
        return true;
    };

    const handleRegister = () => {
        // Validar todos los campos
        const isNameValid = validateName(name);
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);
        const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

        if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
            return;
        }

        setIsLoading(true);
        const auth = getAuth();

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;

                // Actualizar el perfil del usuario con el nombre
                return updateProfile(user, {
                    displayName: name
                }).then(() => {
                    Alert.alert(
                        'Registro Exitoso',
                        '¡Tu cuenta ha sido creada correctamente!',
                        [{ text: 'OK', onPress: () => navigation.replace('Home') }]
                    );
                });
            })
            .catch((error) => {
                // Traducción de errores comunes de Firebase para una mejor UX
                let errorMessage;
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = 'Este correo electrónico ya está en uso';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'El formato del correo electrónico no es válido';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'La contraseña es demasiado débil';
                        break;
                    default:
                        errorMessage = error.message;
                }
                Alert.alert('Error', errorMessage);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.innerContainer}>
                    <Text style={styles.title}>Crear Cuenta</Text>

                    <TextInput
                        style={[styles.input, nameError ? styles.inputError : null]}
                        placeholder="Nombre completo"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            if (nameError) validateName(text);
                        }}
                    />
                    {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

                    <TextInput
                        style={[styles.input, emailError ? styles.inputError : null]}
                        placeholder="Email"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text.trim());
                            if (emailError) validateEmail(text);
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                    <TextInput
                        style={[styles.input, passwordError ? styles.inputError : null]}
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            if (passwordError) validatePassword(text);
                            if (confirmPassword && confirmPasswordError) {
                                validateConfirmPassword(confirmPassword);
                            }
                        }}
                        secureTextEntry
                    />
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                    <TextInput
                        style={[styles.input, confirmPasswordError ? styles.inputError : null]}
                        placeholder="Confirmar contraseña"
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text);
                            if (confirmPasswordError) validateConfirmPassword(text);
                        }}
                        secureTextEntry
                    />
                    {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

                    <TouchableOpacity
                        style={[styles.button, isLoading ? styles.buttonDisabled : null]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Registrarse</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('GastroGo')}>
                            <Text style={styles.loginLink}>Iniciar sesión</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#333',
    },
    input: {
        height: 50,
        borderColor: '#eaa9a9ff',
        borderWidth: 1,
        marginBottom: 14,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: 'white',
    },
    inputError: {
        borderColor: '#ef4444',
        marginBottom: 4,
    },
    errorText: {
        color: '#ef4444',
        marginBottom: 10,
        fontSize: 12,
        marginLeft: 4,
    },
    button: {
        backgroundColor: '#ff6347',
        padding: 14,
        borderRadius: 8,
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#eaa9a9ff',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    loginText: {
        fontSize: 14,
        color: '#eaa9a9ff',
    },
    loginLink: {
        fontSize: 14,
        color: '#ff6347',
        fontWeight: '600',
    },
});