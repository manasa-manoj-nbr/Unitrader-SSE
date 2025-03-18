import { createBucketClient } from '@cosmicjs/sdk'

const cosmic = createBucketClient({
  bucketSlug: process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG,
  readKey: process.env.NEXT_PUBLIC_COSMIC_READ_KEY,
})

const is404 = error => /not found/i.test(error?.message)

// new versions
export async function getDataByCategory(id) {
  const query = {
    'metadata.categories': [`${id}`],
    type: 'products',
  }

  try {
    const data = await cosmic.objects
      .find(query)
      .props('title,slug,id,metadata,created_at')
      .depth(1)
    return data.objects
  } catch (error) {
    if (is404(error)) return
  }
}

export async function getAllDataByType(dataType = 'categories') {
  try {
    const data = await cosmic.objects
      .find({ type: dataType })
      .props('title,slug,id,metadata')
      .depth(1)
    console.log(data)
    return data.objects
  } catch (error) {
    // Don't throw if an slug doesn't exist
    if (is404(error)) return
    throw error
  }
}

export async function getDataBySlug(slug) {
  try {
    const data = await cosmic.objects
      .find({
        slug,
        type: 'products',
      })
      .props('title,slug,id,metadata,created_at')
      .depth(1)
    // console.log(data.objects[0].metadata.seller);

    return data.objects
  } catch (error) {
    // Don't throw if an slug doesn't exist
    if (is404(error)) return
    throw error
  }
}

export async function getDataByRoll(roll) {
  const query = {
    // 'metadata.seller': roll,
    type: 'products',
  }
  try {
    const data = await cosmic.objects
      .find(query)
      .props('title,metadata.image,metadata.seller')
      .depth(1)
    console.log(
      data.objects.filter(
        n => n.metadata?.seller?.toLowerCase() === roll.toLowerCase()
      )
    )
    return data.objects.filter(
      n => n.metadata?.seller?.toLowerCase() === roll.toLowerCase()
    )
  } catch (error) {
    console.log('custom error', error)
    if (is404(error)) return
    throw error
  }
}
