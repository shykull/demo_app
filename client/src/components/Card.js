import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'; // Import the thumbs-up icon
import { Link } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is installed

const Card = ({ imageSrc, title, text, link, linkText, postId, totalLikes: initialLikes }) => {
  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(initialLikes); // Initialize with the total likes

  useEffect(() => {
    // Fetch the initial like status when the component mounts
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/like/${postId}`, {
          withCredentials: true, // This ensures cookies are included
        });
        setLiked(response.data.liked);
      } catch (err) {
        console.error('Error fetching like status', err);
      }
    };

    fetchLikeStatus();
  }, [postId]);

  // Handle the like/unlike toggle
  const handleLike = async () => {
    try {
      // Optimistically update like state and total likes
      setLiked(prevLiked => !prevLiked);
      //setTotalLikes(prevTotal => (liked ? prevTotal - 1 : prevTotal + 1));

      const response = await axios.post(
        "http://localhost:3001/like/",
        { PostId: postId },
        { withCredentials: true }
      );

      // Based on backend response, update the like status (true/false)
      setLiked(response.data.liked);

      // Adjust total likes based on the new like status
      setTotalLikes(prevTotal => (response.data.liked ? prevTotal + 1 : prevTotal - 1));
    } catch (err) {
      console.error('Error liking the post', err);

      // Revert optimistic update if there's an error
      setLiked(prevLiked => !prevLiked);
      setTotalLikes(prevTotal => (liked ? prevTotal + 1 : prevTotal - 1));
    }
  };

  return (
    <div className="card m-3" style={{ width: '18rem' }}>
      <img src={imageSrc} className="card-img-top" alt={title} />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>

        <div className='row g-0 justify-content-between'>
          <div className='col'>
            <Link className="btn btn-primary" to={link}>{linkText}</Link>
          </div>
          <div className='col'>
            <button
              onClick={handleLike}
              className={`btn position-relative ${liked ? 'btn-primary' : 'btn-outline-primary'}`}
            >
              <FontAwesomeIcon icon={faThumbsUp} style={{ marginRight: '5px' }} />
              {liked ? 'Liked' : 'Like'}
              {totalLikes > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {totalLikes}
                </span>
              )}
            </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Card;



