import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { db } from '../../lib/firebase'
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import styles from './chat.module.sass'

function LoadingScreen() {
  return <div className={styles.loadingScreen}>Loading chats...</div>
}

export default function ChatWindow() {
  const router = useRouter()
  const didOpenRef = useRef(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [isLoadingScreenActive, setIsLoadingScreenActive] = useState(true)
  const [chats, setChats] = useState([])
  const [activeChatId, setActiveChatId] = useState(null)
  const [messageInput, setMessageInput] = useState('')
  const [loading, setLoading] = useState(true)

  // Force reload if "Loading chats..." is still displayed after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (document.body.innerText.includes('Loading chats...')) {
        window.location.reload()
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!router.isReady) return <LoadingScreen />

  const { name: rawItemName } = router.query

  // Firestore Snapshot Listener
  useEffect(() => {
    console.log('Starting snapshot session')
    const unsubscribe = onSnapshot(collection(db, 'chats'), snapshot => {
      const chatData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      console.log('Fetched chats:', chatData)
      setChats(chatData)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Ensure the loading screen stays for at least 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingScreenActive(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Open or create chat when rawItemName is available, loading is done, and minimum loading time has passed
  useEffect(() => {
    if (!rawItemName || loading || isLoadingScreenActive) return
    if (!didOpenRef.current) {
      didOpenRef.current = true
      openChatForItem(rawItemName)
    }
  }, [rawItemName, loading, isLoadingScreenActive])

  const openChatForItem = async itemName => {
    if (!itemName) return
    const normalizedName = itemName.trim().toLowerCase()
    const q = query(
      collection(db, 'chats'),
      where('name', '==', itemName.trim())
    )
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      console.log('Chat exists. Opening existing chat.')
      setActiveChatId(querySnapshot.docs[0].id)
    } else {
      console.log('No chat found. Creating new chat.')
      const newChatRef = doc(collection(db, 'chats'))
      await setDoc(newChatRef, {
        name: itemName.trim(),
        participants: ['Me', itemName.trim()],
        messages: [],
        profilePic: '/default-avatar.png',
      })
      setActiveChatId(newChatRef.id)
    }
  }

  if (loading || isLoadingScreenActive) return <LoadingScreen />

  const activeChat = chats.find(chat => chat.id === activeChatId) || {
    name: '',
    participants: [],
    messages: [],
  }

  const getLastMessage = chat => {
    if (chat.messages && chat.messages.length > 0) {
      const lastMsg = chat.messages[chat.messages.length - 1]
      return `${lastMsg.user}: ${lastMsg.text}`
    }
    return 'No messages'
  }

  const handleSend = async () => {
    if (!messageInput.trim() || !activeChatId) return
    const newMessage = {
      user: 'Me',
      text: messageInput,
      side: 'right',
    }
    try {
      const chatRef = doc(db, 'chats', activeChatId)
      await updateDoc(chatRef, {
        messages: arrayUnion(newMessage),
      })
    } catch (error) {
      console.error('Error sending message:', error)
    }
    setMessageInput('')
  }

  return (
    <div className={styles.pageContainer}>
      {/* TOP NAV BAR */}
      <header className={styles.navbar}>
        <div className={styles.navbarLeft}>
          <div className={styles.logo}>
            <Image
              src="/images/content/logo.png"
              alt="UniTrader Logo"
              width={150}
              height={50}
              priority
            />
          </div>
          <nav className={styles.navLinks}>
            <a href="/search?category=&color=Any+mode">Find Products</a>
            <a href="/upload-details">Sell Items</a>
            <a href="#" className={styles.activeLink}>
              Chat
            </a>
          </nav>
        </div>
        <div className={styles.navbarRight}>
          <div className={styles.toggleTheme}>Theme Toggle</div>
          <div className={styles.username}>username</div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className={styles.chatContainer}>
        {/* LEFT SIDEBAR */}
        <div
          className={`${styles.leftSidebar} ${
            sidebarExpanded ? styles.expanded : styles.collapsed
          }`}
        >
          <div className={styles.sidebarToggle}>
            <button
              className={styles.sidebarToggleButton}
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
            >
              {sidebarExpanded ? '←' : '→'}
            </button>
          </div>
          <div className={styles.searchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="chats..."
            />
          </div>
          <div className={styles.chatList}>
            {chats.map(chat => (
              <div
                key={chat.id}
                className={`${styles.chatListItem} ${
                  chat.id === activeChatId ? styles.activeChat : ''
                }`}
                onClick={() => setActiveChatId(chat.id)}
              >
                <div className={styles.profilePic}>
                  <Image
                    src={chat.profilePic || '/default-avatar.png'}
                    alt="Avatar"
                    width={40}
                    height={40}
                    className={styles.avatar}
                  />
                </div>
                <div className={styles.chatListContent}>
                  <div className={styles.chatListName}>{chat.name}</div>
                  <div className={styles.chatListMsg}>
                    {getLastMessage(chat)}
                  </div>
                </div>
                <div className={styles.chatListTime}>10:25am</div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CHAT VIEW */}
        <div className={styles.mainChatArea}>
          <div className={styles.mainChatHeader}>
            <div className={styles.chatUserInfo}>
              <div className={styles.chatUserName}>
                {chats.find(c => c.id === activeChatId)?.name ||
                  'Select a chat'}
              </div>
            </div>
          </div>
          <div className={styles.messagesArea}>
            {chats
              .find(c => c.id === activeChatId)
              ?.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`${styles.messageRow} ${
                    msg.side === 'right'
                      ? styles.messageRowRight
                      : styles.messageRowLeft
                  }`}
                >
                  <div className={styles.messageBubble}>
                    <div className={styles.messageUser}>{msg.user}</div>
                    <div className={styles.messageText}>{msg.text}</div>
                  </div>
                </div>
              ))}
          </div>
          <div className={styles.chatFooter}>
            <button
              className={styles.footerIcon}
              onClick={() => alert('Open emoji panel')}
            >
              😊
            </button>
            <button
              className={styles.footerIcon}
              onClick={() => alert('Attach file')}
            >
              📎
            </button>
            <textarea
              className={styles.footerInput}
              placeholder="Type a message..."
              rows={1}
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
            />
            {messageInput.trim().length === 0 ? (
              <button
                className={styles.footerIcon}
                onClick={() => alert('Start voice recording')}
              >
                🎤
              </button>
            ) : (
              <button className={styles.footerIcon} onClick={handleSend}>
                ➤
              </button>
            )}
          </div>
        </div>
      </div>

      <footer className={styles.pageFooter}>© 2025 UniTrader</footer>
    </div>
  )
}
