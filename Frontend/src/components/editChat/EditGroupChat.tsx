import React, { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../redux/Store";
import { useDispatch, useSelector } from "react-redux";
import { TOKEN } from "../../config/Config";
import { UserDTO } from "../../redux/auth/AuthModel";
import { searchUser } from "../../redux/auth/AuthAction";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import styles from "./EditGroupChat.module.scss";
import GroupMember from "./GroupMember";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { ChatDTO } from "../../redux/chat/ChatModel";
import { addUserToGroupChat, removeUserFromGroupChat } from "../../redux/chat/ChatAction";

interface EditGroupChatProps {
  setIsShowEditGroupChat: (show: boolean) => void;
  currentChat: ChatDTO | null;
}

const EditGroupChat: React.FC<EditGroupChatProps> = ({
  setIsShowEditGroupChat,
  currentChat,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const token = localStorage.getItem(TOKEN) ?? "";

  const currentUser = useSelector((state: RootState) => state.auth.reqUser) as UserDTO | null;
  const searchUsers = useSelector((state: RootState) => state.auth.searchUser) || [];
  const [userQuery, setUserQuery] = useState<string>("");
  const [focused, setFocused] = useState<boolean>(false);

  useEffect(() => {
    if (token && userQuery.trim()) {
      dispatch(searchUser(userQuery.trim(), token));
    }
  }, [userQuery, token, dispatch]);

  if (!currentChat || !currentUser) {
    return null;
  }

  const isCreator = currentUser.id === currentChat.createdBy.id;

  const onRemoveMember = (u: UserDTO) => {
    if (u.id === currentUser.id) return;
    dispatch(removeUserFromGroupChat(currentChat.id, u.id, token));
  };
  const onAddMember = (u: UserDTO) => {
    dispatch(addUserToGroupChat(currentChat.id, u.id, token));
  };

  return (
    <div className={styles.outerEditGroupChatContainer}>
      <div className={styles.editGroupChatNavContainer}>
        <IconButton onClick={() => setIsShowEditGroupChat(false)}>
          <WestIcon fontSize="medium" />
        </IconButton>
        <h2>Edit Group Chat</h2>
      </div>

      <p className={styles.editGroupChatText}>Remove user</p>
      <div className={styles.editGroupChatUserContainer}>
        {currentChat.users.map((u) => (
          <GroupMember
            key={u.id}
            member={u}
            onRemoveMember={isCreator && u.id !== currentUser.id ? onRemoveMember : undefined}
          />
        ))}
      </div>

      <p className={styles.editGroupChatText}>Add user</p>
      <div className={styles.editGroupChatTextField}>
        <TextField
          fullWidth
          size="small"
          label="Search user..."
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          sx={{ backgroundColor: "white" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: userQuery && (
              <InputAdornment position="end">
                <IconButton onClick={() => setUserQuery("")}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            shrink: focused || Boolean(userQuery),
            style: { marginLeft: focused || userQuery ? 0 : 30 },
          }}
        />
      </div>

      {isCreator && (
        <div className={styles.editGroupChatUserContainer}>
          {searchUsers
            .filter((u) => !currentChat.users.some((ex) => ex.id === u.id))
            .map((u) => (
              <GroupMember key={u.id} member={u} onAddMember={onAddMember} />
            ))}
        </div>
      )}
    </div>
  );
};

export default EditGroupChat;
