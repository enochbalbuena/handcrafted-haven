'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/database';

const CreateItemPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('items').insert([
      {
        name,
        description,
        picture: picture || null,
        seller_id: sellerId,
        price: parseFloat(price),
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Item created successfully!');
      setName('');
      setDescription('');
      setPicture('');
      setSellerId('');
      setPrice('');
    }
  };

  return (
    <div>
      <h1>Create New Item</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input value={name} onChange={e => setName(e.target.value)} required />
        </label>
        <br />
        <label>
          Description:
          <textarea value={description} onChange={e => setDescription(e.target.value)} required />
        </label>
        <br />
        <label>
          Picture URL (optional):
          <input value={picture} onChange={e => setPicture(e.target.value)} />
        </label>
        <br />
        <label>
          Seller ID:
          <input value={sellerId} onChange={e => setSellerId(e.target.value)} required />
        </label>
        <br />
        <label>
          Price:
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Create Item</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateItemPage;