import express from "express";
const coffeeRouter = express.Router();

import * as coffeeController from "./coffee.controller.js";
import { fileSizeLimitErrorHandler, uploadMixFile, } from "../../utils/middleWare/fileUploads.js";

coffeeRouter.post(
  "/",
  uploadMixFile("images", [ { name: "pic" }]),
  fileSizeLimitErrorHandler,
  coffeeController.createCoffee
);
coffeeRouter.get("/", coffeeController.getAllCoffee);
coffeeRouter.get("/:id", coffeeController.getCoffeeById);
coffeeRouter.put("/:id", coffeeController.updateCoffee);
coffeeRouter.put(
  "/photos/:id",
  uploadMixFile("images", [{ name: "pic" }]),
  fileSizeLimitErrorHandler,
  coffeeController.updatePhotos
);
coffeeRouter.delete("/:id", coffeeController.deleteCoffee);

export default coffeeRouter;
