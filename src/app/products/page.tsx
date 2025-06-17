'use client';

import { useState, useEffect } from 'react';
import Header from '@/app/ui/header';
import styles from './products.module.css';
import AddToCartButton from '../ui/addToCart';

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: 'Handthrown Ceramic Vase',
    artist: 'Sarah\'s Pottery',
    category: 'pottery',
    price: 45.00,
    rating: 5,
    reviews: 12,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    name: 'Sterling Silver Moon Pendant',
    artist: 'Luna Designs',
    category: 'jewelry',
    price: 78.00,
    rating: 5,
    reviews: 8,
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    name: 'Handwoven Storage Basket',
    artist: 'Meadow Crafts',
    category: 'textiles',
    price: 32.00,
    rating: 4,
    reviews: 15,
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 4,
    name: 'Oak Cutting Board',
    artist: 'Timber Works',
    category: 'wood',
    price: 58.00,
    rating: 5,
    reviews: 20,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 5,
    name: 'Glazed Pottery Bowl Set',
    artist: 'Clay Studio',
    category: 'pottery',
    price: 95.00,
    rating: 4,
    reviews: 6,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 6,
    name: 'Handcrafted Silver Ring',
    artist: 'Silver Smithy',
    category: 'jewelry',
    price: 125.00,
    rating: 5,
    reviews: 18,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 7,
    name: 'Woven Wall Hanging',
    artist: 'Textile Dreams',
    category: 'textiles',
    price: 89.00,
    rating: 4,
    reviews: 9,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 8,
    name: 'Walnut Jewelry Box',
    artist: 'Wood Wonders',
    category: 'wood',
    price: 145.00,
    rating: 5,
    reviews: 14,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 9,
    name: 'Ceramic Tea Set',
    artist: 'Zen Pottery',
    category: 'pottery',
    price: 68.00,
    rating: 5,
    reviews: 11,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 10,
    name: 'Beaded Bracelet Collection',
    artist: 'Bead Works',
    category: 'jewelry',
    price: 35.00,
    rating: 4,
    reviews: 22,
    image: 'https://images.unsplash.com/photo-1594835104729-432b4f3c8a0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 11,
    name: 'Knitted Wool Scarf',
    artist: 'Cozy Knits',
    category: 'textiles',
    price: 48.00,
    rating: 5,
    reviews: 16,
    image: 'https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 12,
    name: 'Handcarved Wooden Spoons',
    artist: 'Carve Master',
    category: 'wood',
    price: 28.00,
    rating: 4,
    reviews: 7,
    image: 'https://images.unsplash.com/photo-1550216324-6e8d10e777e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  }
];

const categories = [
  { id: 'all', name: 'All Categories', value: '' },
  { id: 'pottery', name: 'Pottery & Ceramics', value: 'pottery' },
  { id: 'jewelry', name: 'Jewelry & Accessories', value: 'jewelry' },
  { id: 'textiles', name: 'Textiles & Fiber', value: 'textiles' },
  { id: 'wood', name: 'Wood & Furniture', value: 'wood' }
];

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 });
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');

  // Filter and search logic
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.artist.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Price filter
    filtered = filtered.filter(product =>
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(product => product.rating >= minRating);
    }

    // Sorting
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
        // For now, reverse the array to simulate newest first
        filtered.reverse();
        break;
      default:
        // Featured - no specific sorting
        break;
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, priceRange, minRating, sortBy, products]);

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
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Handcrafted Products</h1>
          <p className={styles.pageSubtitle}>
            Discover unique, handmade treasures from talented artisans
          </p>
        </div>

        {/* Search and Sort Bar */}
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
          {/* Filters Sidebar */}
          <aside className={styles.filtersSidebar}>
            <div className={styles.filtersHeader}>
              <h2>Filters</h2>
              <button onClick={handleResetFilters} className={styles.resetButton}>
                Reset All
              </button>
            </div>

            {/* Category Filter */}
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

            {/* Price Range Filter */}
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

            {/* Rating Filter */}
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

          {/* Products Grid */}
          <div className={styles.productsSection}>
            <div className={styles.resultsInfo}>
              <p>Showing {filteredProducts.length} of {products.length} products</p>
            </div>

            <div className={styles.productsGrid}>
              {filteredProducts.map(product => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.productImageWrapper}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={styles.productImage}
                    />
                    <button className={styles.favoriteButton}>❤️</button>
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.artistName}>by {product.artist}</p>
                    <div className={styles.productMeta}>
                      <span className={styles.rating}>
                        {renderStars(product.rating)} ({product.reviews})
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