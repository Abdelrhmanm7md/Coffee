import { coffeeModel} from "../../../database/models/coffee.model.js";
import ApiFeature from "../../utils/apiFeature.js";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";
import { photoUpload, removeFile } from "../../utils/removeFiles.js";

const createCoffee = catchAsync(async (req, res, next) => {
  req.body.store = JSON.parse(req.body.store);
  let gallery = photoUpload(req, "gallery", "images");
  let pic = photoUpload(req, "pic", "images");
  pic = pic[0].replace(`http://localhost:8000/`, "");
  // http://147.93.89.1:8000/
  req.body.pic = pic;
  req.body.gallery = gallery.map((pic) =>
    pic.replace(`http://localhost:8000/`, "")
  );
  let newCoffee = new coffeeModel(req.body);
  let addedCoffee = await newCoffee.save({ context: { query: req.query } });

  res.status(201).json({
    message: "Coffee has been created successfully!",
    addedCoffee,
  });
});

const getAllCoffee = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(coffeeModel.find(), req.query);
  // .pagination()
  // .filter()
  // .sort()
  // .search()
  // .fields();
  !ApiFeat && res.status(404).json({ message: "No Coffee was found!" });

  let results = await ApiFeat.mongooseQuery;
  res.json({ message: "Done", results });
});

const getCoffeeById = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let Coffee = await coffeeModel.findById(id);

  if (!Coffee) {
    return res.status(404).json({ message: "Coffee not found!" });
  }

  res.status(200).json({ message: "Done", Coffee });
});

const updateCoffee = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedCoffee = await coffeeModel.findByIdAndUpdate(id, req.body, { new: true });

  if (!updatedCoffee) {
    return res
      .status(404)
      .json({ message: "Couldn't update! Coffee not found!" });
  }

  res
    .status(200)
    .json({ message: "Coffee updated successfully!", updatedCoffee });
});
const updatePhotos = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let check = await coffeeModel.findById(id);
  let err_1 = "Coffee not found!";
  let err_2 = "Couldn't update! Invalid indices!";
  let message = "Coffee files updated successfully!";
  let updates = {};
  let updatedPhotos = {};
  let pic = null;

  // Language localization
  if (req.query.lang === "ar") {
    err_1 = "المنتج غير موجود";
    err_2 = "لم يتم التحديث! البيانات غير صحيحة!";
    message = "تم تحديث ملفات المنتج بنجاح!";
  }
  if (!check) {
    return res.status(404).json({ message: err_1 });
  }


  // Handling 'pic' upload logic
  if (check.pic === undefined) {
    pic = photoUpload(req, "pic", "images");
    pic = pic[0]?.replace(`http://localhost:8000/`, "");
  }

  if (check.pic !== undefined && req.files && req.files.pic) {
    // Remove old file if a new one is being uploaded
    removeFile("images", check.pic);
    pic = photoUpload(req, "pic", "images");
    pic = pic[0]?.replace(`http://localhost:8000/`, "");
  }

  if (pic) {
    updates.pic = pic; 
  }

  updatedPhotos = await coffeeModel.findByIdAndUpdate(id, updates, {
    new: true, runValidators: true,
  });

  res.status(200).json({ message: message, updatedPhotos });
});


const deleteCoffee = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let deletedCoffee = await coffeeModel.findByIdAndDelete({ _id: id });

  if (!deletedCoffee) {
    return res.status(404).json({ message: "Couldn't delete!  not found!" });
  }

  res.status(200).json({ message: "Coffee deleted successfully!" });
});

export {
  createCoffee,
  getAllCoffee,
  getCoffeeById,
  deleteCoffee,
  updateCoffee,
  updatePhotos,
};
