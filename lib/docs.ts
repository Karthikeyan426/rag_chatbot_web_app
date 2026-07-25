import api from "./axios";
import {Doc} from "@/types/docs"

export async function fetchDocs(): Promise<Doc[]> {
    const response = await api.post(
        "users/user/docs"
    );

    return response.data["docs"];
}

export async function uploadDoc(doc: File) {
    const formData = new FormData();
    formData.append('document', doc);
    const response = await api.post(
        "users/user/docs/upload",
        formData
    );

    return response.data;
}