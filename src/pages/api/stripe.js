import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const params = {
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        // shipping_options: [
        //   // { shipping_rate: 'shr_1L4pafH6oGDppJjV9MrYC7z0' },
        //   // { shipping_rate: 'shr_1L4pn4H6oGDppJjVBL7vPTk1' },
        // ],
        line_items: req.body.map(item => {
          const img = item.metadata.image.imgix_url

          return {
            price_data: {
              currency: 'inr',
              product_data: {
                name: item.title,
                images: [img],
              },
              unit_amount: Math.max(item.metadata.price * 100, 45),
            },
            adjustable_quantity: {
              enabled: false,
              // minimum: 1,
            },
            quantity: item.metadata.count,
          }
        }),
        success_url: `${req.headers.origin}/qr_code?item_slug=${req.body.map(item =>item.title)}&image=${req.body.map(item =>item.metadata.image.imgix_url)}&slug=${req.body.map(item =>item.slug)}&quantity=${req.body.map(item =>item.metadata.count)}`,
        cancel_url: `${req.headers.origin}/`,
      }
      console.log('params', params) 

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params)

      res.status(200).json(session)
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message)
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
