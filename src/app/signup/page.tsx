"use client"

import styles from "./signup.module.css"
import Header from "../ui/header"
import Button from "../ui/button"
import React from "react"





export default function SignUpPage(){

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email")
    const username = formData.get("username");
    const password = formData.get("password");

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {"Content-Type": "application/json" },
      body: JSON.stringify({name,email,username,password}),
    });

    const data = await response.json();

    if(!response.ok){
      alert(data.error);
      return;
    }

    window.location.href = "/login";

  }
  return(
    <div>
      <Header/>
      <main className={styles.main}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.topdiv}>
            <h1 className={styles.h1}>Sign Up</h1>
          </div>
          <div className={styles.div1}>
            <div className={styles.div2}>
              <label className={styles.label} htmlFor="name">Name: </label>
              <input className={styles.input} type="text" name="name" id="name" placeholder="Enter Name" required/>
            </div>
            <div className={styles.divemail}>
              <label className={styles.label} htmlFor="email">Email: </label>
              <input className={styles.input} type="email" name="email" id="email" placeholder="Enter Email" required/>
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
          <div className={styles.div5}>
            <Button type="submit">
              Sign Up
            </Button> 
          </div> 
        </form>
      </main>
    </div>
  )
}