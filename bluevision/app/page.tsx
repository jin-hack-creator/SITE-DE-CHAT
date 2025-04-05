"use client";
import styles from "./page.module.css";
import Message from "./components/message";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentDots, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { faDesktop, faTabletAlt } from '@fortawesome/free-solid-svg-icons';
import { faAndroid } from '@fortawesome/free-brands-svg-icons';
import { faApple } from '@fortawesome/free-brands-svg-icons';

export default function Home() {
  const myPseudo = localStorage.getItem("pseudo");
  const myEmail = localStorage.getItem("email");
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
    fetch("http://localhost:3000/get-messages", {
      method: "GET",
      credentials: 'include',
    })
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
      credentials: 'include',
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
      <div className={styles.app_container}>
      <header className={styles.app_header}>
        <div className={styles.header_content}>
          <h1><FontAwesomeIcon icon={faCommentDots}/> BLUEVISION</h1>
          <div className={styles.user_info} id="user-info">{myPseudo}({myEmail})</div>
        </div>
      </header>

      <main className={styles.chat_container}>
        <div className={styles.chat_messages} id="messages">
          {messages.map((message, index) => (
            <Message key={index} text={message.content} sender={message.pseudo} isMy={message.pseudo === myPseudo}/>
          ))}
        </div>
        
        <div className={styles.message_input}>
          <input type="text" id="message" placeholder="Écrivez votre message..." autoComplete="off" value={message} onChange={(e) => {setMessage(e.target.value)}}/>
          <button id="send" onClick={sendMessage}><FontAwesomeIcon icon={faPaperPlane}/></button>
        </div>
      </main>

      <footer className={styles.app_footer}>
        <div className={styles.footer_content}>
          <p>© 2025 BLUEVISION - Tous appareils</p>
          <p>Creation de la L'équipe Sasaki</p>
          <div className={styles.device_badges}>
          <FontAwesomeIcon icon={faAndroid} />
          <FontAwesomeIcon icon={faApple} />
          <FontAwesomeIcon icon={faDesktop} />
          <FontAwesomeIcon icon={faTabletAlt} />
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
