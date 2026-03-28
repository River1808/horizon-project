import React, { useEffect, useState } from "react";
import "./Forum.css";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/forum`;

export async function getPosts() {
  const res = await fetch(`${API_BASE}/posts`);
  return res.json();
}

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [commentText, setCommentText] = useState("");

  // Load posts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_BASE}/posts`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Error loading posts:", err);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  };

  const openPost = async (post) => {
    setSelectedPost(post);
    fetchComments(post.id);
  };

  const createPost = async (e) => {
    e.preventDefault();

    const newPost = {
      title: title,
      content: content,
      author: "Guest User",
    };

    try {
      await fetch(`${API_BASE}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      setTitle("");
      setContent("");
      fetchPosts();
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();

    const comment = {
      author: "Guest User",
      content: commentText,
    };

    try {
      await fetch(`${API_BASE}/posts/${selectedPost.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
      });

      setCommentText("");
      fetchComments(selectedPost.id);
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  return (
    <div className="forum-page">

      {/* ⭐ HERO SECTION */}
      <section className="forum-hero">
        <div className="forum-hero-text">
          <h1>Diễn đàn cộng đồng Herizon</h1>
          <p>Chia sẻ ý tưởng, đặt câu hỏi và kết nối với cộng đồng STEAM.</p>
        </div>

        <div className="forum-hero-img">
          <img src="/forum.avif" alt="Forum" />
        </div>
      </section>

      <div className="forum-container">

        {/* Create Post */}
        <div className="create-post">
          <h2>Tạo bài viết mới</h2>

          <form onSubmit={createPost}>
            <input
              type="text"
              placeholder="Tiêu đề bài viết"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Viết nội dung..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />

            <button type="submit" className="submit-post-btn">
              Đăng bài
            </button>
          </form>
        </div>

        {/* Posts List */}
        <div className="post-list">
          <h2>Thảo luận gần đây</h2>

          {posts.map((post) => (
            <div
              key={post.id}
              className="post-card"
              onClick={() => openPost(post)}
            >
              <h3>{post.title}</h3>
              <p>{post.content.substring(0, 120)}...</p>
              <span className="post-author">👤 {post.author}</span>
            </div>
          ))}
        </div>

        {/* Post Detail */}
        {selectedPost && (
          <div className="post-detail">

            <h2>{selectedPost.title}</h2>
            <p className="post-author">👤 {selectedPost.author}</p>

            <p className="post-content-full">{selectedPost.content}</p>

            <h3>Bình luận</h3>

            <div className="comment-list">
              {comments.map((c) => (
                <div key={c.id} className="comment">
                  <b>👤 {c.author}</b>
                  <p>{c.content}</p>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <form className="comment-form" onSubmit={addComment}>
              <textarea
                placeholder="Viết bình luận..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              />

              <button type="submit" className="add-comment-btn">
                Gửi bình luận
              </button>
            </form>

            <button className="close-post-btn" onClick={() => setSelectedPost(null)}>
              Đóng bài viết
            </button>
          </div>
        )}
      </div>
    </div>
  );
}