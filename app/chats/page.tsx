"use client";
import { useSearchParams } from "next/navigation";
import ChatsBody from "@/components/ChatsBody";
export default function ChatsPage() {
    const searchParams = useSearchParams();
    const docId = searchParams.get('doc_id');
    const docName = searchParams.get('doc_name');

    return (
       <main className="h-screen w-screen bg-gray-100 overflow-hidden">
        <ChatsBody docId = {docId!} docName = {docName!}/>
       </main>
    );
}