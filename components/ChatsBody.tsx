import { Chat, ChatHistoryChat } from "@/types/chats"
import { use, useState } from "react"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { EllipsisVertical, Menu, MoreVertical, File } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export default function ChatsBody(props: { docId: string, docName: string }) {
    const [chatHistory, setChatHistory] = useState<ChatHistoryChat[]>([
        { id: "vcewvcwdv", question_content: "what is the opening time", queried_at: "01:24AM " },
        { id: "vcewv", question_content: "what is the closing time", queried_at: "01:24AM " },
        { id: "wvcwdv", question_content: "how to book", queried_at: "01:24AM " },
        { id: "wvcwdrdcrv", question_content: "how to book", queried_at: "01:24AM " },
        { id: "wvgvvycwdv", question_content: "how to book", queried_at: "01:24AM " },
        { id: "wvcwvvydv", question_content: "how to book", queried_at: "01:24AM " },
        { id: "wvcwdbjhv", question_content: "how to book", queried_at: "01:24AM " },
        { id: "wvcwdhhv", question_content: "how to book", queried_at: "01:24AM " },
        { id: "wvcwdjbv", question_content: "how to book", queried_at: "01:24AM " },
        { id: "wvcwhubhbdv", question_content: "how to book", queried_at: "01:24AM " },
        { id: "wvcwdjb jhv", question_content: "how to book", queried_at: "01:24AM " },
        { id: "wdv", question_content: "how to book", queried_at: "01:24AM " },
        { id: "vcwdv", question_content: "how to book", queried_at: "01:24AM " },
        { id: "wvchnwdv", question_content: "how to book", queried_at: "01:24AM " },
        { id: "wdv", question_content: "how to book", queried_at: "01:24AM " },
        { id: "hbb", question_content: "how to book", queried_at: "01:24AM " },

    ]);
    const [lastFiveChats, setLastFiveChats] = useState<Chat[]>([]);
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    return (
        <div className="flex flex-row h-full w-screen ">

            <div className="flex flex-col mr-3 h-full w-1/5.2">
                <div className="bg-teal-500 text-white w-xs  h-24 flex items-center justify-center mt-4 text-2xl rounded-r-lg">
                    Chat History
                </div>

                <div className="flex flex-col gap-3 mt-3 mb-1 h-auto overflow-y-auto">
                    {
                        chatHistory.map((chat) => (
                            <div key={chat.id} className="flex flex-row justify-between bg-slate-300 text-gray-800 rounded-lg px-3 py-2 hover:bg-cyan-50 cursor-pointer ml-3" >
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

            <div className="h-full w-4/5">

                <div className="flex flex-row bg-teal-200 w-full h-1/20 text-teal-500 ml-6 items-center rounded-bl-sm">
                    <File size={32}></File>
                    <p className="mx-auto">{props.docName}</p>
                </div>


                <div className="flex flex-col overflow-y-auto">
                    {
                        lastFiveChats.map(
                            (chat) => (
                                <div className="flex flex-col" key={chat.id}>

                                    <div className="bg-slate-300  text-gray-800"> <p> {chat.question_content} </p> <div> {chat.queried_at} </div></div>

                                    <div className="bg-slate-300  text-gray-800"> <p> {chat.response_content}</p></div>
                                </div>
                            )
                        )
                    }
                </div>


                <div className="flex flex-row m-5">
                    <Input />

                    <button className="rounded-lg bg-teal h-1/15 w-1/20"></button>
                </div>

            </div>

        </div>
    )
}