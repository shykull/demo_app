import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';
import Card from '../components/Card';

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const { auth } = useContext(AuthContext); // Access auth context
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.loading) {
      // While checking auth status, do nothing or show a loader
      return;
    }

    if (!auth.status) {
      // If not authenticated, redirect to login
      navigate('/login');
    } else {
      // If authenticated, fetch the posts
      const fetchPosts = async () => {
        try {
          const response = await axios.get('/api/posts', { withCredentials: true });
          setListOfPosts(response.data);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      };

      fetchPosts();
    }
  }, [auth.status, auth.loading, navigate]);


  return (
    <div className="container mt-3">
      <div className="row justify-content-center">
        {listOfPosts.map((post, key) => (
          <Card
            key={key}
            imageSrc="https://miro.medium.com/v2/resize:fit:940/0*x8S-F4iXW-95Dcrg.png"
            title={post.title}
            text={post.postText}
            link={`/post/${post.id}`}
            linkText={post.username}
            postId={post.id}
            totalLikes={post.Likes.length}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
