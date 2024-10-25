import React, {useContext, useEffect} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from '../helpers/AuthContext'

function CreatePost() {
    const navigate = useNavigate();
    const {auth} = useContext(AuthContext);
    
    const initialValues = {
        title: "",
        postText: "",
      //  username: "",
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        postText: Yup.string().required("Post text is required"),
      //  username: Yup.string().min(3, "Username must be at least 3 characters").max(15, "Username must be 15 characters or less").required("Username is required")
    });

    const onSubmit = (data) => {
       
        axios.post("/api/posts", data,{ withCredentials: true }).then(() => {
            navigate("/"); // Redirect to home after successful post creation
        })
        .catch((error) => {
            console.error("Error creating post:", error);
        })  
    }
    useEffect(() => {
        
        if (auth.loading) {
            // While checking auth status, do nothing or show a loader
            return;
          }

        if (!auth.status){
            navigate("/login");
        }
    },[auth.status, auth.loading, navigate]);

   

    return (
        <div>
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form className='container mt-3'>
                    <h1 className="mb-3">Create Post</h1>
                    <ErrorMessage name="title" component="span" className="text-danger" />   
                    <div className="input-group mb-3">
                        
                        <span className="input-group-text">Title</span>
                        <Field className="form-control" id="inCreateTitle" name="title" placeholder="Post Title" />
                    </div>
                    <ErrorMessage name="postText" component="span" className="text-danger" />
                    <div className="input-group mb-3">
                        
                        <span className="input-group-text">Post</span>
                        <Field as="textarea" className="form-control" id="inCreatePost" name="postText" placeholder="Post Text" rows="3" />
                    </div>
                    <ErrorMessage name="username" component="span" className="text-danger" />
                    {/* <div className="input-group mb-3">
                        
                        <span className="input-group-text">Username</span>
                        <Field className="form-control" id="inCreateUser" name="username" placeholder="Username" />
                    </div> */}
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary">Create Post</button>
                    </div>           
                </Form>
            </Formik>
        </div>
    );
}

export default CreatePost;
