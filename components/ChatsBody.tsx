import { Chat, ChatHistoryChat } from "@/types/chats"
import { use, useState } from "react"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {  BrainCircuit,MoreVertical, File } from "lucide-react";
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
    const [lastFiveChats, setLastFiveChats] = useState<Chat[]>([
        {id:"jgetrret", question_content:"what is this about", response_content: `The first edition of this book is what got me hooked on Git. This was my introduction to a style of
making software that felt more natural than anything I had seen before. I had been a developer for
several years by then, but this was the right turn that sent me down a much more interesting path
than the one I was on.
Now, years later, I’m a contributor to a major Git implementation, I’ve worked for the largest Git
hosting company, and I’ve traveled the world teaching people about Git. When Scott asked if I’d be
interested in working on the second edition, I didn’t even have to think.
It’s been a great pleasure and privilege to work on this book. I hope it helps you as much as it did
me.`, queried_at: "11:14PM"},
        {id:"sde", question_content:"what is this about", response_content: `The first edition of this book is what got me hooked on Git. This was my introduction to a style of
making software that felt more natural than anything I had seen before. I had been a developer for
several years by then, but this was the right turn that sent me down a much more interesting path
than the one I was on.
Now, years later, I’m a contributor to a major Git implementation, I’ve worked for the largest Git
hosting company, and I’ve traveled the world teaching people about Git. When Scott asked if I’d be
interested in working on the second edition, I didn’t even have to think.
It’s been a great pleasure and privilege to work on this book. I hope it helps you as much as it did
me.`, queried_at: "11:14PM"},
        {id:"sxwx", question_content:"what is this about", response_content: `The first edition of this book is what got me hooked on Git. This was my introduction to a style of
making software that felt more natural than anything I had seen before. I had been a developer for
several years by then, but this was the right turn that sent me down a much more interesting path
than the one I was on.
Now, years later, I’m a contributor to a major Git implementation, I’ve worked for the largest Git
hosting company, and I’ve traveled the world teaching people about Git. When Scott asked if I’d be
interested in working on the second edition, I didn’t even have to think.
It’s been a great pleasure and privilege to work on this book. I hope it helps you as much as it did
me.`, queried_at: "11:14PM"},
        {id:"ijh6", question_content:"what is this about", response_content: "this is about technical manual", queried_at: "11:14PM"},
        {id:"7887", question_content:"what is this about", response_content: "this is about technical manual", queried_at: "11:14PM"},
        {id:",h78", question_content:"what is this about", response_content: "this is about technical manual", queried_at: "11:14PM"},
        {id:"jgetgg87yrret", question_content:"what is this about", response_content: "this is about technical manual", queried_at: "11:14PM"},
        {id:"jgetrjhgyio;ret", question_content:"what is this about", response_content: "this is about technical manual", queried_at: "11:14PM"},
        {id:"jgetrre'oihygt", question_content:"what is this about", response_content: "this is about technical manual", queried_at: "11:14PM"}
    ]);
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



            <div className="flex flex-col h-full w-4/5 ">

                <div className="flex flex-row bg-teal-200 w-full h-1/18 text-teal-500 ml-6 items-center rounded-bl-sm p-5">
                    <File size={32}></File>
                    <p className="mx-auto">{props.docName}</p>
                </div>


                <div className="flex flex-col overflow-y-auto">
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


                <div className="flex flex-row m-5 items-center justify-center w-4/5">
                    <Input className="border-gray-300 bg-white w-3/4 h-16" multiple = {true} aria-multiline = {true}/>

                    <Button className="bg-teal-500 m-2 h-8 w-8">
                        <BrainCircuit size={32}>
                        </BrainCircuit>
                    </Button>
                </div>

            </div>

        </div>
    )
}