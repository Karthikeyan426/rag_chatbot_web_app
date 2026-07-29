import api from './axios';
import { ChatHistoryChat, Chat, QueryRequest } from '@/types/chats';

export async function fetchChatHistory(docId: string): Promise<ChatHistoryChat[]> {
    const response = await api.get(`users/user/chats/doc/${docId}`);
    return response.data;
}

export async function fetchChat(chatId: string): Promise<Chat> {
    const response = await api.get(`users/user/chats/${chatId}`);
    return response.data;
}

export async function fetchLastFiveChats(docId: string, lastChatId: string): Promise<Chat[]> {
    const response = await api.get(`users/user/chats/doc/recent/` ,{
        params: {
            doc_id: docId,
            last_chat_id: lastChatId
        }
    }
    );
    return response.data;
}

export async function processQuery(data: QueryRequest): Promise<Chat> {
    const response = await api.post(
        'users/user/chats/query',
        data
    )

    return response.data
}

export async function deleteChat(chatId: string) {
    const response = await api.delete(
        `users/user/chats/${chatId}`, {
    
    }
    )

    return response.data
}