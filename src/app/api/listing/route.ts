import { supabase } from "@/lib/database";
import jwt, { JwtPayload } from "jsonwebtoken";

const AUTH_SECRET = process.env.AUTH_SECRET || "default secret";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ error: "Invalid Authorization format" }), { status: 401 });
    }

    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, AUTH_SECRET) as JwtPayload;
    } catch {
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 401 });
    }

    const seller_id = payload.seller_id;
    if (!seller_id) {
      return new Response(JSON.stringify({ error: "Only sellers can create listings" }), { status: 403 });
    }


    const formData = await req.formData();
    const imageFile = formData.get("image") as File;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;

    if (!imageFile || !description || !price) {
      return new Response(JSON.stringify({ error: "Missing image, description, or price" }), { status: 400 });
    }

    const filePath = `images/${Date.now()}_${imageFile.name}`;
    const filePath = `images/${Date.now()}_${imageFile.name}`;


    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, imageFile, { cacheControl: "3600", upsert: false });

    if (uploadResult.error) {
      return new Response(JSON.stringify({ error: "Upload error: " + uploadResult.error.message }), { status: 500 });
    }


    const { data: urlData } = supabase.storage.from("images").getPublicUrl(filePath);
    const imageUrl = urlData.publicUrl;


    const listingData = {
      image: imageUrl,
      description,
      price: Number(price),
      seller_id,
    };

    const insertResult = await supabase.from("listing").insert([listingData]);

    if (insertResult.error) {
      return new Response(JSON.stringify({ error: `Database error: ${insertResult.error.message}` }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "Listing created", listing: listingData }), { status: 201 });

  } catch {
    return new Response(JSON.stringify({ error: "An error occurred" }), { status: 500 });
  }
}
