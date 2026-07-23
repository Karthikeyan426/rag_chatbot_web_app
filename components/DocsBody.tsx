"use client";
import { useRef, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Doc } from "../types/docs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Image  from "next/image";
import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { fetchDocs } from "@/lib/docs";

export default function DocsBody() {
    const [docSearchText, setDocSearchText] = useState("");
    const [docs, setDocs] = useState<Doc[]>([
        {id: "ytfyyytfty", user_id: "ghjguvu", doc_name: "user_manual", uploaded_at: "tutfuut"},
        {id: "ytfjjhyytfty", user_id: "ghjguvu", doc_name: "telephone_manual", uploaded_at: "tutfuut"},
        {id: "ytfyyytyigty", user_id: "ghjguvu", doc_name: "fan_manual", uploaded_at: "tutfuut"},
        {id: "ytytfty", user_id: "ghjguvu", doc_name: "car_manual", uploaded_at: "tutfuut"}
    ]);
    const [searchedDocs, setSearchedDocs] = useState<Doc[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    

    function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if(file) {
            
        }
    }

    function routeToChat(docId: String) {
        router.push("/chats")
    }

    function docSearch(e: React.ChangeEvent<HTMLInputElement>) {
        setDocSearchText(e.target.value);
        setSearchedDocs(docs.filter((doc) => doc.doc_name.includes(docSearchText)));
    }

    return (
        <div className="flex flex-col w-full h-full items-center ">
            <Label className="text-teal-500 text-lg m-2">Search the documents</Label>

            <Input value={docSearchText} onChange={(e) => docSearch(e) } title="Search the documents ..." className="bg-white border-gray-300 w-3/4 h-8 " />

            <input
             ref = {fileInputRef}
             type = "file"
             className="hidden"
             accept=".pdf,application/pdf"
             onChange = {handleUpload}
            />
            <Button className="flex items-center justify-center bg-teal-500  m-2 p-10 rounded-sm" onClick={() => fileInputRef.current?.click()}>
               <Upload className="text-white text-xl"></Upload>
            </Button>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {docSearchText === "" ?(docs.map((doc) => (
                    <Card key={doc.id} className="shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer w-60 h-auto" onClick = {() => routeToChat(doc.id)}>

                        <CardContent className="relative aspect-square pointer-events-none">
                            <Image 
                            src="/PDF_file_icon.svg"
                            alt="pdf"
                            fill
                            className="object-contain"
                            />
                        </CardContent>

                        <CardFooter className="text-center justify-center text-teal-500">
                            <p>{doc.doc_name}</p>
                        </CardFooter>

                    </Card>
                ))) :
                (searchedDocs.map((doc) => (
                    <Card key={doc.id} className="shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer w-60 h-auto" onClick = {() => routeToChat(doc.id)}>

                        <CardContent className="relative aspect-square pointer-events-none">
                            <Image 
                            src="/PDF_file_icon.svg"
                            alt="pdf"
                            fill
                            className="object-contain"
                            />
                        </CardContent>

                        <CardFooter className="text-center justify-center text-teal-500">
                            <p>{doc.doc_name}</p>
                        </CardFooter>

                    </Card>
                )))
                }

            </div>


        </div>
    );

}