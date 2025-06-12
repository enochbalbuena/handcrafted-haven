import { supabase } from "@/lib/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const AUTH_SECRET = process.env.AUTH_SECRET || "default secret"

export async function POST(req: Request) {
  const body = await req.json();
  const { username, password } = body;

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (!data) {
    return new Response(JSON.stringify({ error: "Invalide username" }), {
      status: 400,
    });
  }

  const passwordMatches = await bcrypt.compare(password, data.password);

  if (!passwordMatches) {
    return new Response(JSON.stringify({ error: "Invalide Password" }), {
      status: 400,
    });
  }

  const tokenPayload = {
    id: data.id,
    username: data.username,
    seller_id: data.seller_id ?? null,
  }

  const token = jwt.sign(tokenPayload, AUTH_SECRET, {expiresIn: "1d"});

  return new Response(
    JSON.stringify({
      message: "You are now logged in",
      token,
      isSeller: !!data.seller_id, 
      user: {
        id: data.id,
        username: data.username,
        name: data.name,
        email: data.email,
        seller_id: data.seller_id ?? null,
      },
    }),
    { status: 200 }
  );
}
