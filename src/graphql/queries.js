import { gql } from '@apollo/client';

// Query to get all chats for the logged-in user (RLS does the filtering)
export const GET_CHATS_QUERY = gql`
  query GetChats {
    chats(order_by: { created_at: desc }) {
      id
      title
      created_at
    }
  }
`;

// Query to get messages for a specific chat ID
export const GET_MESSAGES_QUERY = gql`
  query GetMessages($chat_id: uuid!) {
    messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
      id
      content
      role
      created_at
    }
  }
`;
