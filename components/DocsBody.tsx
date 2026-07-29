"use client";
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Doc } from "../types/docs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { MoreVertical, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { deleteDoc, fetchDocs, uploadDoc } from "@/lib/docs";
import axios from "axios";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export default function DocsBody() {
    const [docSearchText, setDocSearchText] = useState("");
    const [docs, setDocs] = useState<Doc[]>([]);
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
                        await handleFetchDocs();
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

    async function handleDeleteDoc(docId: string) {
        try {
            setDocsFetchError("");
            setLoading(true);
            const doc = await deleteDoc(docId);
            if(doc) {
                await fetchDocs();
            }
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
                    setDocsFetchError('Document not found');
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

    return (
        <div className="flex flex-col w-full h-full">
            <div className="sticky top-0 bg-white z-10 flex flex-col items-center py-3 px-4 border-b border-gray-200 shadow-sm">
                <Label className="text-teal-500 text-2xl m-2 ">Search the documents</Label>

                <Input value={docSearchText} onChange={(e) => docSearch(e)} title="Search the documents ..." className="bg-white border-gray-300 w-3/4 " />

                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,application/pdf"
                    onChange={handleUpload}
                />
                <Button className="flex items-center justify-center bg-teal-500  m-2 p-10 rounded-sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                    {
                        isUploading !== true ? <Upload className="text-white text-xl"></Upload> : <div> uploading </div>
                    }
                </Button>

                {docUploadError !== "" && (
                    <Alert variant="destructive" className="rounded-sm m-3 w-2/3">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{docUploadError}</AlertDescription>
                    </Alert>
                )}
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col items-center">
                {!loading && !isDocsEmpty ? (<div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                    {docSearchText === "" ? (docs.map((doc) => {
                        const cardClass = `flex flex-col shadow-md w-64 transition-all ${doc.status === "uploaded"
                            ? "cursor-not-allowed opacity-50"
                            : "hover:shadow-lg active:scale-95 cursor-pointer"}`;
                        return (
                            <Card key={doc.id} className={cardClass} onClick={doc.status === "indexed" ? () => routeToChat(doc.id, doc.doc_name) : undefined} >
                                {doc.status === "uploaded" ? (<CardHeader className="text-white text-center bg-teal-300 rounded-lg w-3/4 self-center">
                                    indexing
                                </CardHeader>) : (<CardHeader className="text-white text-center bg-teal-300 rounded-lg w-3/4 self-center">uploaded</CardHeader>)}
                                <CardContent className="relative aspect-square pointer-events-none">
                                    <Image
                                        src="/PDF_file_icon.svg"
                                        alt="pdf"
                                        fill
                                        className="object-contain"
                                        loading="eager"
                                    />
                                </CardContent>

                                <CardFooter className="flex flex-row items-center justify-between text-teal-500  px-3">
                                    <p className="truncate flex1 text-center">{doc.doc_name}</p>
                                    <div className="self-end">
                                        <DropdownMenu >
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full hover:bg-gray-200 flex-shrink-0"
                                                >
                                                    <MoreVertical className="h-5 w-5 text-gray-600" />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end" className="w-40 text-center">

                                                <DropdownMenuItem
                                                    onClick={async () =>  {
                                                        await handleDeleteDoc(doc.id)
                                                    }}
                                                    className="text-red-600 focus:text-red-600 text-center"
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardFooter>

                            </Card>
                        )
                    })) :
                        (searchedDocs.map((doc) => {
                            const cardClass = `shadow-md flex flex-col w-64 transition-all ${doc.status === "uploaded"
                                ? "cursor-not-allowed opacity-50"
                                : "hover:shadow-lg active:scale-95 cursor-pointer"}`;
                            return (
                                <Card key={doc.id} className={cardClass}  onClick={doc.status === "indexed" ? () => routeToChat(doc.id, doc.doc_name) : undefined}>
                                    {doc.status === "uploaded" ? (<CardHeader className="text-white text-center bg-teal-300 rounded-lg w-3/4 self-center">
                                        indexing
                                    </CardHeader>) : (<CardHeader className="text-white text-center bg-teal-300 rounded-lg w-3/4 self-center">uploaded</CardHeader>)}
                                    <CardContent className="relative aspect-square pointer-events-none" >
                                        <Image
                                            src="/PDF_file_icon.svg"
                                            alt="pdf"
                                            fill
                                            className="object-contain"
                                            loading="eager"
                                        />
                                    </CardContent>

                                    <CardFooter className="flex flex-row justify-between  px-3 items-center text-teal-500">
                                        <p className="truncate flex1 text-center">{doc.doc_name}</p>
                                        <div className="self-end">
                                            <DropdownMenu >
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full hover:bg-gray-200 flex-shrink-0"
                                                    >
                                                        <MoreVertical className="h-5 w-5 text-gray-600" />
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end" className="w-40 text-center">

                                                    <DropdownMenuItem
                                                        onClick={async () => {
                                                            await handleDeleteDoc(doc.id);
                                                        }}
                                                        className="text-red-600 focus:text-red-600 text-center"
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardFooter>

                                </Card>
                            )
                        }))
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
                    !loading && isDocsEmpty && (
                        <div>
                            <p> Upload documents to start</p>
                        </div>
                    )
                }


                {docsFetchError !== "" && (
                    <Alert variant="destructive" className="rounded-sm m-3 w-2/3">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{docsFetchError}</AlertDescription>
                    </Alert>
                )}
            </div>



        </div>
    );

}