'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/database';
import styles from './seller.module.css';

type SellerProfile = {
  id?: string;
  name: string;
  bio: string;
  location: string;
};

export default function SellerPage() {
  const [profile, setProfile] = useState<SellerProfile>({
    name: '',
    bio: '',
    location: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from('sellers')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile({
          id: data.id,
          name: data.name || '',
          bio: data.bio || '',
          location: data.location || '',
        });
      } else {
        setProfile((prev) => ({ ...prev, id: user.id }));
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!profile.id) return alert("User not identified.");

    const { error } = await supabase
      .from('sellers')
      .upsert(profile, { onConflict: 'id' });

    if (error) {
      alert('Error saving profile.');
      console.error(error);
    } else {
      alert('Profile saved!');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Seller Profile</h1>

      {loading ? (
        <p>Loading profile...</p>
      ) : (
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <label className={styles.label}>Name</label>
          <input
            className={styles.input}
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Your name or shop name"
          />

          <label className={styles.label}>Bio</label>
          <textarea
            className={styles.textarea}
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            placeholder="Tell customers about your passion, craft, or journey."
          />

          <label className={styles.label}>Location</label>
          <input
            className={styles.input}
            name="location"
            value={profile.location}
            onChange={handleChange}
            placeholder="City, Country"
          />

          <button className={styles.button} type="submit">Save Profile</button>
        </form>
      )}
    </div>
  );
}
