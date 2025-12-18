const mongoose = require("mongoose");
const {
  readItem,
  createItem,
  updateItem,
  deleteItem,
} = require("../config/database");

const { Schema } = mongoose;

const CtaButtonSchema = new Schema(
  {
    text: { type: String, required: true, trim: true },
    link: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const FeatureItemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String },
  },
  { _id: false }
);

const StatisticItemSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const HomepageSchema = new Schema(
  {
    heroSection: {
      title: { type: String, required: true, trim: true },
      subtitle: { type: String },
      backgroundImage: { type: String, required: true },
      ctaButtons: [CtaButtonSchema],
    },

    visionMissionPhilosophySection: {
      vision: {
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true },
      },
      mission: {
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true },
      },
      philosophy: {
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true },
      },
    },

    whoWeAreSection: {
      title: { type: String, required: true, trim: true },
      content: { type: String, required: true },
    },

    whyChooseLAMSSection: {
      title: { type: String, required: true, trim: true },
      content: { type: String },
      image: { type: String },
      features: [{ type: String, trim: true }],
    },

    accreditationSection: {
      title: { type: String, required: true, trim: true },
      content: { type: String },
      image: { type: String },
      statistics: [StatisticItemSchema],
    },

    featuredNewsSection: {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      // Trường 'news' được định nghĩa là một Object,
      // bên trong nó có cấu hình 'type' (mảng) và 'validate'
      news: {
        type: [
          // Định nghĩa kiểu là một mảng (array)
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "NewsEvent",
            required: true,
          },
        ],
        // Đặt validation ngang hàng với 'type'
        validate: {
          // Lưu ý: nên dùng function(){} thay vì arrow function để có scope this (nếu cần),
          // nhưng arrow function vẫn chấp nhận được trong trường hợp này.
          validator: (arr) => !arr || arr.length <= 3,
          message: "Chỉ có tối đa 3 tin tức nổi bật",
        },
      },
    },
    seoMetaTag: {
      metaTitle: { type: String, trim: true },
      metaDescription: { type: String },
      metaKeywords: [{ type: String, trim: true }],
      ogImage: { type: String },
    },

    statusTracking: {
      status: { type: String, enum: ["draft", "published"] },
    },
  },
  {
    timestamps: { updatedAt: "lastModified" },
  }
);

const HomepageModel =
  mongoose.models.Homepage || mongoose.model("Homepage", HomepageSchema);

class HomepageService {
  constructor(model = HomepageModel) {
    this.model = model;
  }

  async getHomepage(query = {}) {
    try {
      const result = await readItem(this.model, query);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getPublishedHomepage() {
    try {
      const result = await readItem(this.model, {
        "statusTracking.status": "published",
      });
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateHomepage(data, id = null) {
    try {
      const filter = id ? { _id: id } : {};
      const result = await updateItem(this.model, data, filter, { new: true });
      return { success: true, data: result, message: "Update successful" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async publishHomepage() {
    try {
      const result = await updateItem(
        this.model,
        { "statusTracking.status": "published" },
        {}
      );
      return { success: true, data: result, message: "Homepage published" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = {
  HomepageModel,
  HomepageService,
};
