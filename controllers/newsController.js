const { NewsEventService } = require("../models/NewsEvent");

const newsService = new NewsEventService();
class NewsController {
  async news(req, res) {
    res.render("admin/news-list", {
      pageTitle: "News",
    });
  }

  async getNewsList(req, res) {
    try {
      const { page = req.page, limit = req.limit, category = null } = req.query;

      const result = await newsService.getNewsList({
        page: Number(page),
        limit: Number(limit),
        category,
      });
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(200).json({
        success: true,
        news: result.data,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        total: result.total,
        message: "News list fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getNewsDetail(req, res) {
    try {
      const { slug } = req.params;

      const result = await newsService.getNewsDetail(slug);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(200).json({
        success: true,
        data: result.data,
        message: "News detail fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAdminNewsList(req, res) {
    try {
      const result = await newsService.getAdminNewsList();

      if (!result.success) {
        return res.render("admin/news-list", {
          pageTitle: "News & Events",
          data: [],
          error: result.message || "Failed to load news list",
        });
      }

      return res.render("admin/news-list", {
        pageTitle: "News & Events",
        data: result?.data || [],
      });
    } catch (error) {
      return res.render("admin/news-list", {
        pageTitle: "News & Events",
        data: [],
        error: error.message,
      });
    }
  }

  async getNewsForm(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const result = await newsService.getNews(id);
        return res.render("admin/news-form", {
          news: result.data,
          pageTitle: "Edit News",
        });
      } else {
        return res.render("admin/news-form", {
          news: null,
          pageTitle: "Create News",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async createNews(req, res) {
    try {
      const result = await newsService.createNews(req.body);
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(200).json({
        success: true,
        message: "News created successfully",
        data: result.data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateNews(req, res) {
    try {
      const { id } = req.params;
      const body = req.body;

      const updateData = {
        basicInfo: {
          title: body.title,
          slug: body.title,
          teaser: body.teaser,
          content: body.content,
          featuredImage: body.image,
        },

        categorization: {
          category: body.category,
        },

        seo: {
          metaTitle: body.metaTitle,
          metaDescription: body.metaDescription,
        },

        status: body.status,
        publishDate: body.publishDate || new Date(),
        featured: body.featured === "on",
      };

      const result = await newsService.updateNews(id, updateData);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json({
        success: true,
        data: result.data,
        message: "News updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteNews(req, res) {
    try {
      const { id } = req.params;
      const result = await newsService.deleteNews(id);
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(200).json({
        success: true,
        message: "News deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new NewsController();
