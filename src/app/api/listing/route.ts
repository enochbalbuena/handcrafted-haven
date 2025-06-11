import { supabase } from "@/lib/database";
import jwt from "jsonwebtoken";

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

    let payload;
    try {
      payload = jwt.verify(token, AUTH_SECRET);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 401 });
    }

    const seller_id = (payload as any).seller_id;
    if (!seller_id) {
      return new Response(JSON.stringify({ error: "Only sellers can create listings" }), { status: 403 });
    }

    // Parse form-data from the request (in Node.js environment)
    // For edge or serverless environments, you may need to use libraries like `formidable`
    const formData = await req.formData();

    const imageFile = formData.get("image") as File;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;

    if (!imageFile || !description || !price) {
      return new Response(JSON.stringify({ error: "Missing image, description, or price" }), { status: 400 });
    }

    // 1. Upload the image file to Supabase Storage
    const filePath = `images/${Date.now()}_${imageFile.name}`; // unique path with timestamp

    // IMPORTANT: `imageFile` needs to be converted to a Blob or Readable stream if necessary
    // With Next.js edge functions, `imageFile` should be a Blob compatible with supabase.storage.upload

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, imageFile, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      return new Response(JSON.stringify({ error: "Upload error: " + uploadError.message }), { status: 500 });
    }

    // 2. Get public URL for the uploaded image
    const { data: urlData } = supabase.storage.from("images").getPublicUrl(filePath);
    const imageUrl = urlData.publicUrl;

    // 3. Insert listing data into the database
    const listingData = {
      image: imageUrl,
      description,
      price: Number(price),
      seller_id,
    };

    const { data, error } = await supabase.from("listing").insert([listingData]);

    if (error) {
      return new Response(JSON.stringify({ error: `Database error: ${error.message}` }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "Listing created", listing: data }), { status: 201 });

  } catch (error) {
    return new Response(JSON.stringify({ error: "An error occurred" }), { status: 500 });
  }
}
