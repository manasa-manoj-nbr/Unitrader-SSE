import { createBucketClient } from '@cosmicjs/sdk'

const cosmic = createBucketClient({
  bucketSlug: process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG,
  readKey: process.env.NEXT_PUBLIC_COSMIC_READ_KEY,
  writeKey: process.env.NEXT_PUBLIC_COSMIC_WRITE_KEY,
})

export default async function createHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const {
    title,
    description,
    price,
    count,
    color,
    image,
    categories,
    seller,
    phone_number, // Accept as text
  } = req.body

  const metadata = {
    description,
    price: Number(price),
    count: Number(count),
    color,
    image,
    categories,
    seller,
    phone_number, // store as string
  }

  try {
    const data = await cosmic.objects.insertOne({
      title,
      type: 'products',
      thumbnail: image,
      metadata,
    })
    res.status(200).json(data)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
}
