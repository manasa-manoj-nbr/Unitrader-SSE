import { createBucketClient } from '@cosmicjs/sdk'
import formidable from 'formidable'
import fs from 'fs'

const cosmic = createBucketClient({
  bucketSlug: process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG,
  readKey: process.env.NEXT_PUBLIC_COSMIC_READ_KEY,
  writeKey: process.env.NEXT_PUBLIC_COSMIC_WRITE_KEY,
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function uploadHandler(req, res) {
  const form = formidable({})

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing the form:', err)
      return res.status(500).json({ error: 'Error parsing the form' })
    }
    try {
      const cosmicRes = await saveFile(files.file[0])
      return res.status(200).json(cosmicRes)
    } catch (error) {
      console.error('Error saving file:', error)
      return res.status(500).json({ error: error.message })
    }
  })
}

const saveFile = async file => {
  const filedata = fs.readFileSync(file?.filepath)
  const media = {
    originalname: file.originalFilename,
    buffer: filedata,
  }
  try {
    // Add media to Cosmic Bucket
    const cosmicRes = await cosmic.media.insertOne({ media })
    // Delete the temporary file after uploading
    fs.unlinkSync(file?.filepath)
    return cosmicRes
  } catch (error) {
    console.error('Cosmic insert error:', error)
    throw error
  }
}
