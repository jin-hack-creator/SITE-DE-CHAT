"use client";
import styles from "./page.module.css";
import Message from "./components/message";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const myPseudo = "kingjr7";
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000/ws");

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      setMessages([...data]);
    };
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/get-messages")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMessages([...data]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Nettoyage à la destruction du composant
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);
  const sendMessage = () => {
    fetch("http://localhost:3000/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        pseudo: myPseudo,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMessages([...data]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Bienvenue sur BLUEVISION</h1>
        <p>Discutez anonymement avec d'autres utilisateurs en temps réel.</p>
      </header>

      <main className={styles.main}>
        <section className={styles.chat}>
          <div className={styles.messages}>
            {messages.map((message) => (
              <Message
                key={message.id}
                text={message.content}
                sender={message.pseudo}
                isMy={message.pseudo === myPseudo}
              />
            ))}
          </div>
          <div className={styles.message_input}>
            <input
              type="text"
              className={styles.message}
              placeholder="Écrivez votre message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                  setMessage("");
                }
              }}
            />
            <button className={styles.send} onClick={sendMessage}>
              Envoyer
            </button>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 BLUEVISION. Tous droits réservés.</p>
        <p>Créateurs : Emmanuel Sasaki & Emmanuel Kingjr7</p>
        <p>
          Contact :{" "}
          <a href="mailto:sasaki-compagnie@gmail.com">team Emmanuel</a>
        </p>
      </footer>
    </div>
  );
}
