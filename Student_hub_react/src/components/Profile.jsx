import { useState, useEffect } from 'react';
import { Card, Button, Nav, Tab, Row, Col, Badge, Form, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';
import Loader from './Loaders';

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    bio: '',
    joinDate: ''
  });

  // Helper to decode JWT payload (base64)
  const decodeJWT = (token) => {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch {
      return {};
    }
  };

  // Get user info from session
  const getCurrentUserEmail = () => {
    const stored = localStorage.getItem('user_email');
    if (stored) return stored;
    const token = localStorage.getItem('session_token');
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded?.email) {
        localStorage.setItem('user_email', decoded.email);
        return decoded.email;
      }
    }
    return 'Current User';
  };

  const getCurrentUserName = () => {
    return localStorage.getItem('user_name') || localStorage.getItem('username') || getCurrentUserEmail();
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // First fetch posts, then comments (which depend on posts), then stats
      await fetchUserPosts();
      const commentsArr = await fetchUserComments();
      setUserComments(commentsArr);
      // compute stats using up-to-date lengths
      setUserStats({
        totalPosts: userPosts.length,
        totalComments: commentsArr.length,
        joinDate: new Date().toLocaleDateString(),
        lastActive: 'Today'
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const url = import.meta.env.VITE_SH_BE_URL + 'api/v1/post/by-user';
      const response = await axios.get(url, {
        headers: {
          Authorization: localStorage.getItem('session_token'),
          'Content-Type': 'application/json',
        }
      });
      setUserPosts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setUserPosts([]);
    }
  };

  const fetchUserComments = async () => {
    try {
      const allPostsUrl = import.meta.env.VITE_SH_BE_URL + 'api/v1/post/all';
      const postsResp = await axios.get(allPostsUrl);
      const postsArr = postsResp.data?.data || [];

      const userEmail = getCurrentUserEmail();
      const commentPromises = postsArr.map(async (p) => {
        try {
          const commentsUrl = import.meta.env.VITE_SH_BE_URL + `api/v1/post/by-post/${p.post_id}`;
          const resp = await axios.get(commentsUrl);
          const comments = resp.data?.data || [];
          return comments
            .filter(c => c.created_by === userEmail)
            .map(c => ({ ...c, post_title: p.title, post_id: p.post_id }));
        } catch {
          return [];
        }
      });

      const commentsNested = await Promise.all(commentPromises);
      const flatComments = commentsNested.flat();
      return flatComments;
    } catch (error) {
      console.error('Error fetching user comments:', error);
      return [];
    }
  };

  const fetchUserStats = async () => {
    try {
      // Calculate stats from available data
      setUserStats({
        totalPosts: userPosts.length,
        totalComments: userComments.length,
        joinDate: new Date().toLocaleDateString(), // Placeholder
        lastActive: 'Today'
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  // Update stats whenever posts or comments change
  useEffect(() => {
    setUserStats(prev => ({
      ...prev,
      totalPosts: userPosts.length,
      totalComments: userComments.length,
    }));
  }, [userPosts.length, userComments.length]);

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    // Implement profile update logic here
    alert('Profile update functionality to be implemented with backend API');
    setShowEditModal(false);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        // Implement delete post logic
        alert('Delete functionality to be implemented with backend API');
        fetchUserPosts(); // Refresh posts
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post');
      }
    }
  };

  const PostCard = ({ post, showActions = true, clickable = true }) => {
    const [expanded, setExpanded] = useState(false);
    
    const handleCardClick = () => {
      if (clickable) {
        setExpanded(!expanded);
      }
    };

    return (
      <Card 
        className={`mb-3 ${clickable ? 'shadow-hover' : ''}`}
        style={{ 
          cursor: clickable ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          border: '1px solid #e9ecef'
        }}
        onClick={handleCardClick}
      >
        <Card.Header className={`bg-${post.type === 'notes' ? 'info' : post.type === 'jobs' ? 'success' : 'warning'} text-white`}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <i className={`fas ${post.type === 'notes' ? 'fa-sticky-note' : post.type === 'jobs' ? 'fa-briefcase' : 'fa-question-circle'} me-2`}></i>
              {post.type.toUpperCase()}
            </div>
            <small>{new Date(post.created_at).toLocaleDateString()}</small>
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Title style={{ color: '#495057' }}>{post.title}</Card.Title>
          
          <Card.Text 
            style={{ 
              maxHeight: expanded ? 'none' : '100px', 
              overflow: expanded ? 'visible' : 'hidden',
              color: '#6c757d',
              lineHeight: '1.6'
            }}
          >
            {post.content}
          </Card.Text>
          
          {!expanded && post.content && post.content.length > 150 && (
            <Button 
              variant="link" 
              size="sm" 
              className="p-0 text-primary"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(true);
              }}
            >
              Read more...
            </Button>
          )}

          {expanded && post.file_url && (
            <div className="mt-3 mb-3">
              <img 
                src={post.file_url} 
                alt={post.title}
                className="img-fluid rounded"
                style={{ maxHeight: '300px', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              {post.tags?.map((tag, index) => (
                <Badge 
                  key={index} 
                  style={{ 
                    backgroundColor: '#f8f9fa', 
                    color: '#667eea',
                    border: '1px solid #dee2e6'
                  }} 
                  className="me-1"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
            
            <div className="d-flex gap-2">
              {clickable && (
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded(!expanded);
                  }}
                >
                  <i className={`fas fa-${expanded ? 'chevron-up' : 'chevron-down'}`}></i>
                </Button>
              )}
              
              {showActions && (
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePost(post.post_id);
                  }}
                >
                  <i className="fas fa-trash"></i>
                </Button>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  const StatCard = ({ icon, title, value, color = "primary" }) => (
    <Card className="text-center h-100 border-0 shadow-sm">
      <Card.Body>
        <div className={`text-${color} mb-3`}>
          <i className={`fas ${icon} fa-3x`}></i>
        </div>
                 <Card.Title className="h4 fw-bold" style={{ color: '#495057' }}>{value}</Card.Title>
         <Card.Text style={{ color: '#6c757d' }}>{title}</Card.Text>
      </Card.Body>
    </Card>
  );

  if (loading) return <Loader />;

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container">
        <Row>
          {/* Profile Header */}
          <Col lg={12} className="mb-4">
            <Card className="border-0 shadow-sm">
              <div className="position-relative">
                <div 
                  className="card-header border-0 text-white"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    height: '200px'
                  }}
                >
                  <div className="position-absolute bottom-0 start-0 p-4">
                    <div className="d-flex align-items-end">
                      <div 
                        className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: '100px', height: '100px', marginBottom: '-50px' }}
                      >
                        <i className="fas fa-user fa-3x text-primary"></i>
                      </div>
                                             <div className="text-white">
                         <h2 className="fw-bold mb-1">{getCurrentUserName()}</h2>
                         <p className="mb-0 opacity-75">{getCurrentUserEmail()}</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
              <Card.Body style={{ paddingTop: '60px' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">
                      <i className="fas fa-calendar-alt me-2"></i>
                      Joined: {userStats.joinDate}
                    </p>
                    <p className="text-muted mb-0">
                      <i className="fas fa-clock me-2"></i>
                      Last Active: {userStats.lastActive}
                    </p>
                  </div>
                  <Button variant="outline-primary" onClick={handleEditProfile}>
                    <i className="fas fa-edit me-2"></i>
                    Edit Profile
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Statistics Cards */}
          <Col lg={12} className="mb-4">
            <Row>
              <Col md={3} className="mb-3">
                                 <StatCard 
                   icon="fa-file-alt" 
                   title="Total Posts" 
                   value={userStats.totalPosts || userPosts.length} 
                   color="info"
                 />
               </Col>
               <Col md={3} className="mb-3">
                 <StatCard 
                   icon="fa-comments" 
                   title="Total Comments" 
                   value={userStats.totalComments || userComments.length} 
                   color="success"
                 />
              </Col>
              <Col md={3} className="mb-3">
                <StatCard 
                  icon="fa-heart" 
                  title="Likes Received" 
                  value="0" 
                  color="danger"
                />
              </Col>
              <Col md={3} className="mb-3">
                <StatCard 
                  icon="fa-trophy" 
                  title="Reputation" 
                  value="100" 
                  color="warning"
                />
              </Col>
            </Row>
          </Col>

          {/* Main Content */}
          <Col lg={12}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-bottom">
                <Nav variant="tabs" className="card-header-tabs">
                  <Nav.Item>
                                         <Nav.Link 
                       active={activeTab === 'overview'} 
                       onClick={() => setActiveTab('overview')}
                       style={{ color: '#495057' }}
                     >
                      <i className="fas fa-tachometer-alt me-2"></i>
                      Overview
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                                         <Nav.Link 
                       active={activeTab === 'posts'} 
                       onClick={() => setActiveTab('posts')}
                       style={{ color: '#495057' }}
                     >
                      <i className="fas fa-file-alt me-2"></i>
                      My Posts ({userPosts.length})
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                                         <Nav.Link 
                       active={activeTab === 'comments'} 
                       onClick={() => setActiveTab('comments')}
                       style={{ color: '#495057' }}
                     >
                      <i className="fas fa-comments me-2"></i>
                      My Comments ({userComments.length})
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                                         <Nav.Link 
                       active={activeTab === 'settings'} 
                       onClick={() => setActiveTab('settings')}
                       style={{ color: '#495057' }}
                     >
                      <i className="fas fa-cog me-2"></i>
                      Settings
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>

              <Card.Body>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div>
                                         <h5 className="mb-4" style={{ color: '#495057' }}>
                       <i className="fas fa-chart-line me-2 text-primary"></i>
                       Recent Activity
                     </h5>
                    
                    {userPosts.length > 0 ? (
                      <>
                                                 <h6 style={{ color: '#6c757d' }}>Latest Posts</h6>
                                                 {userPosts.slice(0, 3).map((post) => (
                           <PostCard key={post.post_id} post={post} showActions={false} clickable={true} />
                         ))}
                        {userPosts.length > 3 && (
                          <div className="text-center mt-3">
                            <Button 
                              variant="outline-primary" 
                              onClick={() => setActiveTab('posts')}
                            >
                              View All Posts ({userPosts.length})
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <Alert variant="info">
                        <i className="fas fa-info-circle me-2"></i>
                        You haven't created any posts yet. Start sharing your knowledge with the community!
                      </Alert>
                    )}
                  </div>
                )}

                {/* Posts Tab */}
                {activeTab === 'posts' && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                                             <h5 className="mb-0" style={{ color: '#495057' }}>
                         <i className="fas fa-file-alt me-2 text-primary"></i>
                         My Posts ({userPosts.length})
                       </h5>
                      <Button variant="primary" onClick={() => window.location.href = '/home'}>
                        <i className="fas fa-plus me-2"></i>
                        Create New Post
                      </Button>
                    </div>
                    
                    {userPosts.length > 0 ? (
                      userPosts.map((post) => (
                        <PostCard key={post.post_id} post={post} />
                      ))
                    ) : (
                      <Alert variant="info">
                        <i className="fas fa-inbox me-2"></i>
                        You haven't created any posts yet.
                      </Alert>
                    )}
                  </div>
                )}

                                {/* Comments Tab */}
                {activeTab === 'comments' && (
                  <div>
                    <h5 className="mb-4" style={{ color: '#495057' }}>
                      <i className="fas fa-comments me-2 text-primary"></i>
                      My Comments ({userComments.length})
                    </h5>
                    
                    {userComments.length > 0 ? (
                      <div>
                        {userComments.map((comment, index) => (
                          <Card key={comment.comment_id || index} className="mb-3 shadow-sm">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 style={{ color: '#495057' }} className="mb-1">
                                    <i className="fas fa-quote-left me-2 text-primary"></i>
                                    Comment on: "{comment.post_title}"
                                  </h6>
                                  <small style={{ color: '#6c757d' }}>
                                    <i className="fas fa-calendar-alt me-1"></i>
                                    {comment.created_at ? new Date(comment.created_at).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    }) : 'Just posted'}
                                  </small>
                                </div>
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  onClick={() => window.location.href = `/home`}
                                >
                                  <i className="fas fa-external-link-alt me-1"></i>
                                  View Post
                                </Button>
                              </div>
                              
                              <div 
                                className="bg-light p-3 rounded mt-3"
                                style={{ border: '1px solid #e9ecef' }}
                              >
                                <p className="mb-0" style={{ 
                                  color: '#495057',
                                  lineHeight: '1.6',
                                  fontSize: '15px'
                                }}>
                                  {comment.content}
                                </p>
                              </div>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Alert variant="info">
                        <i className="fas fa-comment-slash me-2"></i>
                        You haven't made any comments yet. Start engaging with posts to see your comments here!
                      </Alert>
                    )}
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div>
                                         <h5 className="mb-4" style={{ color: '#495057' }}>
                       <i className="fas fa-cog me-2 text-primary"></i>
                       Account Settings
                     </h5>
                    
                    <Row>
                      <Col lg={8}>
                        <Card className="border-0 bg-light">
                          <Card.Body>
                                                         <h6 style={{ color: '#495057' }}>Profile Information</h6>
                             <p style={{ color: '#6c757d' }} className="mb-3">Update your account details and preferences.</p>
                            
                                                         <div className="mb-3">
                               <strong style={{ color: '#495057' }}>Email:</strong> {getCurrentUserEmail()}
                             </div>
                             
                             <div className="mb-3">
                               <strong style={{ color: '#495057' }}>Account Type:</strong> Student
                             </div>
                             
                             <div className="mb-3">
                               <strong style={{ color: '#495057' }}>Privacy:</strong> Public Profile
                             </div>
                            
                            <Button variant="outline-primary" onClick={handleEditProfile}>
                              <i className="fas fa-edit me-2"></i>
                              Edit Profile Details
                            </Button>
                          </Card.Body>
                        </Card>
                        
                        <Card className="border-0 bg-light mt-4">
                          <Card.Body>
                                                         <h6 style={{ color: '#dc3545' }}>Danger Zone</h6>
                             <p style={{ color: '#6c757d' }} className="mb-3">Irreversible and destructive actions.</p>
                            
                            <Button variant="outline-danger">
                              <i className="fas fa-trash me-2"></i>
                              Delete Account
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-edit me-2"></i>
            Edit Profile
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your full name"
                value={userInfo.name}
                onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Tell us about yourself..."
                value={userInfo.bio}
                onChange={(e) => setUserInfo(prev => ({ ...prev, bio: e.target.value }))}
              />
            </Form.Group>
            
            <Alert variant="info">
              <i className="fas fa-info-circle me-2"></i>
              Full profile editing functionality will be implemented with backend API integration.
            </Alert>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveProfile}>
            <i className="fas fa-save me-2"></i>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Custom CSS for hover effects */}
      <style jsx>{`
        .shadow-hover:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default Profile;