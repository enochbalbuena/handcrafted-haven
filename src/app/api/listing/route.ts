import { supabase } from "@/lib/database";
import { json } from "stream/consumers";

export async function POST(req: Request){
    const body = await req.json();
    
    // const {image, description, price} = body;

    // const {data, error} = await supabase
    // .from


    // if(!data){
        
    // }

}