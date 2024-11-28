import { Hono } from "hono";
import { getDb } from "../utils/mongodb.js";
import { ObjectId } from "mongodb";

const hospital = new Hono();

hospital.get('/', async (c) => {
    // Logic to get all hospitals
    const db = await getDb();
    const hospitals = db.collection('hospitals');
    const data = await hospitals.find().toArray();
    if (data.length == 0) return c.json({ message: 'No hospitals found' });
    return c.json(data);
});

hospital.post('/', async (c) => {
    // Logic to create a new hospital
    const db = await getDb();
    const hospitals = db.collection('hospitals');
    try {
        const body = await c.req.json();
        const findMatch = await hospitals.findOne({ name: body.name });
        if (findMatch) {
            return c.json({ message: 'Hospital already exists', _id: findMatch._id });
        } else {
            const data = await hospitals.insertOne({ ...body, createdAt: new Date(), updatedAt: new Date() });
            return c.json({ message: 'Created a new hospital', data });
        }
    } catch (error) {
        return c.json({ message: 'Error creating hospital', error }, 500);
    }
});

hospital.put('/:id', async (c) => {
    // Logic to update a hospital by ID
    const db = await getDb();
    const hospitals = db.collection('hospitals');
    try {
        const idString = c.req.param('id');
        const _id = new ObjectId(idString);
        const body = await c.req.json();

        const updated = await hospitals.findOneAndUpdate(
            { _id: _id },
            { $set: { ...body, updatedAt: new Date() } },
            { returnDocument: 'after' });
        if (!updated) return c.json({ message: 'Hospital not found' }, 404);
        return c.json(updated);
    } catch (error) {
        return c.json({ message: 'Error creating hospital', error });
    }
});

hospital.delete('/:id', async (c) => {
    // Logic to delete a hospital by ID
    const db = await getDb();
    const hospitals = db.collection('hospitals');
    try {
        const idString = c.req.param('id');
        const _id = new ObjectId(idString);
        const body = await c.req.json();
        const findMatch = await hospitals.findOneAndDelete({ _id: _id });
        if (!findMatch) return c.json({ message: 'Hospital not found' }, 404);
        return c.json({ message: `Deleted hospital with ID ${c.req.param('id')}` });
    } catch (error) {
        return c.json({ message: 'Error deleting hospital', error });
    }
});

export default hospital;