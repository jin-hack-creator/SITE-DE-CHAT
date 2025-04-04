import styles from "./message.module.css";

export default function Message({text, sender, isMy}){
    return (
        isMy ? (
            <div className={styles.my_message}>
            <p>{text}</p>
        </div>
        ) : (
            <div className={styles.message}>
            <p className={styles.pseudo}>{sender}</p>
            <p>{text}</p>
        </div>
        )
    )
}