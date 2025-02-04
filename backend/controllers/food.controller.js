import foodModel from "../models/food.model.js";
import fs from "fs";

const addFood = async (req, res) => {
  const image_url = req.file.path;

  const food = new foodModel({
    available: req.body.available,
    veg: req.body.veg,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_url,
  });

  try {
    await food.save();
    res.json({ success: true, message: "Food added." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding Food." });
  }
};

const getFoods = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error loading food datas." });
  }
};

const getFoodById = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    if (food) {
      res.json({ success: true, data: food });
    } else {
      res.json({ success: false, message: "No food details found." });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error loading food data." });
  }
};

const updateFoodStatus = async (req, res) => {
  const foodId = req.params.id;

  try {
    const food = await foodModel.findById(foodId);

    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found." });
    }

    food.name = req.body.name;
    food.price = req.body.price;
    food.available = req.body.available;

    await food.save();

    res.json({ success: true, message: "Food status updated." });
  } catch (error) {
    console.error("Error updating food status:", error);
    res.status(500).json({ success: false, message: "Error updating food price." });
  }
};

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food removed." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error deleting Food." });
  }
};

export { addFood, getFoodById, getFoods, removeFood, updateFoodStatus };
