import { gql, useMutation } from '@apollo/client';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useState } from 'react';
import Modal from 'react-modal';
import { ME_QUERY } from '../pages/Profile';
import CustomStyles from '../styles/CustomModalStyles';
import * as Yup from 'yup';
import "../styles/tweet.css"

const CREATE_TWEET_MUTATION = gql`
    mutation createTweet($content: String) {
        createTweet(content: $content) {
            id
        }
    }
`


interface TweetValues {
    content : string
}

const Tweet = () => {
    const [createTweet] = useMutation(CREATE_TWEET_MUTATION, {
        refetchQueries: [{query: ME_QUERY}]
    })
    const openModal = () => {
        setIsOpen(true)
    }
    const closeModal = () => {
        setIsOpen(false)
    }

    const [modalIsOpen, setIsOpen] = useState(false);

    const initialValues: TweetValues = {
        content: ""
    }

    const validationSchema = Yup.object({
        content: Yup.string().required().min(1, "Must be more than 1 character").max(256, "Must be less than 257 characters")
    })

    return (
        <div>
            <button
                style={{ marginRight: "10px", marginTop: "30px"}}
                onClick={openModal}
            >
            <span
                style={{padding : "15px 70px 15px 70px"}}
            >
                Tweet
            </span>
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Modal"
                style={CustomStyles}
                ariaHideApp={false}
            >
            <span className="exit" onClick={closeModal}>
                <i className="fa fa-times" aria-hidden="true"></i>
            </span>
            <div className="header"></div>
            <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (value, { setSubmitting }) => {
                        setSubmitting(true)
                        await createTweet({
                            variables: value,
                        })
                        
                        setSubmitting(false)
                        setIsOpen(false)
                    }}
            >
                    <Form>
                        <Field name="content" type="text" as="textarea" placeholder="What's happening..." />
                        <ErrorMessage name="content" component={'div'} />

                        <div className="footer"></div>
                        <button type="submit" className="tweet-button" >
                            <span>Tweet</span>
                        </button>
                    </Form>
                </Formik>
            </Modal>
        </div>
    );
}

export default Tweet;