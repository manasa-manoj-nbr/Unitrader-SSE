import dynamic from 'next/dynamic'

const ChatWindow = dynamic(() => import('../components/chat'), { ssr: false })

export default function ChatPage() {
  return <ChatWindow />
}
