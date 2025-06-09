import { supabase } from "./database";


export function validateUserInput(data:{name?: string;email?: string, username?: string; password?:string;}): string |null {
    if (!data.name) return "Name is required";
    if (!data.email)
    if (!data.username) return "Username is required";
    if (!data.password) return "Password is required";
    return null;
}

export async function checkUsernameExists(username: string): Promise<string | null> {
    const {data, error} = await supabase
    .from("users")
    .select("*")
    .eq("username", username)

    if(error){
        return `Database error: ${error.message}`;
    }

    if(data.length > 0){
        return "Username already exist"
    }

    return null
}