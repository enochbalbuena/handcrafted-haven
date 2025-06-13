import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import styles from "./page.module.css";

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Handcrafted Haven - Marketplace for Handmade Treasures",
  description: "Discover unique handcrafted items from talented artisans. Shop pottery, jewelry, textiles, and more. Support local creators and find one-of-a-kind treasures.",
  keywords: "handmade, artisan, crafts, marketplace, pottery, jewelry, textiles, handcrafted",
  openGraph: {
    title: "Handcrafted Haven - Marketplace for Handmade Treasures",
    description: "Discover unique handcrafted items from talented artisans. Shop pottery, jewelry, textiles, and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={nunito.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#890620" />
      </head>
      <body>{children}

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.container}>
            <div className={styles.footerContent}>
              <div className={styles.footerSection}>
                <h3>Handcrafted Haven</h3>
                <p>Connecting artisans with those who appreciate handmade quality.</p>
              </div>
              <div className={styles.footerSection}>
                <h4>Shop</h4>
                <ul>
                  <li><a href="#">All Products</a></li>
                  <li><a href="#">Categories</a></li>
                  <li><a href="#">Featured</a></li>
                  <li><a href="#">New Arrivals</a></li>
                </ul>
              </div>
              <div className={styles.footerSection}>
                <h4>Sell</h4>
                <ul>
                  <li><a href="#">Start Selling</a></li>
                  <li><a href="#">Seller Resources</a></li>
                  <li><a href="#">Success Stories</a></li>
                  <li><a href="#">Help Center</a></li>
                </ul>
              </div>
              <div className={styles.footerSection}>
                <h4>Community</h4>
                <ul>
                  <li><a href="#">About Us</a></li>
                  <li><a href="#">Blog</a></li>
                  <li><a href="#">Contact</a></li>
                  <li><a href="#">Terms & Privacy</a></li>
                </ul>
              </div>
            </div>
            <div className={styles.footerBottom}>
              <p>&copy; 2025 Handcrafted Haven. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>

    </html>
  );
}