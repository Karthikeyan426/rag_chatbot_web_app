import { Chat, ChatHistoryChat, QueryRequest } from "@/types/chats"
import { use, useEffect, useRef, useState } from "react"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { BrainCircuit, MoreVertical, File } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { deleteChat, processQuery, fetchChatHistory, fetchLastFiveChats } from "@/lib/chats";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ChatsBody(props: { docId: string, docName: string }) {
    const [chatHistory, setChatHistory] = useState<ChatHistoryChat[]>([]);
    const [lastFiveChats, setLastFiveChats] = useState<Chat[]>([]);
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [lastChatId, setLastChatId] = useState("");
    const router = useRouter();
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);


    async function handleFetchChatHistory() {
        try {
            setError("");
            setChatHistory([]);
            setLoading(true);
            const chatHistory = await fetchChatHistory(props.docId);
            chatHistory.sort
            setChatHistory(chatHistory);
            setLastChatId(chatHistory[0]["id"]);
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 404) {
                    setChatHistory([]);
                }
                else if (err.response?.status == 401) {
                    router.replace('/login');
                }
                else {
                    setError("Something went wrong");
                }
            }

        }
        finally {
            setLoading(false)
        }
    }

    async function handleFetchLastFiveChats() {
        if (lastChatId === "") {
            return;
        }
        else {
            try {
                setError("");
                setLastFiveChats([]);
                setLoading(true);
                const newLastFiveChats = await fetchLastFiveChats(props.docId, lastChatId);
                setLastFiveChats(newLastFiveChats)

            }
            catch (err) {
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 404) {
                        setChatHistory([]);
                    }
                    else if (err.response?.status == 401) {
                        router.replace('/login');
                    }
                    else {
                        setError("Something went wrong");
                    }
                }

            }
            finally {
                setLoading(false)
            }
        }
    }

    async function handleFetchChat(docId: string, lastChatId: string) {
        try {
            setError("");
            setLoading(true);
            setLastFiveChats([]);
            const newLastFiveChats = await fetchLastFiveChats(docId, lastChatId);
            console.log(newLastFiveChats);
            setLastFiveChats(newLastFiveChats);
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 404) {
                    setLastFiveChats([])
                }
                else if (err.response?.status == 401) {
                    router.replace('/login');
                }
                else {
                    setError("Something went wrong");
                }
            }
        }
        finally {
            setLoading(false);
        }
    }

    async function handleDeleteChat(chatId: string) {
        try {
            setError("");
            setLoading(true);
            const deletedChat = await deleteChat(chatId);
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 404) {
                    setError("chat couldn't be found");
                }
                else if (err.response?.status == 401) {
                    router.replace('/login');
                }
                else {
                    setError("Something went wrong");
                }
            }
        }
        finally {
            setLoading(false);
        }
    }

    async function handleQuery() {
        try {
            setError("");
            setLoading(true);
            const data: QueryRequest = { doc_id: props.docId, question: inputRef.current?.value! }
            const chat = await processQuery(data);
            setLastFiveChats(prev => [...prev.slice(1), chat]);
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 404) {
                    setError("document not found")
                }
                else if (err.response?.status == 401) {
                    router.replace('/login');
                }
                else {
                    setError("Something went wrong");
                }
            }
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(
        () => {
            handleFetchChatHistory();
        }, []
    )

    useEffect(
        () => {
            if (lastChatId) {
                handleFetchLastFiveChats();
            }
        }, [lastChatId]
    )

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [lastFiveChats]);

    return (
        <div className="flex flex-row h-full w-screen ">

            <div className="flex flex-col mr-3 h-full w-1/4">
                <div className="bg-teal-500 text-white w-xs  h-24 flex items-center justify-center mt-4 text-2xl rounded-r-lg">
                    Chat History
                </div>

                <div className="flex flex-col gap-3 mt-3 mb-1 h-auto overflow-y-auto  scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100">
                    {
                        chatHistory.map((chat) => (
                            <div key={chat.id} className="flex flex-row justify-between bg-slate-300 text-gray-800 rounded-lg px-3 py-2 hover:bg-cyan-50 cursor-pointer ml-3" onClick={async () => { await handleFetchChat(props.docId, chat.id) }} >
                                <p className="font-medium truncate">{chat.question_content}</p>

                                <div className="text-xs text-gray-500 ml-2 whitespace-nowrap">{chat.queried_at}</div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full hover:bg-gray-200"
                                        >
                                            <MoreVertical className="h-5 w-5 text-gray-600" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end" className="w-40 text-center">

                                        <DropdownMenuItem
                                            onClick={() => {

                                            }}
                                            className="text-red-600 focus:text-red-600 text-center"
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )
                        )
                    }

                </div>

            </div>

            <div className="w-px bg-gray-300 h-screen" />



            <div className="flex flex-col h-full w-4/5 ">

                <div className="flex flex-row bg-teal-200 w-full h-1/18 text-teal-500 ml-6 items-center rounded-bl-sm p-5">
                    <File size={32}></File>
                    <p className="mx-auto">{props.docName}</p>
                </div>


                <div className="flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100" ref={chatContainerRef}>
                    {
                        lastFiveChats.map(
                            (chat) => (
                                <div className="flex flex-col m-5" key={chat.id}>

                                    <div className="flex flex-col bg-slate-300  text-gray-800 m-1 self-end rounded-sm p-3">
                                        <p> {chat.question_content} </p>
                                        <div className="self-end text-xs text-gray-500">
                                            {chat.queried_at}
                                        </div>
                                    </div>

                                    <div className="bg-slate-300  text-gray-800 m-1 p-5 rounded-sm"> <p> {chat.response_content}</p></div>
                                </div>
                            )
                        )
                    }
                </div>


                <div className="sticky bottom-0 flex flex-row m-5 items-center justify-center w-4/5">
                    <textarea
                        ref={inputRef}
                        className="border border-gray-300 bg-white w-3/4 rounded-md px-3 py-2 resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-10 max-h-40"
                        rows={1}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        placeholder="Ask a question..."
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                inputRef.current!.value = ""
                                e.preventDefault();
                                handleQuery();
                            }
                        }
                        }
                    />
                    < Button className="bg-teal-500 m-2 px-6 py-5" onClick={handleQuery} disabled={inputRef.current?.value === ""} >
                        <BrainCircuit size={32}>
                        </BrainCircuit>
                    </Button>
                </div>

            </div>

        </div >
    )
}