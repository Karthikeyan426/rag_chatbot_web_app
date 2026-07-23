import api from "./axios";
import {Doc} from "@/types/docs"

export async function fetchDocs(): Promise<Doc[]> {
    const response = await api.post(
        "users/user/docs"
    );

    return response.data;
}

export async function uploadDoc(doc: File) {
    
}