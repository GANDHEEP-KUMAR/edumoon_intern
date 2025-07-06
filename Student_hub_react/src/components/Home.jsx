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
      const url = import.meta.env.VITE_SH_BE_URI + 'api/v1/post';
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
    return (
      <Card className='mb-4'>
        <Card.Header as="h5">{post.type}</Card.Header>
        <Card.Body>
          <Card.Title>{post.title}</Card.Title>
          <Card.Text>
            {post.content}
          </Card.Text>
          <div className='d-flex justify-content-between align-items-center mb-2'>
            <div>
              {post?.tags?.map((tag, index) => (
                <Badge className='me-2' pill={true} key={index} bg="secondary">{tag}</Badge>
              ))}
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
        const url = import.meta.env.VITE_SH_BE_URI + `api/v1/post/by-user${post_id}`;
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
        const url = import.meta.env.VITE_SH_BE_URI + `api/v1/comments/create`;
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
        <InputGroup className="mt-3">
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <Button variant="primary" onClick={(e) => addComment(e, postId)}>Comment</Button>
        </InputGroup>
        {loading ? <div>Loading comments...</div> : (
          <ListGroup>
            {comments?.map((comment, index) => (
              <ListGroup.Item key={index} className="d-flex align-items-center">
                <div style={{ borderRight: '1px solid #ddd', paddingRight: '10px', marginRight: '10px', width: '150px' }}>
                  <div className="comment-content">{comment.created_by}</div>
                  <strong>{comment.author}</strong> <span className="text-muted">{new Date(comment.created_at).toLocaleString()}</span>
                </div>
                <div>{comment.content}</div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    );
  };

  const PostModal = ({ post }) => {
    return (
      <>
        <Modal show={post} onHide={() => setSelectedPost(null)} size="lg" centered enforceFocus={false}>
          <Modal.Header closeButton>
            <Modal.Title>{post.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="overflow-auto" style={{ maxHeight: '60vh' }}>
            <p>{post.content}</p>
            <Image src={post.file_url} height={400} alt={post.title} fluid />
            <PostComments postId={post.post_id} />
          </Modal.Body>
          <Modal.Footer className='d-flex justify-content-between'>
            <Button variant="secondary" onClick={() => setSelectedPost(null)}>
              Close
            </Button>
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

        const url = import.meta.env.VITE_SH_BE_URI + 'api/v1/post/create';
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
      <Modal show={true} onHide={() => setCreatePostModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                name="type"
                value={postInput.type}
                onChange={handleChange}
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
                value={postInput.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="content"
                value={postInput.content}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Add tag and press Enter"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                />
                <Button variant="outline-secondary" onClick={handleAddTag} disabled={!tagInput.trim()}>
                  Add
                </Button>
              </InputGroup>
              <div className="mt-2">
                {postInput.tags.map((tag, idx) => (
                  <Badge
                    key={idx}
                    bg="info"
                    className="me-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} &times;
                  </Badge>
                ))}
              </div>
            </Form.Group>
            <Form.Group className="mb-3" required>
              <Form.Label>File</Form.Label>
              <Form.Control
                type="file"
                name="file"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? "Posting..." : "Create Post"}
            </Button>
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
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-5">
        <h1 className="text-4xl font-bold mb-4">Welcome to StudentHub</h1>
        <div className="text-lg text-gray-700 mx-auto d-flex justify-space-between items-center mb-4">
          <div>Your collaborative learning platform</div>
          <Badge bg="secondary" className={{ "marginLeft": "10px" }} onClick={() => setCreatePostModal(true)}>+ New</Badge>
        </div>
      </div>
      <div className="flex justify-center mt-8 p-5 pt-0">
        {Array.isArray(posts) && posts.map((post) => (
          <div key={post.post_id} onClick={(e) => {
            e.stopPropagation();
            setSelectedPost(post);
          }} >
            <PostCard post={post} />
          </div>
        ))}

      </div>
    </>
  )
}

export default Home;