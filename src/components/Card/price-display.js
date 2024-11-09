import React from 'react'
import { useEffect, useState } from 'react'
import styles from './Card.module.sass'
import cn from 'classnames';

const PriceDisplay = ({ item }) => {
  // Use null as initial state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false)

  // Only run after client-side hydration is complete
  useEffect(() => {
    setMounted(true)
  }, [])

  const isAuction = item?.metadata?.color?.toLowerCase() === 'auction'

  // Return a simple placeholder during SSR
  if (!mounted) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-gray-900 dark:text-gray-100">
          ₹ {item?.metadata?.price}
        </span>
      </div>
    )
  }

  // Full component rendered only on client side
  return (
    <span className={cn(styles.price, 'flex items-center gap-2')}>
      ₹ {item?.metadata?.price} {" "}
      {isAuction && (
        <div className="flex items-center">
          <div className="relative flex items-center">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </div>
          <span className="ml-2 text-red-500 font-medium">LIVE</span>
        </div>
      )}
    </span>
  )
}

export default PriceDisplay
