import { useEffect, useState } from 'react'
import {
  MessageHeaderConfiguration,
  UIKitSettingsBuilder,
  MessageListConfiguration,
} from '@cometchat/uikit-shared'
import { CometChatUIKit } from '@cometchat/chat-uikit-react'
import {
  CometChatConversationsWithMessages,
  ConversationsConfiguration,
  MessagesConfiguration,
  MessageComposerConfiguration,
  ConversationsStyle,
  MessagesStyle,
} from '@cometchat/chat-uikit-react'
import { CometChat } from '@cometchat/chat-sdk-javascript'
import { APP_ID, AUTH_KEY, REGION } from '../../utils/constants/appConstants'
import { useStateContext } from '../../utils/context/StateContext'

function CometChatNoSSR() {
  const urlParams = new URLSearchParams(window.location.search)
  const name = urlParams.get('name')
  const profilePic = urlParams.get('pic') || 'https://via.placeholder.com/150'

  const [user, setUser] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const { cosmicUser } = useStateContext()


  const sendDefaultMessage = async receiverId => {
    try {
      console.log('Sending default message')
      const textMessage = new CometChat.TextMessage(
        receiverId,
        'Hey there! I am interested in the item you are selling and wanted to know more about it.',
        CometChat.RECEIVER_TYPE.USER
      )

      await CometChat.sendMessage(textMessage)
      console.log('Default message sent successfully')
    } catch (error) {
      console.error('Error sending default message:', error)
    }
  }

  useEffect(() => {
    let isMounted = true

    const initializeChat = async () => {
      if (isInitialized) return

      const UIKitSettings = new UIKitSettingsBuilder()
        .setAppId(APP_ID)
        .setRegion(REGION)
        .setAuthKey(AUTH_KEY)
        .subscribePresenceForAllUsers()
        .build()

      try {
        await CometChatUIKit.init(UIKitSettings)
        if (!isMounted) return
        console.log('Initialization completed successfully')
        setIsInitialized(true)

        const loggedInUser = await CometChatUIKit.getLoggedinUser()

        const UserId = cosmicUser["first_name"] === 'Sanjay'? 'commetchat-uid-1' : 'scientific-calculator'

        if (!loggedInUser && isMounted) {
          const user = await CometChatUIKit.login(UserId, AUTH_KEY)
          console.log('Login Successful', { user })
          setUser(user)
        } else if (isMounted) {
          console.log('Already logged-in', { loggedInUser })
          setUser(loggedInUser)
        }

        // Handle the user from URL parameter
        if (name && isMounted) {
          const uid = name.toLowerCase().trim().replace(/\s/g, '-')
          try {
            const targetUser = await CometChat.getUser(uid)
            console.log('User found:', targetUser)
            setSelectedUser(targetUser)
          } catch (error) {
            console.log('User not found, creating new user')

            const user = new CometChat.User(uid)
            user.setName(name)
            user.setAvatar(profilePic)

            const createdUser = await CometChat.createUser(user, AUTH_KEY)
            console.log('New user created:', createdUser)
            setSelectedUser(createdUser)
            // Send default message to create a conversation
            await sendDefaultMessage(createdUser.getUid())
            if (isMounted) {
            }
          }
        }
      } catch (error) {
        console.error('Initialization or user handling error:', error)
      }
    }

    initializeChat()

    return () => {
      isMounted = false
      // CometChat.logout().then(
      //   () => {
      //     console.log('Logout completed successfully')
      //   },
      //   error => {
      //     console.log('Logout failed with exception:', { error })
      //   }
      // )
    }
  }, [name, isInitialized, profilePic])

  const validateMessage = message => {}

  const conversationsStyle = new ConversationsStyle({
    width: '100%',
    height: 'calc(100vh - 88px)',
    background: 'white',
    borderRadius: '0',
    border: 'none',
  })

  const messagesStyle = new MessagesStyle({
    background: 'transparent',
    height: 'calc(100vh - 88px)',
  })

  // Using the standard conversations request builder
  const conversationsRequestBuilder =
    new CometChat.ConversationsRequestBuilder()
      .setConversationType('user')
      .setLimit(30)

  return user ? (
    <div className="relative h-[600px]">
      <CometChatConversationsWithMessages
        conversationsConfiguration={
          new ConversationsConfiguration({
            conversationsStyle: conversationsStyle,
            conversationsRequestBuilder: conversationsRequestBuilder,
            menu: [],
          })
        }
        messagesConfiguration={
          new MessagesConfiguration({
            messagesStyle: messagesStyle,
            messageHeaderConfiguration: new MessageHeaderConfiguration({
              menu: () => {
                return <></>
              },
            }),
            messageListConfiguration: new MessageListConfiguration({
              templates: [],
              emptyStateView: () => {
                return <div>Your Custom Title</div>
              },
            }),
            messageComposerConfiguration: new MessageComposerConfiguration({
              hideLiveReaction: true,
              hideVoiceRecording: true,
              disableSoundForMessages: true,
              hideLayoutMode: true,
              auxilaryButtonView: () => <></>,
              secondaryButtonView: () => <></>,
              // onSendButtonClick: validateMessage,
            }),
          })
        }
      />
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">Loading...</div>
  )
}

export default CometChatNoSSR
