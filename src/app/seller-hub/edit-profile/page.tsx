'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../ui/header';
import styles from '../seller.module.css';

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    location: '',
    profile_image_url: '',
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return router.push('/login');
      setUserId(user.id);

      const { data } = await supabase
        .from('sellers')
        .select('name, bio, location, profile_image_url')
        .eq('id', user.id)
        .single();

      if (data) setProfile(data);
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setUploading(true);
    const ext = file.name.split('.').pop();
    const filePath = `${userId}/profile.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert('Upload error: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    const { error: updateError } = await supabase
      .from('sellers')
      .update({ profile_image_url: imageUrl })
      .eq('id', userId);

    if (!updateError) {
      // Add cache-busting timestamp
      setProfile((prev) => ({
        ...prev,
        profile_image_url: `${imageUrl}?t=${new Date().getTime()}`,
      }));
    }

    setUploading(false);
  };

  const handleDeleteImage = async () => {
    if (!userId || !profile.profile_image_url) return;

    setDeleting(true);

    const parts = profile.profile_image_url.split('/');
    const cleanFileName = parts[parts.length - 1].split('?')[0]; // remove cache-busting query
    const filePath = `${userId}/${cleanFileName}`;

    const { error: deleteError } = await supabase.storage
      .from('profile-pictures')
      .remove([filePath]);

    if (deleteError) {
      alert('Delete error: ' + deleteError.message);
      setDeleting(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('sellers')
      .update({ profile_image_url: '' })
      .eq('id', userId);

    if (!updateError) {
      setProfile((prev) => ({ ...prev, profile_image_url: '' }));
    }

    setDeleting(false);
  };

  const handleSave = async () => {
    if (!userId) return;

    await supabase
      .from('sellers')
      .update({
        name: profile.name,
        bio: profile.bio,
        location: profile.location,
      })
      .eq('id', userId);

    router.push('/seller-hub');
  };

  return (
    <div>
      <Header />
      <main className={styles.container}>
        <h1 className={styles.title}>Edit Your Profile</h1>

        <form className={styles.form}>
          {profile.profile_image_url ? (
            <>
              <Image
                src={profile.profile_image_url}
                alt="Profile"
                width={150}
                height={150}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={handleDeleteImage}
                className={styles.buttonDanger}
                disabled={deleting}
                style={{ marginTop: '1rem' }}
              >
                {deleting ? 'Deleting...' : 'Delete Image'}
              </button>
            </>
          ) : (
            <p>No profile picture uploaded.</p>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            style={{ marginTop: '1rem' }}
          />
          {uploading && <p>Uploading image...</p>}

          <label className={styles.label}>Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className={styles.input}
          />

          <label className={styles.label}>Location</label>
          <input
            type="text"
            name="location"
            value={profile.location}
            onChange={handleChange}
            className={styles.input}
          />

          <label className={styles.label}>Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            className={styles.textarea}
          />

          <div className={styles.actions}>
            <button type="button" onClick={handleSave} className={styles.button}>
              Save Changes
            </button>
            <Link href="/seller-hub" className={styles.buttonDanger}>
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
