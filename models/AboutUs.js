// models/AboutUs.js
const mongoose = require("mongoose");
const {
  readItem,
  readItems,
  createItem,
  updateItem,
  deleteItem,
} = require("../config/database");
const { Schema } = mongoose;

const FeatureSchema = new Schema({
  number: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const StepSchema = new Schema({
  icon: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const CategoryFeatureSchema = new Schema({
  icon: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const CTASchema = new Schema({
  text: { type: String, required: true },
  link: { type: String, required: true },
});

const ImagesSchema = new Schema({
  image: { type: String },
});

const AboutUsSchema = new Schema(
  {
    introSection: {
      label: { type: String, required: true },
      title: { type: String, required: true },
      content: { type: String, required: true },
    },
    features: [FeatureSchema],
    quoteBanner: {
      quoteText: { type: String, required: true },
      author: { type: String, required: true },
      backgroundImage: { type: String },
    },
    varietyOptionsSection: {
      label: { type: String },
      title: { type: String },
      content: { type: String },
      images: [ImagesSchema],
      ctaButton: CTASchema,
    },
    howItWorksSection: {
      label: { type: String },
      title: { type: String },
      image: { type: String },
      steps: [StepSchema],
    },
    categoriesSection: {
      features: [CategoryFeatureSchema],
      images: [String],
    },
    subscribeSection: {
      title: { type: String },
      description: { type: String },
    },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      metaKeywords: { type: String },
      ogImage: { type: String },
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    lastModified: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const AboutUsModel =
  mongoose.models.AboutUs || mongoose.model("AboutUs", AboutUsSchema);

class AboutUsService {
  constructor(model = AboutUsModel) {
    this.model = model;
  }

  async getAbout() {
    try {
      const result = await readItem(this.model);
      return {
        success: true,
        data: result,
        message: "About Us retrieved successfully",
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getAdminAbout() {
    try {
      const result = await readItems(this.model);
      return {
        success: true,
        data: result,
        message: "About Us retrieved successfully",
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateAbout(data, id) {
    try {
      const filter = { _id: id };
      const result = await updateItem(this.model, data, filter, { new: true });
      return { success: true, data: result, message: "Update successful" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = { AboutUsService, AboutUsModel };
