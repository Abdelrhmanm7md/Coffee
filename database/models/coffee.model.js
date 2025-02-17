import mongoose from "mongoose";

const coffeeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      default: undefined,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);



coffeeSchema.pre(/^delete/, { document: false, query: true }, async function () {
  const doc = await this.model.findOne(this.getFilter());
  if (doc) {
    doc.pic && removeFile("images", doc.pic);
  }
});

export const coffeeModel = mongoose.model("coffee", coffeeSchema);
