"use client";
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Doc } from "../types/docs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { fetchDocs, uploadDoc } from "@/lib/docs";
import axios from "axios";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function DocsBody() {
    const [docSearchText, setDocSearchText] = useState("");
    const [docs, setDocs] = useState<Doc[]>([
        { id: "ytfyyytfty", user_id: "ghjguvu", doc_name: "user_manual", uploaded_at: "tutfuut" },
        { id: "ytfjjhyytfty", user_id: "ghjguvu", doc_name: "telephone_manual", uploaded_at: "tutfuut" },
        { id: "ytfyyytyigty", user_id: "ghjguvu", doc_name: "fan_manual", uploaded_at: "tutfuut" },
        { id: "ytytfty", user_id: "ghjguvu", doc_name: "car_manual", uploaded_at: "tutfuut" },
        { id: "ytfyyhjbhbuvrfty", user_id: "ghjguvu", doc_name: "user_manual", uploaded_at: "tutfuut" },
        { id: "ytfjjhyctxyytfty", user_id: "ghjguvu", doc_name: "telephone_manual", uploaded_at: "tutfuut" },
        { id: "ytfy55ftyytyigty", user_id: "ghjguvu", doc_name: "fan_manual", uploaded_at: "tutfuut" },
        { id: "ytytuit8798fty", user_id: "ghjguvu", doc_name: "car_manual", uploaded_at: "tutfuut" }
    ]);
    const [searchedDocs, setSearchedDocs] = useState<Doc[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isDocUploaded, setIsDocUploaded] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [docUploadError, setDocUploadError] = useState("");
    const [docsFetchError, setDocsFetchError] = useState("");
    const [isDocsEmpty, setIsDocsEmpty] = useState(false);

    function delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }


    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            try {
                setIsDocUploaded(false);
                setDocUploadError("");
                setIsUploading(true);
                if (file.type !== 'application/pdf') {
                    setIsUploading(false)
                    setDocUploadError("Only PDF files are allowed")
                }
                else {
                    const doc = await uploadDoc(file);
                    if (doc) {
                        setIsUploading(false);
                        setDocUploadError("");
                        setIsDocUploaded(true);
                    }
                }
            }
            catch (err: any) {
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 401) {
                        setIsUploading(false);
                        setDocUploadError("Unauthorized access");
                        await delay(2000);
                        localStorage.removeItem("access_token");
                        router.replace("/login");
                    }
                    else {
                        setIsUploading(false);
                        setDocUploadError("Something went wrong");
                    }
                }
            }
            finally {
                setIsUploading(false);
            }
        }
    }

    async function handleFetchDocs() {
        try {
            setIsDocsEmpty(false);
            setDocsFetchError("");
            setLoading(true);
            const docs = await fetchDocs();
            setDocs(docs);
        }
        catch (err: any) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    setDocsFetchError("Unauthorized access");
                    await delay(2000);
                    localStorage.removeItem("access_token");
                    router.replace("/login");
                }
                else if (err.response?.status === 404) {
                    setIsDocsEmpty(true);
                }
                else {
                    setDocsFetchError("Something went wrong");
                }
            }

        }
        finally {
            setLoading(false);
        }
    }

    function routeToChat(docId: String, docName: string) {
        router.push(`/chats?doc_id=${docId}&doc_name=${docName}`);
    }

    function docSearch(e: React.ChangeEvent<HTMLInputElement>) {
        setDocSearchText(e.target.value);
        setSearchedDocs(docs.filter((doc) => doc.doc_name.includes(docSearchText)));
    }

    useEffect(
        () => {
            handleFetchDocs();
        }, []
    )

    return (
        <div className="flex flex-col w-full h-full items-center ">
            <Label className="text-teal-500 text-lg m-2">Search the documents</Label>

            <Input value={docSearchText} onChange={(e) => docSearch(e)} title="Search the documents ..." className="bg-white border-gray-300 w-3/4 h-8 " />

            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,application/pdf"
                onChange={handleUpload}
            />
            <Button className="flex items-center justify-center bg-teal-500  m-2 p-10 rounded-sm" onClick={() => fileInputRef.current?.click()} disabled = {isUploading}>
                <Upload className="text-white text-xl"></Upload>
            </Button>

            { docUploadError !== "" && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{docUploadError}</AlertDescription>
            </Alert>
            ) }

            {!loading && !isDocsEmpty ? (<div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4 h-screen overflow-y-auto">
                {docSearchText === "" ? (docs.map((doc) => (
                    <Card key={doc.id} className="shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer w-60 h-96" onClick={() => routeToChat(doc.id, doc.doc_name)}>

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
                        <Card key={doc.id} className="shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer w-60 h-96" onClick={() => routeToChat(doc.id, doc.doc_name)}>

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

            </div>) :
                (
                    <div>
                        <Skeleton className="aspect-square w-full rounded-sm" />
                        <Skeleton className="h-4 w-3/4 mx-auto" />
                    </div>
                )
            }

            {
                !loading && isDocsEmpty  && (
                    <div>
                        <p> "Upload documents to start" </p>
                    </div>
                )
            }

            
            { docsFetchError !== "" && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{docsFetchError}</AlertDescription>
            </Alert>
            ) }



        </div>
    );

}