import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import userRoute from '../routes/user.js';
import hospitalRoute from '../routes/hospital.js';

const port = 3000


const app = new Hono().basePath("/api");

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/user', userRoute)
app.route('/hospitals', hospitalRoute)

console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
