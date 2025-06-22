import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import SendIcon from "@mui/icons-material/Send";
import MoodIcon from "@mui/icons-material/Mood";
import EmojiPicker from "emoji-picker-react";
import { EmojiClickData } from "emoji-picker-react";
import MessageCard from "../messageCard/MessageCard";
import styles from "./MesaggePage.module.scss";
import { ChatDTO } from "../../redux/chat/ChatModel";
import { UserDTO } from "../../redux/auth/AuthModel";
import { AppDispatch } from "../../redux/Store";
import { useDispatch } from "react-redux";
import {
  deleteChat,
  removeUserFromGroupChat,
} from "../../redux/chat/ChatAction";
import { TOKEN } from "../../config/Config";

interface MessagePageProps {
  chat: ChatDTO;
  reqUser: UserDTO | null;
  messages: any[];
  newMessage: string;
  setNewMessage: (m: string) => void;
  onSendMessage: () => void;
  setIsShowEditGroupChat: (b: boolean) => void;
  setCurrentChat: (c: ChatDTO | null) => void;
}

const MessagePage: React.FC<MessagePageProps> = ({
  chat,
  reqUser,
  messages,
  newMessage,
  setNewMessage,
  onSendMessage,
  setIsShowEditGroupChat,
  setCurrentChat,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const token = localStorage.getItem(TOKEN) ?? "";

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const menuOpen = Boolean(anchorEl);
  const [searchMode, setSearchMode] = useState(false);
  const [query, setQuery] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const lastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    lastRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!reqUser) return null;

  const isCreator = reqUser.id === chat.createdBy.id;

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const onLeaveGroup = async () => {
    handleMenuClose();
    if (isCreator) return;
    try {
      await dispatch(removeUserFromGroupChat(chat.id, reqUser.id, token));
      setCurrentChat(null);
    } catch (err: any) {
      console.error("Leave failed:", err);
      alert(err.message || "Не удалось покинуть чат");
    }
  };

  const onDeleteChat = async () => {
    handleMenuClose();
    if (!isCreator) return;
    try {
      await dispatch(deleteChat(chat.id, token));
      setCurrentChat(null);
    } catch (err: any) {
      console.error("Delete failed:", err);
      alert(err.message || "Не удалось удалить чат");
    }
  };

  const toggleSearch = () => setSearchMode((v) => !v);
  const clearSearch = () => {
    setQuery("");
    setSearchMode(false);
  };
  const onEmojiClick = (e: EmojiClickData) => {
    setPickerOpen(false);
    setNewMessage(newMessage + e.emoji);
  };

  return (
    <div className={styles.outerMessagePageContainer}>
      <div className={styles.messagePageHeaderContainer}>
        <div className={styles.messagePageInnerHeaderContainer}>
          <div className={styles.messagePageHeaderNameContainer}>
            <Avatar sx={{ width: 40, height: 40, mr: 1 }}>
              {chat.chatName.charAt(0)}
            </Avatar>
            <p>{chat.chatName}</p>
          </div>
          <div className={styles.messagePageHeaderNameContainer}>
            {!searchMode && (
              <IconButton onClick={toggleSearch}>
                <SearchIcon />
              </IconButton>
            )}
            {searchMode && (
              <TextField
                size="small"
                fullWidth
                label="Search messages..."
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value.toLowerCase())
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={clearSearch}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
            >
              {chat.isGroup && !isCreator && (
                <MenuItem onClick={onLeaveGroup}>
                  Leave Group Chat
                </MenuItem>
              )}
              {chat.isGroup && isCreator && (
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    setIsShowEditGroupChat(true);
                  }}
                >
                  Edit Group Chat
                </MenuItem>
              )}
              {isCreator && (
                <MenuItem onClick={onDeleteChat}>
                  {chat.isGroup
                    ? "Delete Group Chat"
                    : "Delete Chat"}
                </MenuItem>
              )}
            </Menu>
          </div>
        </div>
      </div>
      <div
        className={styles.messageContentContainer}
        onClick={() => setPickerOpen(false)}
      >
        {(query
          ? messages.filter((m) =>
              m.content.toLowerCase().includes(query)
            )
          : messages
        ).map((m) => (
          <MessageCard
            key={m.id}
            message={m}
            reqUser={reqUser}
            isNewDate={false}
            isGroup={chat.isGroup}
          />
        ))}
        <div ref={lastRef} />
      </div>
      <div className={styles.footerContainer}>
        {pickerOpen && (
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            searchDisabled
            skinTonesDisabled
          />
        )}
        <div className={styles.innerFooterContainer}>
          <TextField
            fullWidth
            size="small"
            label="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSendMessage();
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={onSendMessage}>
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ backgroundColor: "white" }}
          />
          <IconButton
            onClick={() => setPickerOpen((v) => !v)}
          >
            <MoodIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
