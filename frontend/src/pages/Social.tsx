import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage, ChatMessage, User } from '../lib/localStorage';
import { Users, MessageSquare, Heart, Share2, Award, Plus, Image as ImageIcon, Send, Search } from 'lucide-react';
import Modal from '../components/Modal';
import ImageUpload from '../components/ImageUpload';

interface Post {
  id: number;
  user: {
    name: string;
    avatar: string;
    badge: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  isLiked?: boolean;
}

interface Comment {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

export default function Social() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'feed' | 'chat'>('feed');
  const [selectedChat, setSelectedChat] = useState<User | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      user: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        badge: '🏋️‍♀️ Elite Trainer'
      },
      content: 'Just completed a 5K run in 22 minutes! New personal best! 🎉',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
      likes: 124,
      comments: [
        {
          id: 1,
          user: {
            name: 'Emma Wilson',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
          },
          content: 'Amazing achievement! Keep it up! 💪',
          timestamp: '1 hour ago'
        }
      ],
      timestamp: '2 hours ago',
      isLiked: false
    },
    {
      id: 2,
      user: {
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        badge: '💪 Fitness Pro'
      },
      content: 'Here\'s my go-to healthy breakfast! Packed with proteins and healthy fats.',
      image: 'https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?w=800',
      likes: 89,
      comments: [],
      timestamp: '5 hours ago',
      isLiked: false
    }
  ]);

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', image: '' });
  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (user) {
      const allUsers = storage.getAllUsers().filter(u => u.id !== user.id);
      setUsers(allUsers);
      const messages = storage.getChatMessages(user.id);
      setChatMessages(messages);
      
      const userProfile = storage.getUserProfile(user.id);
      if (userProfile?.galleryImages) {
        setGalleryImages(userProfile.galleryImages);
      }
    }
  }, [user]);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleCreatePost = () => {
    if (!newPost.content.trim()) return;

    const post: Post = {
      id: posts.length + 1,
      user: {
        name: 'Current User',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        badge: '🌟 Fitness Enthusiast'
      },
      content: newPost.content,
      image: newPost.image || undefined,
      likes: 0,
      comments: [],
      timestamp: 'Just now',
      isLiked: false
    };

    setPosts([post, ...posts]);
    setNewPost({ content: '', image: '' });
    setIsCreatePostOpen(false);
  };

  const handleAddComment = (postId: number) => {
    if (!newComment.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, {
            id: post.comments.length + 1,
            user: {
              name: 'Current User',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
            },
            content: newComment,
            timestamp: 'Just now'
          }]
        };
      }
      return post;
    }));

    setNewComment('');
    setActiveCommentId(null);
  };

  const handleSendMessage = () => {
    if (!user || !selectedChat || !chatMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: user.id,
      receiverId: selectedChat.id,
      content: chatMessage,
      timestamp: new Date().toISOString(),
      read: false
    };

    storage.saveChatMessage(newMessage);
    setChatMessages([...chatMessages, newMessage]);
    setChatMessage('');
  };

  const handleGalleryPhotoSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setGalleryImages(prev => [...prev, base64String]);
      
      if (user) {
        const profile = storage.getUserProfile(user.id) || {};
        storage.saveUserProfile(user.id, {
          ...profile,
          galleryImages: [...(profile.galleryImages || []), base64String]
        });
      }
      setShowGalleryModal(false);
    };
    reader.readAsDataURL(file);
  };

  const filteredUsers = users.filter(u => 
    u.profile?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getChatMessages = (chatUser: User) => {
    return chatMessages.filter(msg => 
      (msg.senderId === user?.id && msg.receiverId === chatUser.id) ||
      (msg.senderId === chatUser.id && msg.receiverId === user?.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Fitness Community</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              activeTab === 'feed'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Feed</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Chat</span>
          </button>
        </div>
      </div>

      {activeTab === 'chat' ? (
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-12 h-[600px]">
            <div className="col-span-4 border-r">
              <div className="p-4 border-b">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
              <div className="overflow-y-auto h-[calc(600px-73px)]">
                {filteredUsers.map(chatUser => (
                  <div
                    key={chatUser.id}
                    onClick={() => setSelectedChat(chatUser)}
                    className={`flex items-center space-x-4 p-4 hover:bg-gray-50 cursor-pointer ${
                      selectedChat?.id === chatUser.id ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      {chatUser.profile?.profilePhoto ? (
                        <img
                          src={chatUser.profile.profilePhoto}
                          alt={chatUser.profile.fullName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <Users className="w-6 h-6 text-indigo-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {chatUser.profile?.fullName || chatUser.email}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {chatUser.profile?.username || 'Fitness Enthusiast'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-8 flex flex-col">
              {selectedChat ? (
                <>
                  <div className="p-4 border-b">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        {selectedChat.profile?.profilePhoto ? (
                          <img
                            src={selectedChat.profile.profilePhoto}
                            alt={selectedChat.profile.fullName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <Users className="w-5 h-5 text-indigo-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {selectedChat.profile?.fullName || selectedChat.email}
                        </h3>
                        <p className="text-sm text-gray-500">Online</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {getChatMessages(selectedChat).map(message => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.senderId === user?.id
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSendMessage();
                          }
                        }}
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Chat Selected</h3>
                    <p className="text-gray-500">
                      Select a user from the list to start chatting
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Fitness Gallery</h2>
              <button
                onClick={() => setShowGalleryModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Photo</span>
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((image, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-3xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={post.user.avatar}
                      alt={post.user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{post.user.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{post.timestamp}</span>
                        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                          {post.user.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{post.content}</p>
                  
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full h-64 object-cover rounded-xl mb-4"
                    />
                  )}
                  
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex space-x-6">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-2 ${
                          post.isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span>{post.likes}</span>
                      </button>
                      <button
                        onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600"
                      >
                        <MessageSquare className="w-5 h-5" />
                        <span>{post.comments.length}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600">
                        <Share2 className="w-5 h-5" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="flex space-x-3">
                        <img
                          src={comment.user.avatar}
                          alt={comment.user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1 bg-gray-50 rounded-2xl p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{comment.user.name}</span>
                            <span className="text-xs text-gray-500">{comment.timestamp}</span>
                          </div>
                          <p className="text-gray-700 mt-1">{comment.content}</p>
                        </div>
                      </div>
                    ))}

                    {activeCommentId === post.id && (
                      <div className="flex items-center space-x-3 mt-4">
                        <img
                          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
                          alt="Current user"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full pr-10 py-2 px-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-700"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Award className="w-6 h-6 mr-2 text-indigo-600" />
                Top Achievers
              </h2>
              <div className="space-y-4">
                {[
                  { name: 'Emma Wilson', achievement: '30-Day Streak', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
                  { name: 'David Kim', achievement: 'Weight Goal Reached', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' }
                ].map((achiever, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                    <img
                      src={achiever.avatar}
                      alt={achiever.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{achiever.name}</p>
                      <p className="text-sm text-indigo-600">{achiever.achievement}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Trending Tags</h2>
              <div className="flex flex-wrap gap-2">
                {['#FitnessGoals', '#HealthyEating', '#WorkoutMotivation', '#FitFam', '#StrengthTraining'].map(tag => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-indigo-100 hover:text-indigo-800 cursor-pointer transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        title="Create New Post"
      >
        <div className="space-y-4">
          <textarea
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            placeholder="What's on your mind?"
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newPost.image}
              onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
              placeholder="Image URL (optional)"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="p-2 text-gray-500 hover:text-indigo-600">
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsCreatePostOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleCreatePost}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Post
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showGalleryModal}
        onClose={() => setShowGalleryModal(false)}
        title="Add Photo to Gallery"
      >
        <ImageUpload onImageSelect={handleGalleryPhotoSelect}>
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors">
            <Plus className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Click or drag to upload a photo</p>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF up to 10MB</p>
          </div>
        </ImageUpload>
      </Modal>
    </div>
  );
}