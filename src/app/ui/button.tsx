import React from "react";
import styles from "../page.module.css"


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export default function Button({children, ...rest}: ButtonProps){
    return(
        <button className={styles.reusablebutton} {...rest}>
            {children}
        </button>
    )
}