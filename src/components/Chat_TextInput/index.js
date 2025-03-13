const Chat_TextInput = ({ value, onChange, placeholder, className = '' }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border p-2 rounded-md w-full ${className}`}
    />
  )
}

export default Chat_TextInput
