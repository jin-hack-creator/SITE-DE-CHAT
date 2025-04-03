import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, ScrollView } from 'react-native';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('chat message', message);
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>BLUEVISION</Text>
      <ScrollView style={styles.messages}>
        {messages.map((msg, index) => (
          <Text key={index} style={styles.message}>{msg}</Text>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Écrivez votre message..."
        />
        <Button title="Envoyer" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  messages: {
    flex: 1,
    marginBottom: 10,
  },
  message: {
    padding: 10,
    backgroundColor: '#e1e1e1',
    borderRadius: 5,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});