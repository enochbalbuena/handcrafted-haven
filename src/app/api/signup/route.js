import clientPromise from "../../lib/mongodb";

import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, username, password } = body;

    if (!name || !username || !password) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(); // default DB from URI

    // Check if username already exists
    const existingUser = await db.collection("users").findOne({ username });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Username already taken" }), { status: 409 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const result = await db.collection("users").insertOne({
      name,
      username,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ message: "User created", userId: result.insertedId }), { status: 201 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
