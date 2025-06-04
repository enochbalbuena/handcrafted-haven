"use client"

import styles from "./login.module.css"
import Header from "../ui/header"
import Button from "../ui/button"
import React from "react"
import Link from "next/link"



export default function LoginPage(){
  async function handleSubmit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();

    const formdata = new FormData(e.currentTarget);
    const username = formdata.get("username");
    const password = formdata.get("password");

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({username, password}),
    });

    const data = await response.json();

    if(!response.ok){
      alert(data.error)
      return;
    }

    window.location.href = "/"

  }
  return(
    <div>
      <Header/>
      <main className={styles.main}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.topdiv}>
            <h1 className={styles.h1}>Login</h1>
          </div>
          <div className={styles.div1}>
            <div className={styles.div3}>
              <label className={styles.label} htmlFor="username">Username: </label>
              <input className={styles.input} type="text" name="username" id="username" placeholder="Enter Username" required/>
            </div>
            <div className={styles.div4}>
              <label className={styles.label} htmlFor="password">Password: </label>
              <input className={styles.input} type="password" name="password" id="password" placeholder="Enter Password" required />
            </div>
          </div>
          <div className={styles.div5}>
            <Button type="submit">
              Login
            </Button> 
            <Link className={styles.link} href={"/signup"}>
              <Button type="button">
                Sign up
              </Button>
            </Link>
          </div> 
        </form>
      </main>
    </div>
  )
}