import styles from './Button.module.sass'

const Button = ({ children, onClick, className = '', disabled = false }) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
