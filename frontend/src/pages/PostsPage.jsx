// frontend/src/pages/PostsPage.jsx
import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import PostCard from '../components/PostCard';
import PostModal from '../components/PostModal';
import CommentSidebar from '../components/CommentSidebar';

const PostsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Welcome to the new Posts section!",
      content: "Feel free to share ideas, ask questions, or post memes. Anonymous mode is available!",
      author: "Admin",
      isAnonymous: false,
      upvotes: 42,
      comments: [],
      media: []
    }
  ]);

  const handleCreatePost = (newPost) => {
    setPosts([newPost, ...posts]);
    setIsPostModalOpen(false);
  };

  const handleUpvote = (postId) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p));
  };

  const handleAddComment = (postId, comment) => {
    setPosts(prevPosts => prevPosts.map(p =>
      p.id === postId
        ? { ...p, comments: [...p.comments, comment] }
        : p
    ));

    // Instantly update the selectedPost so sidebar shows new comment immediately
    if (selectedPost?.id === postId) {
      setSelectedPost(prev => ({
        ...prev,
        comments: [...prev.comments, comment]
      }));
    }
  };

  const handleAddReply = (postId, commentId, reply) => {
    setPosts(prevPosts => prevPosts.map(p => {
      if (p.id === postId) {
        const updatedComments = p.comments.map(c =>
          c.id === commentId
            ? { ...c, replies: [...(c.replies || []), reply] }
            : c
        );
        return { ...p, comments: updatedComments };
      }
      return p;
    }));

    // Live update sidebar
    if (selectedPost?.id === postId) {
      setSelectedPost(prev => {
        const updatedComments = prev.comments.map(c =>
          c.id === commentId
            ? { ...c, replies: [...(c.replies || []), reply] }
            : c
        );
        return { ...prev, comments: updatedComments };
      });
    }
  };

  // Inside PostsPage.jsx — REPLACE the old handleUpvoteComment with this
const handleUpvoteComment = (postId, commentId) => {
  setPosts(prevPosts =>
    prevPosts.map(p => {
      if (p.id !== postId) return p;

      const updatedComments = p.comments.map(c => {
        // If it's a top-level comment
        if (c.id === commentId) {
          return { ...c, upvotes: c.upvotes + 1 };
        }

        // If it's a reply (nested inside replies)
        if (c.replies) {
          const updatedReplies = c.replies.map(r =>
            r.id === commentId ? { ...r, upvotes: r.upvotes + 1 } : r
          );
          return { ...c, replies: updatedReplies };
        }

        return c;
      });

      return { ...p, comments: updatedComments };
    })
  );

  // Also instantly update the selectedPost in sidebar
  if (selectedPost?.id === postId) {
    setSelectedPost(prev => {
      const updatedComments = prev.comments.map(c => {
        if (c.id === commentId) {
          return { ...c, upvotes: c.upvotes + 1 };
        }
        if (c.replies) {
          const updatedReplies = c.replies.map(r =>
            r.id === commentId ? { ...r, upvotes: r.upvotes + 1 } : r
          );
          return { ...c, replies: updatedReplies };
        }
        return c;
      });
      return { ...prev, comments: updatedComments };
    });
  }


    // Live update in sidebar
    if (selectedPost?.id === postId) {
      setSelectedPost(prev => ({
        ...prev,
        comments: prev.comments.map(c =>
          c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c
        )
      }));
    }
  };

  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-5 rounded-2xl mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Posts</h2>
        <p className="text-gray-500 mt-1">Discuss, share, and connect with the community</p>
      </div>

      <div className="flex-1 flex gap-8">
        {/* Main Feed */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="flex items-center gap-2 px-6 py-4 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-700 transition"
            >
              <Plus size={20} /> Create Post
            </button>
          </div>

          {/* Posts List */}
          <div className="flex-1 overflow-y-auto space-y-5 pb-8">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-xl">No posts yet. Be the first to post!</p>
              </div>
            ) : (
              filteredPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onOpen={() => setSelectedPost(post)}
                  onUpvote={() => handleUpvote(post.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Comment Sidebar - Always gets the latest post data */}
        {selectedPost && (
          <CommentSidebar
            post={posts.find(p => p.id === selectedPost.id) || selectedPost}
            onClose={() => setSelectedPost(null)}
            onAddComment={handleAddComment}
            onAddReply={handleAddReply}
            onUpvoteComment={handleUpvoteComment}
          />
        )}
      </div>

      {/* Create Post Modal */}
      {isPostModalOpen && (
        <PostModal
          onClose={() => setIsPostModalOpen(false)}
          onSubmit={handleCreatePost}
        />
      )}
    </div>
  );
};

export default PostsPage;