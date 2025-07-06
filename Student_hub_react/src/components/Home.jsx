import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';
import Loader from './Loaders';

const Home = () => {
  const [loader, setLoader] = useState(false);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [createPostModal, setCreatePostModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const fetchPosts = async () => {
    setLoader(true);
    try {
      const url = import.meta.env.VITE_SH_BE_URL + 'api/v1/post/all';
      const response = await axios.get(url, {
        headers: {
          Authorization: localStorage.getItem('session_token'),
          'Content-Type': 'application/json',
        }
      });
      setPosts(response.data.data);
      setFilteredPosts(response.data.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoader(false);
    }
  };

  // Filter and search logic
  useEffect(() => {
    let filtered = posts;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(post => post.type === filterType);
    }

    // Search in title and content
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, filterType]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const PostCard = ({ post }) => {
    const getTypeIcon = (type) => {
      switch (type) {
        case 'notes': return 'fas fa-sticky-note';
        case 'jobs': return 'fas fa-briefcase';
        case 'queries': return 'fas fa-question-circle';
        default: return 'fas fa-file-alt';
      }
    };

    const getTypeColor = (type) => {
      switch (type) {
        case 'notes': return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
        case 'jobs': return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
        case 'queries': return 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
        default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      }
    };

    return (
      <Card className='mb-3 h-100' style={{ cursor: 'pointer' }}>
        <Card.Header className={`bg-${post.type === 'notes' ? 'info' : post.type === 'jobs' ? 'success' : 'warning'} text-white`}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <i className={`${getTypeIcon(post.type)} me-2`}></i>
              {post.type.toUpperCase()}
            </div>
            <small>{new Date(post.created_at).toLocaleDateString()}</small>
          </div>
        </Card.Header>
        
        <Card.Body>
          <Card.Title>{post.title}</Card.Title>
          <Card.Text 
            style={{
              display: '-webkit-box',
              WebkitLineClamp: '3',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {post.content}
          </Card.Text>

          {post.file_url && (
            <div className="mb-3">
              <img 
                src={post.file_url} 
                alt={post.title}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover'
                }}
                className="rounded"
                onError={(e) => {
                  console.error('Image failed to load:', post.file_url);
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className='d-flex justify-content-between align-items-end'>
            <div>
              {post?.tags?.map((tag, index) => (
                <span key={index} className="badge bg-secondary me-1 mb-1">
                  {tag}
                </span>
              ))}
            </div>
            <small className="text-muted">{post.created_by}</small>
          </div>
        </Card.Body>
      </Card>
    );
  };

  const PostComments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDebug, setShowDebug] = useState(true); // Set to false in production

    const fetchComments = async (post_id) => {
      setLoading(true);
      console.log('🔍 Fetching comments for post ID:', post_id);
      
      try {
        const url = import.meta.env.VITE_SH_BE_URL + `api/v1/post/by-post/${post_id}`;
        console.log('📡 Request URL:', url);
        
        const response = await axios.get(url, {
          headers: {
            Authorization: localStorage.getItem('session_token'),
            'Content-Type': 'application/json',
          }
        });
        
        console.log('✅ Full Comments Response:', response);
        console.log('📋 Comments Data:', response.data);
        console.log('📝 Comments Array:', response.data.data);
        
        if (response.data.data && Array.isArray(response.data.data)) {
          console.log('🔢 Number of comments:', response.data.data.length);
          response.data.data.forEach((comment, index) => {
            console.log(`💬 Comment ${index + 1}:`, {
              id: comment.comment_id,
              content: comment.content,
              contentLength: comment.content?.length,
              createdBy: comment.created_by,
              createdAt: comment.created_at,
              fullObject: comment
            });
          });
          setComments(response.data.data);
        } else {
          console.warn('⚠️ No comments array found in response');
          setComments([]);
        }
      } catch (error) {
        console.error('❌ Error fetching comments:', error);
        console.error('❌ Error details:', error.response?.data);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    const addComment = async (e, post_id) => {
      e.preventDefault();
      if (!commentInput.trim()) {
        alert('Please enter a comment');
        return;
      }
      
      setLoading(true);
      console.log('🚀 Adding comment:', {
        postId: post_id,
        content: commentInput,
        contentLength: commentInput.length
      });
      
      try {
        const url = import.meta.env.VITE_SH_BE_URL + `api/v1/comment/create`;
        const payload = {
          post_id: post_id,
          content: commentInput.trim(),
        };
        
        console.log('📤 Sending comment payload:', payload);
        console.log('📡 Request URL:', url);
        
        const response = await axios.post(url, payload, {
          headers: {
            Authorization: localStorage.getItem('session_token'),
            'Content-Type': 'application/json',
          }
        });
        
        console.log('✅ Comment creation response:', response);
        
        if (response.status === 200 || response.status === 201) {
          console.log('✅ Comment created successfully');
          setCommentInput('');
          // Refresh comments after successful creation
          await fetchComments(post_id);
        } else {
          console.error('❌ Unexpected response status:', response.status);
          alert('Failed to add comment. Please try again.');
        }
      } catch (error) {
        console.error('❌ Error adding comment:', error);
        console.error('❌ Error details:', error.response?.data);
        alert('Error adding comment: ' + (error.response?.data?.detail || error.message));
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (postId) fetchComments(postId);
    }, [postId]);

    return (
      <div>
        {/* Debug Summary */}
        {showDebug && (
          <div className="alert alert-info mb-3">
            <strong>Debug Summary:</strong><br/>
            Post ID: {postId}<br/>
            Comments loaded: {comments.length}<br/>
            Loading: {loading ? 'Yes' : 'No'}<br/>
            API URL: {import.meta.env.VITE_SH_BE_URL}api/v1/post/by-post/{postId}
          </div>
        )}

        <div className="mb-4">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title mb-3">
                <i className="fas fa-comment me-2"></i>
                Add a Comment
              </h6>
              <div className="input-group">
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Write your comment here..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  style={{ resize: 'none' }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      addComment(e, postId);
                    }
                  }}
                />
              </div>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <small className="text-muted">
                  Press Enter to post your comment
                </small>
                <Button 
                  variant="primary"
                  size="sm"
                  onClick={(e) => addComment(e, postId)}
                  disabled={loading || !commentInput.trim()}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                      Posting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane me-1"></i>
                      Post Comment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading comments...</span>
            </div>
          </div>
        ) : (
          <div className="comments-list">
            {comments?.length > 0 ? (
              <div>
                {comments.map((comment, index) => (
                  <div 
                    key={comment.comment_id || index} 
                    className="card mb-3"
                    style={{ backgroundColor: '#f8f9fa' }}
                  >
                    <div className="card-body p-3">
                      <div className="d-flex align-items-start">
                        <div 
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                          style={{ width: '40px', height: '40px', flexShrink: 0 }}
                        >
                          <i className="fas fa-user"></i>
                        </div>
                        
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="mb-0 text-primary fw-bold">
                              {comment.created_by || 'Anonymous'}
                            </h6>
                            <small className="text-muted">
                              {comment.created_at ? new Date(comment.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 'Just now'}
                            </small>
                          </div>
                          
                                                     <div 
                             className="comment-content bg-white p-3 rounded border mt-2"
                           >
                             {comment.content ? (
                               <p className="mb-0 text-dark" style={{ 
                                 fontSize: '15px', 
                                 lineHeight: '1.5',
                                 wordWrap: 'break-word'
                               }}>
                                 {comment.content}
                               </p>
                             ) : (
                               <p className="mb-0 text-muted fst-italic">
                                 [No comment content available]
                               </p>
                             )}
                           </div>
                           
                           {showDebug && (
                             <div className="mt-2">
                               <button 
                                 className="btn btn-outline-secondary btn-sm"
                                 onClick={() => setShowDebug(!showDebug)}
                               >
                                 Hide Debug
                               </button>
                               <small className="text-muted d-block mt-1">
                                 <strong>Debug Info:</strong><br/>
                                 Content: "{comment.content}"<br/>
                                 Length: {comment.content?.length || 0}<br/>
                                 ID: {comment.comment_id}<br/>
                                 Type: {typeof comment.content}
                               </small>
                             </div>
                           )}
                           
                           {!showDebug && (
                             <button 
                               className="btn btn-outline-secondary btn-sm mt-2"
                               onClick={() => setShowDebug(true)}
                             >
                               Show Debug Info
                             </button>
                           )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <i className="fas fa-comments fa-3x text-muted mb-3"></i>
                <h6 className="text-muted">No comments yet</h6>
                <p className="text-muted">Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const PostModal = ({ post }) => {
    const getTypeColor = (type) => {
      switch (type) {
        case 'notes': return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
        case 'jobs': return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
        case 'queries': return 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
        default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      }
    };

    return (
      <>
        <Modal 
          show={post} 
          onHide={() => setSelectedPost(null)} 
          size="lg" 
          centered 
          enforceFocus={false}
          className="animate-scale-in"
        >
          <Modal.Header 
            closeButton
            style={{
              background: getTypeColor(post.type),
              color: 'white',
              border: 'none',
              borderRadius: '20px 20px 0 0'
            }}
          >
            <Modal.Title className="d-flex align-items-center fw-bold">
              <div 
                className="me-3 d-flex align-items-center justify-content-center"
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  fontSize: '18px'
                }}
              >
                <i className={`fas ${post.type === 'notes' ? 'fa-sticky-note' : post.type === 'jobs' ? 'fa-briefcase' : 'fa-question-circle'}`}></i>
              </div>
              {post.title}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body 
            className="overflow-auto p-4" 
            style={{ 
              maxHeight: '70vh',
              background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)'
            }}
          >
            <div className="mb-4">
              <div className="d-flex align-items-center mb-3">
                <div 
                  className="me-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    background: getTypeColor(post.type),
                    borderRadius: '12px',
                    color: 'white'
                  }}
                >
                  <i className="fas fa-user"></i>
                </div>
                <div>
                  <h6 className="mb-1 fw-bold text-primary">{post.created_by}</h6>
                  <small className="text-muted">
                    <i className="fas fa-calendar-alt me-1"></i>
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </small>
                </div>
              </div>

              <div className="mb-3">
                {post?.tags?.map((tag, index) => (
                  <Badge 
                    key={index}
                    className="me-2 mb-2"
                    style={{
                      background: 'rgba(102, 126, 234, 0.1)',
                      color: 'var(--primary-color)',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p style={{
                fontSize: '16px',
                lineHeight: '1.7',
                color: 'var(--text-primary)',
                marginBottom: '20px'
              }}>
                {post.content}
              </p>
            </div>

            {post.file_url && (
              <div className="mb-4">
                <Image 
                  src={post.file_url} 
                  alt={post.title} 
                  fluid
                  style={{
                    borderRadius: '16px',
                    maxHeight: '400px',
                    width: '100%',
                    objectFit: 'contain',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    backgroundColor: '#f8f9fa'
                  }}
                  className="hover-scale"
                  onError={(e) => {
                    console.error('Modal image failed to load:', post.file_url);
                    e.target.parentElement.innerHTML = `
                      <div class="text-center p-4 bg-light rounded">
                        <i class="fas fa-image fa-3x text-muted mb-3"></i>
                        <p class="text-muted">Image could not be loaded</p>
                        <small class="text-muted">URL: ${post.file_url}</small>
                      </div>
                    `;
                  }}
                />
              </div>
            )}

            <hr className="my-4" />
            
            <div className="comments-section">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0 d-flex align-items-center">
                  <i className="fas fa-comments me-2 text-primary"></i>
                  Comments & Discussion
                </h5>
                <span className="badge bg-secondary">
                  Post ID: {post.post_id}
                </span>
              </div>
              <PostComments postId={post.post_id} />
            </div>
          </Modal.Body>

          <Modal.Footer 
            style={{
              background: 'var(--bg-secondary)',
              border: 'none',
              borderRadius: '0 0 20px 20px',
              padding: '20px 25px'
            }}
          >
            <div className="d-flex w-100 justify-content-between align-items-center">
              <div className="d-flex align-items-center text-muted">
                <i className="fas fa-eye me-2"></i>
                <small>Post Details</small>
              </div>
              <Button 
                className="btn-outline-gradient"
                onClick={() => setSelectedPost(null)}
              >
                <i className="fas fa-times me-2"></i>
                Close
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </>
    )
  }

  const CreatePostModal = () => {
    const [postInput, setPostInput] = useState({
      type: 'notes',
      title: '',
      content: '',
      tags: [],
      file: null,
    });
    const [tagInput, setTagInput] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setPostInput((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleFileChange = (e) => {
      setPostInput((prev) => ({
        ...prev,
        file: e.target.files[0],
      }));
    };

    const handleTagInputChange = (e) => {
      const value = e.target.value;
      if (value.includes(',')) {
        const newTags = value.split(',').map(tag => tag.trim()).filter(tag => tag && !postInput.tags.includes(tag));
        setPostInput((prev) => ({
          ...prev,
          tags: [...prev.tags, ...newTags],
        }));
        setTagInput('');
      } else {
        setTagInput(value);
      }
    };

    const handleRemoveTag = (tagToRemove) => {
      setPostInput((prev) => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove),
      }));
    };

    const handleTagInputKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const newTag = tagInput.trim();
        if (newTag && !postInput.tags.includes(newTag)) {
          setPostInput((prev) => ({
            ...prev,
            tags: [...prev.tags, newTag],
          }));
          setTagInput('');
        }
      }
    };


    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validate required fields
      if (!postInput.title.trim()) {
        alert('Please enter a title');
        return;
      }
      if (!postInput.content.trim()) {
        alert('Please enter content');
        return;
      }
      if (!postInput.file) {
        alert('Please upload a file');
        return;
      }

      setSubmitting(true);
      try {
        const formData = new FormData();
        formData.append('type', postInput.type);
        formData.append('title', postInput.title);
        formData.append('content', postInput.content);
        formData.append('tags', JSON.stringify(postInput.tags));
        formData.append('file', postInput.file);

        console.log('Submitting post data:', {
          type: postInput.type,
          title: postInput.title,
          content: postInput.content,
          tags: postInput.tags,
          fileName: postInput.file?.name
        });

        const url = import.meta.env.VITE_SH_BE_URL + 'api/v1/post/create';
        const response = await axios.post(url, formData, {
          headers: {
            Authorization: localStorage.getItem('session_token'),
            'Content-Type': 'multipart/form-data',
          }
        });
        
        console.log('Post created successfully:', response.data);
        alert('Post created successfully!');
        
        // Reset form
        setPostInput({
          type: 'notes',
          title: '',
          content: '',
          tags: [],
          file: null,
        });
        setTagInput('');
        
        // Refresh posts
        await fetchPosts();
        setCreatePostModal(false);
      } catch (error) {
        console.error('Error creating post:', error);
        alert('Error creating post: ' + (error.response?.data?.detail || error.message));
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <Modal 
        show={true} 
        onHide={() => setCreatePostModal(false)} 
        centered 
        size="lg"
        className="animate-scale-in"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Post</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Post Type</Form.Label>
              <Form.Select
                name="type"
                value={postInput.type}
                onChange={(e) => setPostInput(prev => ({ ...prev, type: e.target.value }))}
                required
              >
                <option value="notes">Notes</option>
                <option value="jobs">Jobs</option>
                <option value="queries">Queries</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter your post title..."
                value={postInput.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="content"
                placeholder="Share your content here..."
                value={postInput.content}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags (comma separated)</Form.Label>
              <Form.Control
                type="text"
                placeholder="tag1, tag2, tag3"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
              />
              {postInput.tags.length > 0 && (
                <div className="mt-2">
                  {postInput.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="badge bg-primary me-2 mb-1"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </span>
                  ))}
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>File Upload (Required)</Form.Label>
              <Form.Control
                type="file"
                name="file"
                onChange={handleFileChange}
                accept="image/*,video/*,.pdf,.doc,.docx"
                required
              />
              {postInput.file && (
                <small className="text-success">
                  Selected: {postInput.file.name}
                </small>
              )}
            </Form.Group>

            <div className="d-flex gap-2 justify-content-end">
              <Button 
                variant="secondary"
                onClick={() => setCreatePostModal(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Post'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <>
      {loader && <Loader />}
      {selectedPost ? <PostModal post={selectedPost} /> : <></>}
      {createPostModal ? <CreatePostModal /> : <></>}
      
      {/* Header Section */}
      <div className="bg-primary text-white py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2 className="mb-1">StudentHub</h2>
              <p className="mb-0">Collaborative learning platform</p>
            </div>
            <div className="col-md-6 text-md-end">
              <button
                className="btn btn-light"
                onClick={() => setCreatePostModal(true)}
              >
                <i className="fas fa-plus me-2"></i>
                Create New Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-light py-3">
        <div className="container">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search posts, tags, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setSearchTerm('')}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex gap-2">
                <span className="align-self-center me-2">Filter:</span>
                {['all', 'notes', 'jobs', 'queries'].map(type => (
                  <button
                    key={type}
                    className={`btn btn-sm ${filterType === type ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilterType(type)}
                  >
                    {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Results Summary */}
          <div className="mt-2">
            <small className="text-muted">
              Showing {filteredPosts.length} of {posts.length} posts
              {searchTerm && ` for "${searchTerm}"`}
              {filterType !== 'all' && ` in ${filterType}`}
            </small>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="py-4">
        <div className="container">
          {Array.isArray(filteredPosts) && filteredPosts.length > 0 ? (
            <div className="row">
              {filteredPosts.map((post, index) => (
                <div key={post.post_id} className="col-lg-6 col-xl-4 mb-4">
                  <div onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPost(post);
                  }}>
                    <PostCard post={post} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="mb-4">
                <i className="fas fa-inbox fa-4x text-muted"></i>
              </div>
              {posts.length === 0 ? (
                <>
                  <h4 className="text-muted mb-3">No posts yet</h4>
                  <p className="text-muted mb-4">Be the first to share something with the community!</p>
                  <button
                    className="btn btn-primary px-4 py-2"
                    onClick={() => setCreatePostModal(true)}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Create Your First Post
                  </button>
                </>
              ) : (
                <>
                  <h4 className="text-muted mb-3">No posts found</h4>
                  <p className="text-muted mb-4">
                    Try adjusting your search terms or filters
                  </p>
                  <button
                    className="btn btn-outline-primary px-4 py-2"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterType('all');
                    }}
                  >
                    <i className="fas fa-refresh me-2"></i>
                    Clear Filters
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Home;