import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { initializeApp } from '@firebase/app';
import Finish from "./src/screens/Finish/Finish";
import Quiz from "./src/screens/Quiz/Quiz";
import Starter from "./src/screens/Starter/Starter";
import palette from "./src/styles/colours";
import { QuizProvider } from "./src/context/QuizContext";
import { useFonts, Blaka_400Regular } from "@expo-google-fonts/dev";
import { ActivityIndicator } from "react-native";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
const Stack = createNativeStackNavigator();

const firebaseConfig = {
  apiKey: "AIzaSyAlqJjgYhmCjmIc9jWq7tw1HFD5SFQ0oNA",
  authDomain: "quiz-75694.firebaseapp.com",
  projectId: "quiz-75694",
  storageBucket: "quiz-75694.appspot.com",
  messagingSenderId: "439650363579",
  appId: "1:439650363579:web:e57df5467fbb69f6e9a19e",
  measurementId: "G-M7DGC6DT5C"
};

const app = initializeApp(firebaseConfig);

const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
       <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>

       <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title={isLogin ? 'Sign In' : 'Sign Up'} onPress={handleAuthentication} color="#3498db" />
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
        </Text>
      </View>
    </View>
  );
}

import { useNavigation } from '@react-navigation/native';
const AuthenticatedScreen = ({ user, handleAuthentication }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.emailText}>{user.email}</Text>
      <Button title='mulai' onPress={navigation.navigate('Starter')} />
      <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
    </View>
  );
};
const LoginKang = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); // Track user authentication state
  const [isLogin, setIsLogin] = useState(true);

  const auth = getAuth(app);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  
  const handleAuthentication = async () => {
    try {
      if (user) {
        // If user is already authenticated, log out
        console.log('User logged out successfully!');
        await signOut(auth);
      } else {
        // Sign in or sign up
        if (isLogin) {
          // Sign in
          await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in successfully!');
        } else {
          // Sign up
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('User created successfully!');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };
  return(
    <ScrollView contentContainerStyle={styles.container}>
    {user ? (
      // Show user's email if user is authenticated
      <AuthenticatedScreen user={user} handleAuthentication={handleAuthentication} />
    ) : (
      // Show sign-in or sign-up form if user is not authenticated
      <AuthScreen
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        handleAuthentication={handleAuthentication}
      />

    )}
  </ScrollView>
  );
}
export default App = () => {
  let [fontsLoaded] = useFonts({
		Blaka_400Regular,
	});

  return (
    <QuizProvider>
      <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
        				name="auth"
                component={LoginKang}
                options={{
                  headerShown: false,
                }}
        />
      			<Stack.Screen
				name="Starter"
				component={Starter}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Quiz"
				component={Quiz}
				options={{
					headerStyle: {
						backgroundColor: palette.primary,
					},
					headerTintColor: palette.offWhite,
				}}
			/>
			<Stack.Screen
				name="Finish"
				component={Finish}
				options={{
					headerShown: false,
					headerStyle: {
						backgroundColor: palette.primary,
					},
					headerTintColor: palette.offWhite,
				}}
			/>
    </Stack.Navigator>
    </NavigationContainer>
    </QuizProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
  },
  bottomContainer: {
    marginTop: 20,
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});