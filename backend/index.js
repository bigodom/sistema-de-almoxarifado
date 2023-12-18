// index.js
import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

//filter all items
app.get("/api/items", async (req, res) => {
  const items = await prisma.item.findMany();
  res.json(items);
});

//create item
app.post("/api/items", async (req, res) => {
  const { name } = req.body;
  const { quantityIn } = req.body;
  
  const existItem = await prisma.item.findUnique({ where: { name: name } });

  if (existItem) {
    return res.json({ message: "Item already exist." });
  }
  try {
  await prisma.item.create({
    data: {
      name,
      quantityIn,
      quantityOut: 0,
    },
  });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }

  res.json({ message: "Item created successfully." });
});

//update item quantity in
app.post("/api/items/:id/in", async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  await prisma.item.update({
    where: { id: parseInt(id, 10) },
    data: { quantityIn: quantity },
  });

  res.json({ message: "Quantity in updated successfully." });
});

//update item quantity out
app.post("/api/items/:id/out", async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  await prisma.item.update({
    where: { id: parseInt(id, 10) },
    data: { quantityOut: quantity },
  });

  res.json({ message: "Quantity out updated successfully." });
});

//delete item
app.delete("/api/items/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.item.delete({
    where: { id: parseInt(id, 10) },
  });

  res.json({ message: "Item deleted successfully." });
});

app.post("/api/wardrobe", async (req, res) => {
  const { number } = req.body;
  const { name } = req.body;
  const { situation } = req.body;
  const { date } = req.body;
  
  try {
  await prisma.wardrobe.create({
    data: {
      number,
      name,
      situation,
      date,
    },
  });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }

  res.json({ message: "Item created successfully." });
});

app.get("/api/wardrobes", async (req, res) => {
  const wardrobes = await prisma.wardrobe.findMany();
  res.json(wardrobes);
});

//update wardrobe
app.put("/api/wardrobe/:number", async (req, res) => {
  const { number } = req.params;
  const { name } = req.body;
  const { situation } = req.body;
  const { date } = req.body;

  await prisma.wardrobe.update({
    where: { number: parseInt(number, 10) },
    data: { name, situation, date },
  });

  res.json({ message: "Wardrobe updated successfully." });
});

const api_URL = process.env.API_URL;

app.listen(3000, api_URL, () => {
  console.log("Server is running");
});