"use client";
import { useState } from "react";
import styles from "./login.module.css";
import { useRouter } from 'next/navigation'

export default function Login() {
    const [email, setEmail] = useState("");
    const [pseudo, setPseudo] = useState("");

    const router = useRouter()

    const login = async (e) => {
        e.preventDefault();

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // ajoute ça si tu veux que le cookie soit stocké côté navigateur !
            body: JSON.stringify({
              email: email,
              pseudo: pseudo,
            }),
          })
            .then(async (response) => {
              const data = await response.json(); // ✅ On lit UNE SEULE FOIS
              console.log("Réponse JSON :", data);
          
              if (!response.ok) {
                  alert("Erreur lors de la connexion : ");
                throw new Error(data?.message || "Erreur lors de la connexion");
              }
          
              return data;
            })
            .then((data) => {
              console.log("Connexion réussie, data :", data);
              localStorage.setItem("pseudo", data[0].pseudo);
              localStorage.setItem("email", data[0].email);
              router.push("/");
            })
            .catch((error) => {
              console.error("Erreur lors du fetch :", error.message);
              alert("compte non valide")
            });
          
    }
 
    return (
        <div className={styles.body}>
            <div className={styles.login_container}>
                <div className={styles.login_card}>
                    <div className={styles.card_header}>
                        <div className={styles.logo_container}>
                            <i className="fas fa-comment-dots logo-icon"></i>
                            <h1>BLUEVISION</h1>
                        </div>
                        <p className={styles.subtitle}>Discussion sécurisée multi-appareils</p>
                    </div>
                    
                    <form id="login-form" className={styles.card_body} onSubmit={login}>
                        <div className={styles.input_group}>
                            <label htmlFor="email"><i className="fas fa-envelope"></i> Email</label>
                            <input type="email" id="email" placeholder="votre@email.com" required 
                                   autoCapitalize="off" autoComplete="email" inputMode="email" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
                        </div>
                        
                        <div className={styles.input_group}>
                            <label htmlFor="username"><i className="fas fa-user-secret"></i> Pseudonyme</label>
                            <input type="text" id="username" placeholder="Choisissez un pseudo" required
                                   autoCapitalize="none" autoComplete="username" minLength={3} value={pseudo} onChange={(e) => {setPseudo(e.target.value)}} />
                        </div>
                        
                        <button type="submit" className={styles.login_btn} id="login-btn">
                            <i className="fas fa-sign-in-alt"></i> <span className={styles.btn_text}>Se connecter</span>
                        </button>
                    </form>
                    
                    <div className={styles.card_footer}>
                        <p className={styles.compatibility_text}>
                            <i className="fas fa-mobile-alt"></i>
                            <i className="fas fa-tablet-alt"></i>
                            <i className="fas fa-laptop"></i>
                            Compatible avec tous vos appareils
                        </p>
                        <p className={styles.legal_text}>En continuant, vous acceptez nos CGU</p>
                    </div>
                </div>
            </div>
        </div>
    )
}