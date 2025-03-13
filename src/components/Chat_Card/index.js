const Chat_Card = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`bg-white p-4 rounded-lg shadow-md ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Chat_Card
