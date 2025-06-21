import {Avatar, IconButton, InputAdornment, Menu, MenuItem, TextField} from "@mui/material";
import {getChatName, getInitialsFromName} from "../utils/Utils";
import React, {useEffect, useRef, useState} from "react";
import {ChatDTO} from "../../redux/chat/ChatModel";
import {UserDTO} from "../../redux/auth/AuthModel";
import styles from './MesaggePage.module.scss';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import {MessageDTO} from "../../redux/message/MessageModel";
import MessageCard from "../messageCard/MessageCard";
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from "@mui/icons-material/Clear";
import {AppDispatch} from "../../redux/Store";
import {useDispatch} from "react-redux";
import {deleteChat} from "../../redux/chat/ChatAction";
import {TOKEN} from "../../config/Config";
import EmojiPicker from "emoji-picker-react";
import MoodIcon from '@mui/icons-material/Mood';
import {EmojiClickData} from "emoji-picker-react/dist/types/exposedTypes";

interface MessagePageProps {
    chat: ChatDTO;
    reqUser: UserDTO | null;
    messages: MessageDTO[];
    newMessage: string;
    setNewMessage: (newMessage: string) => void;
    onSendMessage: () => void;
    setIsShowEditGroupChat: (isShowEditGroupChat: boolean) => void;
    setCurrentChat: (chat: ChatDTO | null) => void;
}

const MessagePage = (props: MessagePageProps) => {

    const [messageQuery, setMessageQuery] = useState<string>("");
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isSearch, setIsSearch] = useState<boolean>(false);
    const [anchor, setAnchor] = useState(null);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
    const lastMessageRef = useRef<null | HTMLDivElement>(null);
    const dispatch: AppDispatch = useDispatch();
    const open = Boolean(anchor);
    const token: string | null = localStorage.getItem(TOKEN);

    useEffect(() => {
        scrollToBottom();
    }, [props]);

    const scrollToBottom = () => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({behavior: "smooth"});
        }
    };

    const onOpenMenu = (e: any) => {
        setAnchor(e.currentTarget);
    };

    const onCloseMenu = () => {
        setAnchor(null);
    };

    const onEditGroupChat = () => {
        onCloseMenu();
        props.setIsShowEditGroupChat(true);
    };

    const onDeleteChat = () => {
        onCloseMenu();
        if (token) {
            dispatch(deleteChat(props.chat.id, token));
            props.setCurrentChat(null);
        }
    };

    const onChangeNewMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsEmojiPickerOpen(false);
        props.setNewMessage(e.target.value);
    };

    const onChangeMessageQuery = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessageQuery(e.target.value.toLowerCase());
    };

    const onChangeSearch = () => {
        setIsSearch(!isSearch);
    };

    const onClearQuery = () => {
        setMessageQuery("");
        setIsSearch(false);
    };

    const getSearchEndAdornment = () => {
        return <InputAdornment position='end'>
            <IconButton onClick={onClearQuery}>
                <ClearIcon/>
            </IconButton>
        </InputAdornment>
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            props.onSendMessage();
        }
    };

    const onOpenEmojiPicker = () => {
        setIsEmojiPickerOpen(true);
    };

    const onCloseEmojiPicker = () => {
        setIsEmojiPickerOpen(false);
    };

    const onEmojiClick = (e: EmojiClickData) => {
        setIsEmojiPickerOpen(false);
        props.setNewMessage(props.newMessage + e.emoji);
    };

    let lastDay = -1;
    let lastMonth = -1;
    let lastYear = -1;

    const getMessageCard = (message: MessageDTO) => {
        const date: Date = new Date(message.timeStamp);
        const isNewDate = lastDay !== date.getDate() || lastMonth !== date.getMonth() || lastYear !== date.getFullYear();
        if (isNewDate) {
            lastDay = date.getDate();
            lastMonth = date.getMonth();
            lastYear = date.getFullYear();
        }
        return <MessageCard message={message} reqUser={props.reqUser} key={message.id} isNewDate={isNewDate}
                            isGroup={props.chat.isGroup}/>
    };

    const canvasRef = useRef<HTMLCanvasElement>(null);
    
        useEffect(() => {
            const canvas = canvasRef.current;
            // Handle null canvas reference
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            // Handle missing context
            if (!ctx) return;
        
            // Add type annotations to function parameters
            const drawBlurredCircle = (x: number, y: number, radius: number) => {
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                gradient.addColorStop(0, 'rgba(40, 167, 69, 0.8)');
                gradient.addColorStop(1, 'rgba(40, 167, 69, 0)');
                
                ctx.save(); // Save current context state
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.filter = 'blur(50px)';
                ctx.fill();
                ctx.restore(); // Restore original state (removes filter)
            };
        
            const renderCircles = () => {
                const width = window.innerWidth;
                const height = window.innerHeight;
                
                // Set canvas dimensions (this automatically clears the canvas)
                canvas.width = width;
                canvas.height = height;
                
                // Draw new circles
                for (let i = 0; i < 5; i++) {
                    const x = Math.random() * width;
                    const y = Math.random() * height;
                    const radius = 100 + Math.random() * 200;
                    drawBlurredCircle(x, y, radius);
                }
            };
        
            const handleResize = () => {
                renderCircles();
            };
        
            // Initial render
            renderCircles();
        
            // Setup resize handler
            window.addEventListener('resize', handleResize);
            
            // Cleanup
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }, []);

    return (
        <div className={styles.outerMessagePageContainer}>
            <canvas 
                ref={canvasRef} 
                className="background-canvas"
                style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1
                }}
            />
            {/*Message Page Header*/}
            <div className={styles.messagePageHeaderContainer}>
                <div className={styles.messagePageInnerHeaderContainer}>
                    <div className={styles.messagePageHeaderNameContainer}>
                        <Avatar sx={{
                            width: '2.5rem',
                            height: '2.5rem',
                            fontSize: '1rem',
                            mr: '0.75rem'
                        }}>
                            {getInitialsFromName(getChatName(props.chat, props.reqUser))}
                        </Avatar>
                        <p>{getChatName(props.chat, props.reqUser)}</p>
                    </div>
                    <div className={styles.messagePageHeaderNameContainer}>
                        {!isSearch &&
                            <IconButton onClick={onChangeSearch}>
                                <SearchIcon/>
                            </IconButton>}
                        {isSearch &&
                            <TextField
                                id='searchMessages'
                                type='text'
                                label='Search for messages ...'
                                size='small'
                                fullWidth
                                value={messageQuery}
                                onChange={onChangeMessageQuery}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <SearchIcon/>
                                        </InputAdornment>
                                    ),
                                    endAdornment: getSearchEndAdornment(),
                                }}
                                InputLabelProps={{
                                    shrink: isFocused || messageQuery.length > 0,
                                    style: {marginLeft: isFocused || messageQuery.length > 0 ? 0 : 30}
                                }}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}/>}
                        <IconButton onClick={onOpenMenu}>
                            <MoreVertIcon/>
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchor}
                            open={open}
                            onClose={onCloseMenu}
                            MenuListProps={{'aria-labelledby': 'basic-button'}}>
                            {props.chat.isGroup && <MenuItem onClick={onEditGroupChat}>Edit Group Chat</MenuItem>}
                            <MenuItem onClick={onDeleteChat}>
                                {props.chat.isGroup ? 'Delete Group Chat' : 'Delete Chat'}
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            </div>

            {/*Message Page Content*/}
            <div className={styles.messageContentContainer} onClick={onCloseEmojiPicker}>
                {messageQuery.length > 0 &&
                    props.messages.filter(x => x.content.toLowerCase().includes(messageQuery))
                        .map(message => getMessageCard(message))}
                {messageQuery.length === 0 &&
                    props.messages.map(message => getMessageCard(message))}
                <div ref={lastMessageRef}></div>
            </div>

            {/*Message Page Footer*/}
            <div className={styles.footerContainer}>
                {isEmojiPickerOpen ?
                    <div className={styles.emojiOuterContainer}>
                        <div className={styles.emojiContainer}>
                            <EmojiPicker onEmojiClick={onEmojiClick} searchDisabled={true} skinTonesDisabled={true}/>
                        </div>
                    </div> :
                    <div className={styles.emojiButton}>
                        <IconButton onClick={onOpenEmojiPicker}>
                            <MoodIcon/>
                        </IconButton>
                    </div>}
                <div className={styles.innerFooterContainer}>
                    <TextField
                        id='newMessage'
                        type='text'
                        label='Enter new message ...'
                        size='small'
                        onKeyDown={onKeyDown}
                        fullWidth
                        value={props.newMessage}
                        onChange={onChangeNewMessage}
                        sx={{backgroundColor: 'white'}}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton onClick={props.onSendMessage}>
                                        <SendIcon/>
                                    </IconButton>
                                </InputAdornment>),
                        }}/>
                </div>
            </div>
        </div>
    );
};

export default MessagePage;