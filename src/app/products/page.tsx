'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/database';
import Header from '@/app/ui/header';
import styles from './products.module.css';
import AddToCartButton from '../ui/addToCart';

type Listing = {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  category: string;
  seller_id: string;
  images: string[];
};

const categories = [
  { id: 'all', name: 'All Categories', value: '' },
  { id: 'pottery', name: 'Pottery & Ceramics', value: 'Pottery & Ceramics' },
  { id: 'jewelry', name: 'Jewelry & Accessories', value: 'Jewelry & Accessories' },
  { id: 'textiles', name: 'Textiles & Fiber', value: 'Textiles & Fiber' },
  { id: 'wood', name: 'Wood & Furniture', value: 'Wood & Furniture' }
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Listing[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Listing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 });
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [sellers, setSellers] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      const { data: listings, error: listingError } = await supabase
        .from('listing')
        .select('*')
        .order('created_at', { ascending: false });

      if (listingError) {
        console.error('Error fetching listings:', listingError.message);
        return;
      }

      const { data: sellerData, error: sellerError } = await supabase
        .from('sellers')
        .select('id, name');

      if (sellerError) {
        console.error('Error fetching sellers:', sellerError.message);
        return;
      }

      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('item_id, rating');

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError.message);
        return;
      }

      const reviewMap: Record<string, number[]> = {};
      (reviewsData || []).forEach((r) => {
        if (!reviewMap[r.item_id]) reviewMap[r.item_id] = [];
        reviewMap[r.item_id].push(r.rating);
      });

      const listingsWithRatings = (listings || []).map((listing) => {
        const ratings = reviewMap[listing.id] || [];
        const avg = ratings.length
          ? Math.round(ratings.reduce((sum, r) => sum + r, 0) / ratings.length)
          : 0;
        return {
          ...listing,
          rating: avg,
          reviewCount: ratings.length
        };
      });

      const sellerMap = (sellerData || []).reduce((acc, seller) => {
        acc[seller.id] = seller.name;
        return acc;
      }, {} as Record<string, string>);

      setSellers(sellerMap);
      setProducts(listingsWithRatings);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sellers[product.seller_id]?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    filtered = filtered.filter(
      product => product.price >= priceRange.min && product.price <= priceRange.max
    );

    if (minRating > 0) {
      filtered = filtered.filter(product => product.rating >= minRating);
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.reverse();
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange, minRating, sortBy, sellers]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: 0, max: 200 });
    setMinRating(0);
    setSortBy('featured');
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div>
      <Header />
      <div className={styles.productsContainer}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Handcrafted Products</h1>
          <p className={styles.pageSubtitle}>
            Discover unique, handmade treasures from talented artisans
          </p>
        </div>

        <div className={styles.searchSortBar}>
          <div className={styles.searchBox}>
            <input
              type="search"
              placeholder="Search products or artisans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>

          <div className={styles.sortBox}>
            <label htmlFor="sort">Sort by:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className={styles.mainContent}>
          <aside className={styles.filtersSidebar}>
            <div className={styles.filtersHeader}>
              <h2>Filters</h2>
              <button onClick={handleResetFilters} className={styles.resetButton}>
                Reset All
              </button>
            </div>

            <div className={styles.filterGroup}>
              <h3>Category</h3>
              <div className={styles.categoryList}>
                {categories.map(category => (
                  <label key={category.id} className={styles.categoryItem}>
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={selectedCategory === category.value}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <h3>Price Range</h3>
              <div className={styles.priceInputs}>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  className={styles.priceInput}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  className={styles.priceInput}
                />
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                className={styles.priceSlider}
              />
              <div className={styles.priceLabels}>
                <span>$0</span>
                <span>$200+</span>
              </div>
            </div>

            <div className={styles.filterGroup}>
              <h3>Minimum Rating</h3>
              <div className={styles.ratingOptions}>
                {[0, 3, 4, 5].map(rating => (
                  <label key={rating} className={styles.ratingItem}>
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={minRating === rating}
                      onChange={(e) => setMinRating(Number(e.target.value))}
                    />
                    <span>
                      {rating === 0 ? 'All' : `${renderStars(rating)} & up`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div className={styles.productsSection}>
            <div className={styles.resultsInfo}>
              <p>Showing {filteredProducts.length} of {products.length} products</p>
            </div>

            <div className={styles.productsGrid}>
              {filteredProducts.map(product => (
                <div key={product.id} className={styles.productCard}>
                  <Link href={`/products/${product.id}`}>
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className={styles.productImage}
                      />
                    ) : null}
                  </Link>
                  <div className={styles.productInfo}>
                    <Link href={`/products/${product.id}`}>
                      <h3 className={styles.productName}>{product.title}</h3>
                    </Link>
                    <p className={styles.artistName}>by {sellers[product.seller_id] || 'Unknown artisan'}</p>
                    <div className={styles.productMeta}>
                      <span className={styles.rating}>
                        {renderStars(product.rating)} ({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                    <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                    <AddToCartButton product={product}/>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className={styles.noResults}>
                <p>No products found matching your criteria.</p>
                <button onClick={handleResetFilters} className={styles.resetButtonLarge}>
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
