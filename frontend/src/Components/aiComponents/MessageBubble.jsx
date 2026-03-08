import { Box, Typography } from "@mui/material";

const MessageBubble = ({ text, sender }) => {
  const isUser = sender === "user";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <Box
        sx={{
          backgroundColor: isUser ? "#a91111" : "#fff",
          color: isUser ? "white" : "#1a1a1a",
          border: isUser ? "none" : "1px solid #f0f0f0",
          px: 2,
          py: 1.2,
          borderRadius: isUser ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
          maxWidth: "70%",
          boxShadow: isUser
            ? "0 2px 8px rgba(169,17,17,0.2)"
            : "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Typography fontSize="0.9rem" lineHeight={1.5}>
          {text}
        </Typography>
      </Box>
    </Box>
  );
};

export default MessageBubble;
