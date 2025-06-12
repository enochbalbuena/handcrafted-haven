'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/database';
import styles from './seller.module.css';
import Image from 'next/image';
import Link from 'next/link';

type SellerProfile = {
  id?: string;
  name: string;
  bio: string;
  location: string;
  profile_image_url?: string;
};

type Listing = {
  id: number;
  title: string;
  image: string;
};

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export default function SellerPage() {
  const [profile, setProfile] = useState<SellerProfile>({ name: '', bio: '', location: '' });
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const decoded = parseJwt(token);
      if (!decoded?.id) return;

      const { data: sellerData } = await supabase
        .from('sellers')
        .select('*')
        .eq('id', decoded.id)
        .single();

      let finalProfile: SellerProfile = {
        id: decoded.id,
        name: '',
        bio: '',
        location: '',
        profile_image_url: ''
      };

      if (sellerData) {
        finalProfile = {
          id: sellerData.id,
          name: sellerData.name || '',
          bio: sellerData.bio || '',
          location: sellerData.location || '',
          profile_image_url: sellerData.profile_image_url || '',
        };
      } else {
        const { data: userData } = await supabase
          .from('users')
          .select('name')
          .eq('id', decoded.id)
          .single();
        finalProfile.name = userData?.name || '';
      }

      setProfile(finalProfile);

      const { data: listingsData } = await supabase
        .from('listing')
        .select('id, title, image')
        .eq('seller_id', decoded.id)
        .order('created_at', { ascending: false });

      setListings(listingsData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewImageFile(file);
  };

  const handleDeleteImage = async () => {
    if (!profile.id) return;
    const { error } = await supabase
      .from('sellers')
      .update({ profile_image_url: null })
      .eq('id', profile.id);

    if (error) {
      console.error(error);
      alert('Error deleting image');
      return;
    }

    setProfile((prev) => ({ ...prev, profile_image_url: '' }));
    alert('Image removed');
  };

  const handleSaveProfile = async () => {
    if (!profile.id) return alert("User not identified.");

    let imageUrl = profile.profile_image_url || '';

    if (newImageFile) {
      const ext = newImageFile.name.split('.').pop();
      const fileName = `profile-${profile.id}-${Date.now()}.${ext}`;

      const uploadResult = await supabase
        .storage
        .from('profile-pictures')
        .upload(fileName, newImageFile);

      if (uploadResult.error) {
        console.error('Upload error:', uploadResult.error);
        alert('Image upload failed: ' + (uploadResult.error.message || 'unknown error'));
        return;
      }

      const { data: publicUrlData } = supabase
        .storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      imageUrl = publicUrlData?.publicUrl || '';
    }

    const { error } = await supabase
      .from('sellers')
      .upsert({ ...profile, profile_image_url: imageUrl }, { onConflict: 'id' });

    if (error) {
      alert('Error saving profile.');
      console.error(error);
    } else {
      alert('Profile updated!');
      setEditing(false);
      setProfile((prev) => ({ ...prev, profile_image_url: imageUrl }));
      setNewImageFile(null);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Seller Profile</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <section className={styles.profileSection}>
            {profile.profile_image_url ? (
              <Image
                src={profile.profile_image_url}
                alt="Profile"
                width={150}
                height={150}
                className={styles.image}
              />
            ) : (
              <p>No profile image</p>
            )}
          </section>

          {!editing ? (
            <section className={styles.profileSection}>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Bio:</strong> {profile.bio}</p>
              <p><strong>Location:</strong> {profile.location}</p>
              <button className={styles.button} onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            </section>
          ) : (
            <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
              <label className={styles.label}>Name</label>
              <input
                className={styles.input}
                name="name"
                value={profile.name}
                onChange={handleChange}
              />

              <label className={styles.label}>Bio</label>
              <textarea
                className={styles.textarea}
                name="bio"
                value={profile.bio}
                onChange={handleChange}
              />

              <label className={styles.label}>Location</label>
              <input
                className={styles.input}
                name="location"
                value={profile.location}
                onChange={handleChange}
              />

              <label className={styles.label}>Profile Image</label>
              <input
                className={styles.input}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />

              {profile.profile_image_url && (
                <button type="button" onClick={handleDeleteImage} className={styles.buttonDanger}>
                  Delete Current Image
                </button>
              )}

              <div className={styles.actions}>
                <button className={styles.button} type="submit">Save</button>
                <button type="button" className={styles.buttonDanger} onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <Link href="/seller-hub/add">
            <button className={styles.button}>Add New Listing</button>
          </Link>

          <h2 className={styles.subtitle}>Your Listings</h2>
          <div className={styles.grid}>
            {listings.map((listing) => (
              <div key={listing.id} className={styles.card}>
                {listing.image && (
                  <Image
                    src={listing.image}
                    alt={listing.title}
                    width={300}
                    height={200}
                    className={styles.image}
                  />
                )}
                <h3>{listing.title}</h3>
                <div className={styles.actions}>
                  <Link href={`/seller-hub/edit/${listing.id}`}>
                    <button className={styles.button}>Edit</button>
                  </Link>
                  <Link href={`/seller-hub/delete/${listing.id}`}>
                    <button className={styles.buttonDanger}>Delete</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
