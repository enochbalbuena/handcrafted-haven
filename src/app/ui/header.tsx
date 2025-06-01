import Image from "next/image";
import Link from "next/link";
import styles from "../page.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Image
        className={styles.image}
        src="/handcrafted.png"
        alt="Logo"
        width={150}
        height={150}
      />
      <Link className={styles.link} href="/login">
        <button className={styles.button}>Login</button>
      </Link>
    </header>
  );
}
