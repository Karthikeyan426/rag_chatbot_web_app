import { Chat, ChatHistoryChat } from "@/types/chats"
import { use, useState } from "react"
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function ChatsBody(props: {docId: string, docName: string}) {
    const [chatHistory, setChatHistory] = useState<ChatHistoryChat[]>([]);
    const [lastFiveChats, setLastFiveChats] = useState<Chat[]>([]);
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    return (
        <div className="flex flex-row">

            <div>
                <div> 
                    <p> Chat History </p>
                </div>

                <div className="flex flex-col">
                    {
                        chatHistory.map((chat) =>(
                            <div className="flex flex-row"> <p>{chat.question_content}</p>  <div>{chat.queried_at}</div></div>
                        )
                        )
                    }

                </div>

            </div>


            <div>

                <div>
                    <p>{props.docName}</p>
                </div>


                <div className="flex flex-col">
                    {
                        lastFiveChats.map(
                            (chat) => (
                                <div className="flex flex-col" key={chat.id}>

                                    <div> <p> {chat.question_content} </p> <div> { chat.queried_at} </div></div>
                                   
                                    <div> <p> {chat.response_content}</p></div>
                                </div>
                            )
                        )
                    }
                </div>


                <div className="flex flex-row">
                    <Input/>

                    <Button/>
                </div>

            </div>

        </div>
    )
}