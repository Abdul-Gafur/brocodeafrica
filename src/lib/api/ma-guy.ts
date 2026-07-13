import { ChatMessage } from "@/lib/types/ma-guy";

/**
 * Rotating canned replies used to simulate "Ma Guy" responses until the real
 * backend/LLM endpoint is wired up. Kept generic and supportive in tone to
 * match the assistant's role as a youth wellness/SRHR/finance guide.
 */
const CANNED_REPLIES = [
  "I hear you. Can you tell me a bit more about what's going on so I can point you in the right direction?",
  "Thanks for sharing that with me. Based on what you've said, it might help to connect with one of our support services — want me to pull up some resources?",
  "You're not alone in this. A lot of people in the Brocode community have felt the same way. Let's take it one step at a time.",
  "That's a great question. Let me break it down for you simply, and feel free to ask follow-ups anytime.",
  "I want to make sure you get the right support. Is this something urgent, or are you looking for general guidance?",
];

let replyIndex = 0;

/**
 * TODO: replace with real POST /chat call once the Ma Guy backend/LLM endpoint is available.
 * Currently simulates network latency and returns a rotating canned assistant reply.
 */
export async function sendMessageToMaGuy(
  message: string,
  history: ChatMessage[]
): Promise<ChatMessage> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  void message;
  void history;

  const reply = CANNED_REPLIES[replyIndex % CANNED_REPLIES.length];
  replyIndex += 1;

  return {
    id: `assistant-${Date.now()}`,
    role: "assistant",
    content: reply,
    timestamp: new Date().toISOString(),
  };
}
