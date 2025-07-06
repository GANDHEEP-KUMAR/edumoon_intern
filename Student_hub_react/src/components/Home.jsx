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
  const [selectedPost, setSelectedPost] = useState(null);
  const [createPostModal, setCreatePostModal] = useState(false);

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
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoader(false);
    }
  };

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
      <Card className='mb-4 hover-lift animate-scale-in' style={{
        border: 'none',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer'
      }}>
        <Card.Header 
          className="border-0 d-flex align-items-center justify-content-between"
          style={{
            background: getTypeColor(post.type),
            color: 'white',
            padding: '20px 25px',
            fontWeight: '600'
          }}
        >
          <div className="d-flex align-items-center">
            <i className={`${getTypeIcon(post.type)} me-3 fa-lg`}></i>
            <span style={{ textTransform: 'capitalize', fontSize: '16px' }}>
              {post.type}
            </span>
          </div>
          <div className="d-flex align-items-center">
            <i className="fas fa-calendar-alt me-2"></i>
            <small>{new Date(post.created_at).toLocaleDateString()}</small>
          </div>
        </Card.Header>
        
        <Card.Body style={{ padding: '25px' }}>
          <Card.Title className="mb-3" style={{
            fontSize: '20px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            lineHeight: '1.3'
          }}>
            {post.title}
          </Card.Title>
          
          <Card.Text style={{
            color: 'var(--text-secondary)',
            fontSize: '15px',
            lineHeight: '1.6',
            marginBottom: '20px',
            display: '-webkit-box',
            WebkitLineClamp: '3',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {post.content}
          </Card.Text>

          {post.file_url && (
            <div className="mb-3">
              <img 
                src={post.file_url} 
                alt={post.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  transition: 'transform 0.3s ease'
                }}
                className="hover-scale"
              />
            </div>
          )}
          
          <div className='d-flex justify-content-between align-items-center'>
            <div className="d-flex flex-wrap gap-2">
              {post?.tags?.map((tag, index) => (
                <Badge 
                  key={index} 
                  style={{
                    background: 'rgba(102, 126, 234, 0.1)',
                    color: 'var(--primary-color)',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                  className="hover-scale"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
            
            <div className="d-flex align-items-center text-muted">
              <i className="fas fa-user me-2"></i>
              <small style={{ fontWeight: '500' }}>{post.created_by}</small>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  const PostComments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchComments = async (post_id) => {
      setLoading(true);
      try {
        const url = import.meta.env.VITE_SH_BE_URL + `api/v1/post/by-post/${post_id}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: localStorage.getItem('session_token'),
            'Content-Type': 'application/json',
          }
        });
        setComments(response.data.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    const addComment = async (e, post_id) => {
      e.preventDefault();
      if (!commentInput.trim()) return;
      setLoading(true);
      try {
        const url = import.meta.env.VITE_SH_BE_URL + `api/v1/comment/create`;
        const payload = {
          post_id: post_id,
          content: commentInput,
        };
        const response = await axios.post(url, payload, {
          headers: {
            Authorization: localStorage.getItem('session_token'),
            'Content-Type': 'application/json',
          }
        });
        if (response.status === 200) {
          fetchComments(post_id);
        } else {
          console.error('Failed to add comment:', response);
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      } finally {
        setLoading(false);
        setCommentInput('');
      }
    };

    useEffect(() => {
      if (postId) fetchComments(postId);
    }, [postId]);

    return (
      <div>
        <div className="mb-4">
          <InputGroup className="shadow-sm">
            <Form.Control
              placeholder="Share your thoughts on this post..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              style={{
                borderRadius: '25px 0 0 25px',
                padding: '12px 20px',
                fontSize: '15px',
                border: '2px solid #e9ecef'
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  addComment(e, postId);
                }
              }}
            />
            <Button 
              className="btn-gradient"
              onClick={(e) => addComment(e, postId)}
              disabled={loading || !commentInput.trim()}
              style={{
                borderRadius: '0 25px 25px 0',
                padding: '12px 24px',
                fontWeight: '600'
              }}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              ) : (
                <i className="fas fa-paper-plane me-2"></i>
              )}
              Comment
            </Button>
          </InputGroup>
          <small className="text-muted mt-2 d-block">
            <i className="fas fa-info-circle me-1"></i>
            Press Enter to post your comment
          </small>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading comments...</span>
            </div>
            <p className="text-muted">Loading comments...</p>
          </div>
        ) : (
          <div className="comments-container">
            {comments?.length > 0 ? (
              <div className="space-y-3">
                {comments.map((comment, index) => (
                  <div 
                    key={index} 
                    className="comment-item p-3 animate-fade-in"
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '16px',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      marginBottom: '12px',
                      transition: 'all 0.3s ease',
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <div className="d-flex align-items-start">
                      <div 
                        className="me-3 d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: '44px',
                          height: '44px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: '12px',
                          color: 'white',
                          fontSize: '16px'
                        }}
                      >
                        <i className="fas fa-user"></i>
                      </div>
                      
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div>
                            <h6 className="mb-1 fw-bold text-primary" style={{ fontSize: '14px' }}>
                              {comment.created_by}
                            </h6>
                            <small className="text-muted d-flex align-items-center">
                              <i className="fas fa-clock me-1"></i>
                              {new Date(comment.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </small>
                          </div>
                        </div>
                        
                        <p 
                          className="mb-0"
                          style={{
                            fontSize: '15px',
                            lineHeight: '1.5',
                            color: 'var(--text-primary)'
                          }}
                        >
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className="fas fa-comments fa-3x text-muted"></i>
                </div>
                <h6 className="text-muted mb-2">No comments yet</h6>
                <p className="text-muted small mb-0">Be the first to share your thoughts!</p>
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
                    maxHeight: '300px',
                    width: '100%',
                    objectFit: 'cover',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                  }}
                  className="hover-scale"
                />
              </div>
            )}

            <hr style={{ margin: '30px 0', opacity: 0.3 }} />
            
            <div>
              <h5 className="mb-4 d-flex align-items-center">
                <i className="fas fa-comments me-2 text-primary"></i>
                Comments & Discussion
              </h5>
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
      setTagInput(e.target.value);
    };

    const handleAddTag = () => {
      const newTag = tagInput.trim();
      if (newTag && !postInput.tags.includes(newTag)) {
        setPostInput((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }
      setTagInput('');
    };

    const handleRemoveTag = (tagToRemove) => {
      setPostInput((prev) => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove),
      }));
    };

    const handleTagInputKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        handleAddTag();
      }
    };


    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        const formData = new FormData();
        formData.append('type', postInput.type);
        formData.append('title', postInput.title);
        formData.append('content', postInput.content);
        formData.append('tags', JSON.stringify(postInput.tags)); // Should be a JSON string
        if (postInput.file) {
          formData.append('file', postInput.file);
        }

        const url = import.meta.env.VITE_SH_BE_URL + 'api/v1/post/create';
        await axios.post(url, formData, {
          headers: {
            Authorization: localStorage.getItem('session_token'),
            'Content-Type': 'multipart/form-data',
          }
        });
        fetchPosts();
      } catch (error) {
        console.error('Error creating post:', error);
      } finally {
        setSubmitting(false);
        setCreatePostModal(false);
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
        <Modal.Header 
          closeButton
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              <i className="fas fa-plus"></i>
            </div>
            Create New Post
          </Modal.Title>
        </Modal.Header>

        <Modal.Body 
          style={{ 
            background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
            padding: '30px'
          }}
        >
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold d-flex align-items-center mb-3">
                <i className="fas fa-tag me-2 text-primary"></i>
                Post Type
              </Form.Label>
              <div className="d-flex gap-3">
                {['notes', 'jobs', 'queries'].map((type) => (
                  <div
                    key={type}
                    className={`flex-fill p-3 text-center rounded-3 cursor-pointer transition-all ${
                      postInput.type === type ? 'border-2 border-primary' : 'border border-light'
                    }`}
                    style={{
                      background: postInput.type === type 
                        ? 'rgba(102, 126, 234, 0.1)' 
                        : 'rgba(255, 255, 255, 0.8)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => setPostInput(prev => ({ ...prev, type }))}
                  >
                    <i className={`fas ${
                      type === 'notes' ? 'fa-sticky-note' : 
                      type === 'jobs' ? 'fa-briefcase' : 'fa-question-circle'
                    } fa-2x mb-2 ${postInput.type === type ? 'text-primary' : 'text-muted'}`}></i>
                    <p className={`mb-0 fw-semibold ${postInput.type === type ? 'text-primary' : 'text-muted'}`} style={{ textTransform: 'capitalize' }}>
                      {type}
                    </p>
                  </div>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold d-flex align-items-center mb-3">
                <i className="fas fa-heading me-2 text-primary"></i>
                Title
              </Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter an engaging title for your post..."
                value={postInput.title}
                onChange={handleChange}
                required
                className="form-control-lg"
                style={{ borderRadius: '12px', padding: '16px', fontSize: '16px' }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold d-flex align-items-center mb-3">
                <i className="fas fa-align-left me-2 text-primary"></i>
                Content
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="content"
                placeholder="Share your thoughts, knowledge, or questions..."
                value={postInput.content}
                onChange={handleChange}
                required
                style={{ borderRadius: '12px', padding: '16px', fontSize: '15px', lineHeight: '1.6' }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold d-flex align-items-center mb-3">
                <i className="fas fa-hashtag me-2 text-primary"></i>
                Tags
              </Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Add tag and press Enter or click Add"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                  style={{ borderRadius: '12px 0 0 12px', padding: '12px 16px' }}
                />
                <Button 
                  className="btn-outline-gradient" 
                  onClick={handleAddTag} 
                  disabled={!tagInput.trim()}
                  style={{ borderRadius: '0 12px 12px 0' }}
                >
                  <i className="fas fa-plus me-2"></i>Add
                </Button>
              </InputGroup>
              <div className="d-flex flex-wrap gap-2">
                {postInput.tags.map((tag, idx) => (
                  <Badge
                    key={idx}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    className="hover-scale"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    #{tag} <i className="fas fa-times ms-2"></i>
                  </Badge>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold d-flex align-items-center mb-3">
                <i className="fas fa-image me-2 text-primary"></i>
                Attachment (Optional)
              </Form.Label>
              <div 
                className="border border-dashed border-primary rounded-3 p-4 text-center"
                style={{ 
                  background: 'rgba(102, 126, 234, 0.05)',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-cloud-upload-alt fa-2x text-primary mb-3"></i>
                <Form.Control
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  style={{ 
                    opacity: 0, 
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer'
                  }}
                />
                <p className="mb-2 fw-semibold text-primary">
                  Choose file or drag and drop
                </p>
                <small className="text-muted">
                  Support for images, videos, documents
                </small>
                {postInput.file && (
                  <div className="mt-3 p-2 bg-light rounded-2">
                    <i className="fas fa-file me-2 text-success"></i>
                    <span className="text-success fw-semibold">{postInput.file.name}</span>
                  </div>
                )}
              </div>
            </Form.Group>

            <div className="d-flex gap-3 justify-content-end">
              <Button 
                variant="outline-secondary"
                onClick={() => setCreatePostModal(false)}
                className="px-4 py-2"
                style={{ borderRadius: '12px' }}
              >
                <i className="fas fa-times me-2"></i>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="btn-gradient px-4 py-2"
                disabled={submitting}
                style={{ borderRadius: '12px' }}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Publishing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane me-2"></i>
                    Create Post
                  </>
                )}
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
      
      {/* Hero Section */}
      <div className="hero-section animate-fade-in" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '80px 0 60px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '5%',
          width: '120px',
          height: '120px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '10%',
          width: '80px',
          height: '80px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite reverse'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '20%',
          width: '60px',
          height: '60px',
          background: 'rgba(255,255,255,0.12)',
          borderRadius: '50%',
          animation: 'float 10s ease-in-out infinite'
        }}></div>

        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="mb-4 animate-slide-down">
                <div className="d-inline-block p-4 mb-4" style={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <i className="fas fa-graduation-cap fa-3x"></i>
                </div>
              </div>
              
              <h1 className="display-3 fw-bold mb-4 animate-slide-up" style={{
                textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                lineHeight: '1.2'
              }}>
                Welcome to <span style={{
                  background: 'linear-gradient(45deg, #ffffff, #f0f8ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>StudentHub</span>
              </h1>
              
              <p className="lead mb-5 animate-slide-up" style={{
                fontSize: '20px',
                opacity: '0.95',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}>
                Your collaborative learning platform where students connect, share knowledge, and grow together
              </p>
              
              <div className="d-flex justify-content-center gap-3 animate-slide-up">
                <button
                  className="btn btn-light btn-lg px-4 py-3 fw-bold hover-lift"
                  style={{
                    borderRadius: '15px',
                    boxShadow: '0 8px 25px rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setCreatePostModal(true)}
                >
                  <i className="fas fa-plus me-2"></i>
                  Create New Post
                </button>
                
                <button
                  className="btn btn-outline-light btn-lg px-4 py-3 fw-bold hover-lift"
                  style={{
                    borderRadius: '15px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => document.getElementById('posts-section').scrollIntoView({ behavior: 'smooth' })}
                >
                  <i className="fas fa-arrow-down me-2"></i>
                  Explore Posts
                </button>
              </div>
              
              {/* Stats Section */}
              <div className="row mt-5 animate-fade-in">
                <div className="col-md-4">
                  <div className="p-3" style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '15px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <h3 className="fw-bold">{Array.isArray(posts) ? posts.length : 0}</h3>
                    <p className="mb-0 opacity-75">Total Posts</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3" style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '15px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <h3 className="fw-bold">500+</h3>
                    <p className="mb-0 opacity-75">Active Students</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3" style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '15px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <h3 className="fw-bold">24/7</h3>
                    <p className="mb-0 opacity-75">Collaboration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div id="posts-section" className="py-5" style={{
        background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="text-center mb-5">
                <h2 className="gradient-text fw-bold mb-3">Latest Posts</h2>
                <p className="text-muted lead">Discover what your fellow students are sharing</p>
              </div>
              
              {Array.isArray(posts) && posts.length > 0 ? (
                <div className="row">
                  {posts.map((post, index) => (
                    <div key={post.post_id} className="col-12" style={{
                      animationDelay: `${index * 0.1}s`
                    }}>
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
                <div className="text-center py-5 animate-fade-in">
                  <div className="mb-4">
                    <i className="fas fa-inbox fa-4x text-muted"></i>
                  </div>
                  <h4 className="text-muted mb-3">No posts yet</h4>
                  <p className="text-muted mb-4">Be the first to share something with the community!</p>
                  <button
                    className="btn btn-gradient px-4 py-2"
                    onClick={() => setCreatePostModal(true)}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Create Your First Post
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home;