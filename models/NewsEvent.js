const mongoose = require("mongoose");
const {
  readItem,
  readItems,
  readItemById,
  createItem,
  updateItem,
  deleteItem,
} = require("../config/database");
const { Schema } = mongoose;

const slug = require("slug");

const NewsEventSchema = new Schema(
  {
    basicInfo: {
      title: {
        type: String,
        required: [true],
        trim: true,
        unique: true,
      },
      slug: {
        type: String,
        trim: true,
        lowercase: true,
        index: true,
      },
      featuredImage: {
        type: String,
        required: true,
      },
      teaser: {
        type: String,
        maxlength: [300],
        trim: true,
      },
      content: {
        type: String,
        required: [true],
      },
    },
    categorization: {
      category: {
        type: String,
        enum: ["news", "event", "story", "announcement"],
        default: "news",
        required: true,
      },
      tags: [{ type: String, trim: true }],
    },

    author: {
      name: { type: String, trim: true },
      email: { type: String, trim: true },
    },

    publishDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    featured: { type: Boolean, default: true },

    views: { type: Number, default: 0 },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      metaKeywords: { type: String },
      ogImage: { type: String },
    },
  },
  {
    timestamps: true,
  }
);
NewsEventSchema.pre("save", function (next) {
  if (this.isModified("basicInfo.title") || this.isNew) {
    let rawSlug = slug(this.basicInfo.title, {
      lower: true,
      strict: false,
      locale: "en",
    });
    this.basicInfo.slug = rawSlug
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");
  }
  next();
});

const NewsEventModel =
  mongoose.models.NewsEvent || mongoose.model("NewsEvent", NewsEventSchema);

class NewsEventService {
  constructor(model = NewsEventModel) {
    this.model = model;
  }

  async getNews(id) {
    try {
      const data = await readItemById(this.model, id);

      return {
        success: true,
        data,
        message: "News fetched successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getNewsList({ page = 1, limit = 10, category = null } = {}) {
    try {
      const filter = { status: "published" };
      if (category) filter["categorization.category"] = category;
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        readItems(this.model, filter, null, {
          sort: { publishDate: -1 },
          skip,
          limit,
        }),
        this.model.countDocuments(filter),
      ]);
      const totalPages = Math.ceil(total / limit);
      return {
        success: true,
        data,
        total,
        totalPages,
        currentPage: page,
        message: "News list fetched successfully",
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getNewsDetail(slug) {
    try {
      const data = await readItem(
        this.model,
        { slug, status: "published" },
        { $inc: { views: 1 } },
        { new: true }
      );

      if (!data) {
        return { success: false, message: "News not found" };
      }
      return {
        success: true,
        data,
        message: "News fetched successfully",
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getAdminNewsList() {
    try {
      const data = await readItems(this.model, {}, null, {
        sort: { createdAt: -1 },
      });

      return {
        success: true,
        data,
        message: "Admin news list fetched successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async createNews(data) {
    try {
      const result = await createItem(this.model, data);
      return {
        success: true,
        data: result,
        message: "News created successfully",
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateNews(id, data) {
    try {
      const result = await updateItem(this.model, data, { _id: id });
      return {
        success: true,
        data: result,
        message: "News updated successfully",
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async deleteNews(id) {
    try {
      await deleteItem(this.model, id);
      return { success: true, message: "News deleted successfully" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = { NewsEventService, NewsEventModel };
