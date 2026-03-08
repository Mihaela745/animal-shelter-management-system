import { Box, TextField, IconButton, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import {
  addUserMessage,
  addAiLoading,
  searchAnimalAI,
} from "../../../features/AIMatch/AiMatchSlice";
import ChatWindow from "../../../Components/aiComponents/ChatWindow";

const AiMatchPage = () => {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.aiMatch);
  const [prompt, setPrompt] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!prompt.trim()) return;
    dispatch(addUserMessage(prompt));
    dispatch(addAiLoading());
    dispatch(searchAnimalAI(prompt));
    setPrompt("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: { xs: "calc(100vh - 100px)", md: "calc(100vh - 64px)" },
        width: "fit-content",
        mx: "auto",
        px: { xs: 1, sm: 2 },
        marginTop: { xs: "1rem", md: "1rem" },
        padding:"0",
        overflow: "auto",
        paddingBottom:"10px"
      }}
    >
      <Box
        sx={{
          py: 2.5,
          px: 1,
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            backgroundColor: "#a91111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.3rem",
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(169,17,17,0.3)",
          }}
        >
          🐾
        </Box>
        <Box>
          <Typography fontWeight={700} fontSize="1rem" color="#1a1a1a">
            PawsAssistant
          </Typography>
          <Typography fontSize="0.75rem" color="#a91111" fontWeight={500}>
            ● Online
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          py: 3,
          px: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#e0e0e0",
            borderRadius: "4px",
          },
        }}
      >
        <ChatWindow messages={messages} />
        <div ref={bottomRef} />
      </Box>

      <Box
        sx={{
          py: 2,
          px: 1,
          borderTop: "1px solid #f0f0f0",
          display: "flex",
          gap: 1,
          alignItems: "flex-end",
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={3}
          placeholder="Descrie animalul dorit..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              backgroundColor: "#fafafa",
              fontSize: "0.9rem",
              "& fieldset": { borderColor: "#e8e8e8" },
              "&:hover fieldset": { borderColor: "#a91111" },
              "&.Mui-focused fieldset": {
                borderColor: "#a91111",
                borderWidth: "1.5px",
              },
            },
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!prompt.trim()}
          sx={{
            backgroundColor: prompt.trim() ? "#a91111" : "#f0f0f0",
            color: prompt.trim() ? "white" : "#bbb",
            width: 42,
            height: 42,
            flexShrink: 0,
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: prompt.trim() ? "#8a0d0d" : "#f0f0f0",
            },
          }}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default AiMatchPage;
