import bcrypt from "bcryptjs";
import { supabase } from "@/lib/database";
import { validateUserInput } from "@/lib/validation"
import { checkUsernameExists } from "@/lib/validation";


export async function POST(req: Request){
  try{
    const body = await req.json();
    const { name, username, password } = body;
    const errorMessage = validateUserInput(body);
    const checkUsername = await checkUsernameExists(body.username)
 
    if(errorMessage) return new Response(
      JSON.stringify({error: errorMessage}), {status: 400}
    );

    if (checkUsername) return new Response(JSON.stringify({error: checkUsername}), {status:400});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const {data, error} = await supabase
    .from("users")
    .insert([{name,username,password: hashedPassword}]);

    if (error){
      return new Response(JSON.stringify({error: `Database error: ${error.message}`}), {status:500});
    }

    if(!error) return new Response(JSON.stringify({message: "You are logged in"}), {status:201});


    
  }catch (error){
      return new Response(
        JSON.stringify({error: "a error occured"}), {status: 500}
      );
  }
}