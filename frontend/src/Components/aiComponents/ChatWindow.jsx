import { Box } from "@mui/material";
import MessageBubble from "./MessageBubble";
import AiLoading from "./AiLoading";
import AiResponseCard from "./AiResponseCard";
import WelcomeMessage from "./WelcomeMessage";

const ChatWindow = ({ messages }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <WelcomeMessage />

      {messages.map((msg, index) => {
        if (msg.type === "user") {
          return <MessageBubble key={index} text={msg.text} sender="user" />;
        }
        if (msg.type === "ai_loading") {
          return <AiLoading key={index} />;
        }
        if (msg.type === "ai_error") {
          return <MessageBubble key={index} text={msg.text} sender="ai" />;
        }
        if (msg.type === "ai_results") {
          return <AiResponseCard key={index} results={msg.results} />;
        }
        return null;
      })}
    </Box>
  );
};

export default ChatWindow;
