import Header from "./ui/header";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Discover Unique <span className={styles.highlight}>Handcrafted</span> Treasures
            </h1>
            <p className={styles.heroSubtitle}>
              Connect with talented artisans and find one-of-a-kind handmade items that tell a story.
              Support creators and bring authentic craftsmanship into your life.
            </p>
            <div className={styles.heroButtons}>
              <button className={`${styles.reusablebutton} ${styles.primaryButton}`}>
                Shop Now
              </button>
              <button className={`${styles.reusablebutton} ${styles.secondaryButton}`}>
                Become a Seller
              </button>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img
              src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Artisan crafting pottery"
              className={styles.heroImg}
            />
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className={styles.categories}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Shop by Category</h2>
          <div className={styles.categoryGrid}>
            <div className={styles.categoryCard}>
              <img
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Handmade pottery"
                className={styles.categoryImage}
              />
              <h3>Pottery & Ceramics</h3>
              <p>Beautiful handthrown pieces</p>
            </div>
            <div className={styles.categoryCard}>
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Handmade jewelry"
                className={styles.categoryImage}
              />
              <h3>Jewelry & Accessories</h3>
              <p>Unique designs and materials</p>
            </div>
            <div className={styles.categoryCard}>
              <img
                src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Handwoven textiles"
                className={styles.categoryImage}
              />
              <h3>Textiles & Fiber</h3>
              <p>Woven treasures and soft goods</p>
            </div>
            <div className={styles.categoryCard}>
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Wooden crafts"
                className={styles.categoryImage}
              />
              <h3>Wood & Furniture</h3>
              <p>Handcrafted wooden items</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>How Handcrafted Haven Works</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Discover</h3>
              <p>Browse unique handcrafted items from talented artisans around the world</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Connect</h3>
              <p>Read artisan stories, view their profiles, and learn about their craft</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Purchase</h3>
              <p>Buy directly from creators and support independent artisans</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h3>Enjoy</h3>
              <p>Receive your one-of-a-kind treasure and share your experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.featuredProducts}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Featured Products</h2>
          <div className={styles.productGrid}>
            <div className={styles.productCard}>
              <img
                src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Ceramic vase"
                className={styles.productImage}
              />
              <div className={styles.productInfo}>
                <h4>Handthrown Ceramic Vase</h4>
                <p className={styles.artistName}>by Sarah&apos;s Pottery</p>
                <div className={styles.rating}>★★★★★ (12 reviews)</div>
                <p className={styles.price}>$45.00</p>
              </div>
            </div>
            <div className={styles.productCard}>
              <img
                src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Silver pendant"
                className={styles.productImage}
              />
              <div className={styles.productInfo}>
                <h4>Sterling Silver Moon Pendant</h4>
                <p className={styles.artistName}>by Luna Designs</p>
                <div className={styles.rating}>★★★★★ (8 reviews)</div>
                <p className={styles.price}>$78.00</p>
              </div>
            </div>
            <div className={styles.productCard}>
              <img
                src="https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Woven basket"
                className={styles.productImage}
              />
              <div className={styles.productInfo}>
                <h4>Handwoven Storage Basket</h4>
                <p className={styles.artistName}>by Meadow Crafts</p>
                <div className={styles.rating}>★★★★☆ (15 reviews)</div>
                <p className={styles.price}>$32.00</p>
              </div>
            </div>
          </div>
          <div className={styles.centerButton}>
            <button className={`${styles.reusablebutton} ${styles.primaryButton}`}>
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className={styles.community}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Join Our Community</h2>
          <div className={styles.communityContent}>
            <div className={styles.testimonials}>
              <div className={styles.testimonial}>
                <p>&quot;I love supporting independent artisans and finding unique pieces that you can&apos;t get anywhere else. The quality is amazing!&quot;</p>
                <cite>- Emma K., Happy Customer</cite>
              </div>
              <div className={styles.testimonial}>
                <p>&quot;As a potter, Handcrafted Haven has helped me reach customers I never would have found. The community is so supportive!&quot;</p>
                <cite>- Marcus T., Artisan</cite>
              </div>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>2,500+</span>
                <span className={styles.statLabel}>Active Artisans</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>15,000+</span>
                <span className={styles.statLabel}>Happy Customers</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>50,000+</span>
                <span className={styles.statLabel}>Products Sold</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Ready to Start Your Journey?</h2>
            <p>Whether you&apos;re looking for unique handcrafted items or ready to share your creations with the world, Handcrafted Haven is here for you.</p>
            <div className={styles.ctaButtons}>
              <button className={`${styles.reusablebutton} ${styles.primaryButton}`}>
                Start Shopping
              </button>
              <button className={`${styles.reusablebutton} ${styles.secondaryButton}`}>
                Sell Your Crafts
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
