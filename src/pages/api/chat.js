import { db } from '../../lib/firebase' // Ensure correct path
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Fetch all chats from Firestore
        
      const chatsSnapshot = await getDocs(collection(db, 'chats'))
        console.log('finished')

      console.log("chats :" ,chatsSnapshot)
      const chats = chatsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))

      return res.status(200).json(chats)
    }

    if (req.method === 'POST') {
      // Validate request body
      const { chatId, user, text } = req.body

      if (!chatId || !user || !text) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const chatRef = doc(db, 'chats', chatId)
      await updateDoc(chatRef, {
        messages: arrayUnion({
          user,
          text,
          side: user === 'Me' ? 'right' : 'left',
          timestamp: new Date().toISOString(), // Optional: Add timestamp
        }),
      })

      return res.status(200).json({ message: 'Message sent successfully' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Firestore Error:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
