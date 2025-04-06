import cookies from 'js-cookie'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const ItemPurchaseTracker = () => {
  const { query, asPath } = useRouter()
  const { item_slug, image } = query

  useEffect(() => {
    // Check if the current page has an item_slug and image parameter
    if (item_slug && image) {
      // Get the existing list of purchased items from a cookie
      let purchasedItems = cookies.get('purchasedItems')
        ? JSON.parse(cookies.get('purchasedItems'))
        : []

      // Check if the current item has already been purchased
      const existingItem = purchasedItems.find(item => item.slug === item_slug)
      if (!existingItem) {
        // Add the current item to the list of purchased items
        purchasedItems.push({ slug: item_slug, image })
        cookies.set('purchasedItems', JSON.stringify(purchasedItems))
      }
    }
  }, [item_slug, image])

  return null // This component doesn't render anything, it just tracks purchases
}

export default ItemPurchaseTracker
