const mongoose = require("mongoose");
const {
  readItem,
  createItem,
  updateItem,
  deleteItem,
} = require("../config/database");
const redisClient = require("../config/redis");
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
      news: {
        type: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "NewsEvent",
            required: true,
          },
        ],
        validate: {
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
    this.DRAFT_KEY = "homepage:draft";
  }

  async getHomepage(query = {}) {
    try {
      const result = await readItem(this.model, query);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getHomepageForAdmin() {
    try {
      const draftData = await redisClient.get("homepage:draft");
      if (draftData) {
        return {
          success: true,
          data: JSON.parse(draftData),
          isDraft: true,
        };
      }
      const originalData = await this.model.findOne({ parentId: null });
      return {
        success: true,
        data: originalData || {},
        isDraft: false,
      };
    } catch (error) {
      throw new Error("Error fetch data: " + error.message);
    }
  }

  async updateHomepage(data) {
    try {
      await redisClient.set(this.DRAFT_KEY, JSON.stringify(data));

      return {
        success: true,
        data: data,
        message: "Đã lưu bản nháp vào bộ nhớ tạm (Redis) thành công",
      };
    } catch (error) {
      console.error("Redis Save Error:", error);
      return {
        success: false,
        message: "Lỗi lưu bộ nhớ tạm: " + error.message,
      };
    }
  }

  async publishHomepage() {
    try {
      // 1. Lấy dữ liệu nháp mới nhất từ Redis
      const draftData = await redisClient.get(this.DRAFT_KEY);

      if (!draftData) {
        return {
          success: false,
          message: "Không tìm thấy bản nháp trong bộ nhớ tạm để xuất bản.",
        };
      }

      const dataToPublish = JSON.parse(draftData);
      dataToPublish.statusTracking = { status: "published" };
      dataToPublish.lastModified = new Date();

      const result = await this.model.findOneAndUpdate({}, dataToPublish, {
        new: true,
        upsert: true,
        runValidators: true, // Đảm bảo validation tối đa 3 tin tức vẫn hoạt động
      });

      // 4. Xóa bản nháp trong Redis sau khi đã Publish thành công
      await redisClient.del(this.DRAFT_KEY);

      return {
        success: true,
        data: result,
        message: "Dữ liệu đã được cập nhật chính thức lên trang chủ!",
      };
    } catch (error) {
      console.error("Publish Error:", error);
      return {
        success: false,
        message: "Lỗi khi xuất bản: " + error.message,
      };
    }
  }
}

module.exports = {
  HomepageModel,
  HomepageService,
};
