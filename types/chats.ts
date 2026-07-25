export type ChatHistoryChat = {
    id: string,
    question_content: string,
    queried_at: string
}

export type Chat = {
    id: string,
    question_content: string,
    response_content: string,
    queried_at: string
}

export type QueryRequest = {
    doc_id: string,
    question: string
}