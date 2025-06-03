import styles from "./signup.module.css"
import Header from "../ui/header"





export default function SignUpPage(){
  return(
    <div>
      <Header/>
      <main className={styles.main}>
        <form className={styles.form}>
          <div className={styles.topdiv}>
            <h1 className={styles.h1}>Sign Up</h1>
          </div>
          <div className={styles.div1}>
            <div className={styles.div2}>
              <label className={styles.label} htmlFor="name">Name: </label>
              <input className={styles.input} type="text" name="name" id="name" placeholder="Enter Name" required/>
            </div>
            <div className={styles.div3}>
              <label className={styles.label} htmlFor="username">Username: </label>
              <input className={styles.input} type="text" name="username" id="username" placeholder="Enter Username" required/>
            </div>
            <div className={styles.div4}>
              <label className={styles.label} htmlFor="password">Password: </label>
              <input className={styles.input} type="password" name="password" id="password" placeholder="Enter Password" required />
            </div>
          </div>
          
        </form>
      </main>
    </div>
  )
}