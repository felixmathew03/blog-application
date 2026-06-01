import Blog from "../models/Blog.js";

// Create Blog
export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        status: false,
        message: "Title and Content are required",
      });
    }

    const imagePath = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : "";

    const blog = await Blog.create({
      title,
      content,
      image: imagePath,
      author: req.user.userId, // from JWT middleware
    });

    res.status(201).json({
      status: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// Get All Blogs (with pagination)
export const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const totalBlogs = await Blog.countDocuments();
    const totalPages = Math.ceil(totalBlogs / limit);

    const blogs = await Blog.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: true,
      count: blogs.length,
      totalBlogs,
      totalPages,
      currentPage: page,
      data: blogs,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// Get Single Blog
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "name email"
    );

    if (!blog) {
      return res.status(404).json({
        status: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      status: true,
      data: blog,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// Update Blog
export const updateBlog = async (req, res) => {
  try {
    const { title, content, image } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        status: false,
        message: "Blog not found",
      });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    
    if (req.file) {
      blog.image = `http://localhost:3000/uploads/${req.file.filename}`;
    } else if (req.body.image === "") {
      blog.image = "";
    }

    await blog.save();

    res.status(200).json({
      status: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        status: false,
        message: "Blog not found",
      });
    }

    await blog.deleteOne();

    res.status(200).json({
      status: true,
      message: "Blog deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// Like / Unlike Blog (Toggle)
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        status: false,
        message: "Blog not found",
      });
    }

    const userId = req.user.userId;
    const alreadyLiked = blog.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike — remove user from likes array
      blog.likes = blog.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Like — add user to likes array
      blog.likes.push(userId);
    }

    await blog.save();

    res.status(200).json({
      status: true,
      message: alreadyLiked ? "Blog unliked" : "Blog liked",
      liked: !alreadyLiked,
      likesCount: blog.likes.length,
      likes: blog.likes,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};