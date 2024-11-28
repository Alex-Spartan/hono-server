import { Hono } from "hono";
import { getDb } from "../utils/mongodb.js";

const app = new Hono;

app.get('/', async (c) => {
    const db = await getDb();
    const users = await db.collection("users").find().toArray();
    if (users.length <= 0) return c.json({ error: "No users found" });
    return c.json(users);
})


app.post('/', async (c) => {
    try {
      const body = await c.req.json();
      const db = await getDb();
      const user = await db.collection("users").insertOne(body);
      return c.json(user);
    } catch (e) {
      console.error(e);
      return c.json({ error: e });
    }
  })
  
  app.put('/', async (c) => {
    const body = await c.req.json();
    console.log(body.password);
    if (body.password == "abcd") return
    return c.json(body);
  })

  export default app;