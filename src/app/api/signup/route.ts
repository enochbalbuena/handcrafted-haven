import bcrypt from "bcryptjs";
import { supabase } from "@/lib/database";
import { validateUserInput, checkUsernameExists } from "@/lib/validation";

type UserPayload = {
  name: string;
  email: string;
  username: string;
  password: string;
  accountType: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as UserPayload;
    const { name, email, username, password, accountType } = body;

    const errorMessage = validateUserInput(body);
    const checkUsername = await checkUsernameExists(username);

    if (errorMessage) {
      return new Response(JSON.stringify({ error: errorMessage }), { status: 400 });
    }

    if (checkUsername) {
      return new Response(JSON.stringify({ error: checkUsername }), { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      username,
      password: hashedPassword,
    };

    if (accountType === "Seller") {
      (userData as { seller_id?: string }).seller_id = crypto.randomUUID();
    }

    const insertResult = await supabase.from("users").insert([userData]);

    if (insertResult.error) {
      return new Response(
        JSON.stringify({ error: `Database error: ${insertResult.error.message}` }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ message: "You are logged in" }), { status: 201 });
  } catch {
    return new Response(
      JSON.stringify({ error: "An error occurred during signup." }),
      { status: 500 }
    );
  }
}
