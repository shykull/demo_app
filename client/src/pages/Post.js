import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {AuthContext} from '../helpers/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt  } from '@fortawesome/free-solid-svg-icons'; // Import the thumbs-up icon


function Post() {
    const {auth} = useContext(AuthContext);
    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState(""); // Renaming to `newComment` for clarity
    const navigate = useNavigate();
    let { id } = useParams();

    dayjs.extend(relativeTime); // Extend dayjs with relative time functionality

    // Fetch the post and comments
    useEffect(() => {

        if (auth.loading) {
            // While checking auth status, do nothing or show a loader
            return;
          }
               
        if (!auth.status){
            navigate("/login");
        } else {     
            axios.get(`/posts/byId/${id}`)
                .then((response) => {
                    setPostObject(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching post:", error);
                });

            axios.get(`/comments/${id}`)
                .then((response) => {
                    setComments(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching comments:", error);
                });
        }

    }, [id, auth.status, auth.loading, navigate]); // Dependency array
    // Function to handle adding a comment
    const addComment = () => {
        // Check if comment is not empty
        if (newComment.trim() === "") {
            alert("Comment cannot be empty");
            return;
        }

        axios.post("/comments", 
            { commentBody: newComment, PostId: id },
            { withCredentials: true }
        ).then((response) => {
            const commentToAdd = { commentBody: newComment, username: response.data.username}; // Include createdAt or other relevant fields
            setComments([...comments, commentToAdd]); // Add new comment to list
            setNewComment(""); // Clear the input field
        }).catch((error) => {
            console.error("Error adding comment:", error);
        });
    };
    const deleteComment = (id) => {

        axios.delete(`/comments/${id}`,{ withCredentials: true }).then((response) => {
            setComments(comments.filter((val) =>{
                return val.id !== id;
            }))
        })

    };
    
    const deletePost = (id) => {
        axios.delete(`/posts/byId/${id}`,{ withCredentials: true }).then((response) => {
            navigate("/");
        })

    };

       

    return (
        <div className="container m-3">
            <div className="row align-items-start">
                <div className="col">
                    <div className="card m-3" style={{ width: '18rem' }}>
                        <div className="card-body">
                            <h5 className="card-title">{postObject.title}</h5>
                            <p className="card-text">{postObject.postText}</p>
                            <div className='row g-0 justify-content-between'>
                                <div className='col-6'>
                                    
                                    <p className="card-text">by {postObject.username} {postObject.createdAt
                                    ? dayjs(postObject.createdAt).fromNow() // Calculate the difference from now
                                    : "Loading..."}</p>
                                </div>
                                <div className='col-6 text-end'>
                                    {auth.user === postObject.username && (
                                        <button type="button" className="btn" onClick={() => deletePost(postObject.id)}><FontAwesomeIcon icon={faTrashAlt} /></button>
                                    )}
                                </div>
                            </div>
                            
                            
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className='addComment'>
                        <textarea 
                            className="form-control mb-3" 
                            rows="3" 
                            value={newComment} 
                            onChange={(event) => setNewComment(event.target.value)} 
                        ></textarea>
                        <button className='btn btn-primary mb-3' onClick={addComment}>Add Comment</button>
                    </div>
                    <div className='listOfComments'>
                        {comments.slice(0).reverse().map((comment, key) => ( // Reverse the array
                            <div className="alert alert-info alert-dismissible" key={key}> {/* Add a unique key */}
                                <div>
                                    {comment.commentBody}
                                    <small className="text-muted d-block">Posted {dayjs(comment.createdAt).fromNow()} by {comment.username}</small>
                                </div>

                                {auth.user === comment.username && (
                                    <button type="button" className="btn-close" onClick={() => deleteComment(comment.id)}></button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Post;
