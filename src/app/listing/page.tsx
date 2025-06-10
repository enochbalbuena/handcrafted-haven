"use client";

import Header from "../ui/header";
import styles from "./listing.module.css";
import Button from "../ui/button";

export default function listing() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formdata = new FormData(e.currentTarget);

    const response = await fetch("/api/listing", {
      method: "POST",
      body: formdata,
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error);
      return;
    }
  }

  return (
    <div>
      <Header />
      <main className={styles.main}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.topdiv}>
            <h1 className={styles.h1}>Create a Listing</h1>
          </div>
          <div className={styles.div1}>
            <div className={styles.div2}>
              <label className={styles.label} htmlFor="Image">
                Image:{" "}
              </label>
              <input
                className={styles.input}
                type="file"
                id="image"
                name="image"
                accept="image/*"
                required
              />
            </div>
            <div className={styles.div3}>
              <label className={styles.label} htmlFor="description">
                Description:{" "}
              </label>
              <textarea
                className={styles.input}
                name="description"
                id="description"
                required
                style={{ width: "100%", resize: "vertical" }}
              />
            </div>
            <div className={styles.div4}>
              <label className={styles.label} htmlFor="price">
                Price:{" "}
              </label>
              <input
                className={styles.input}
                type="number"
                id="price"
                name="price"
                required
              />
            </div>
            <div className={styles.div5}>
              <Button type="submit">Submit</Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
