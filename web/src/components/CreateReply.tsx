import { gql, useMutation, useQuery } from '@apollo/client';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useState } from 'react';
import Modal from 'react-modal';
import { ME_QUERY } from '../pages/Profile';
import CustomStyles from '../styles/CustomModalStyles';
import * as Yup from 'yup';
import "../styles/tweet.css"
import { TWEET_QUERY } from '../pages/SingleTweet';

const CREATE_REPLY_MUTATION = gql`
    mutation createReply($content: String, $id: Int!, $commentID : Int) {
        createReply(content: $content, id: $id, commentID: $commentID) {
            id
        }
    }
`
interface CommentProps {
    content : string
}
interface Props {
    name : string
    avatar : string
    id: number
    comment: string
    commentID: number
}

const CreateReply = ({avatar, name, id, comment, commentID}: Props) => {
    const [createComment] = useMutation(CREATE_REPLY_MUTATION, {
        refetchQueries: [{query: ME_QUERY}, {query: TWEET_QUERY, variables: {id}}]
    })

    const [modalIsOpen, setIsOpen] = useState(false);
    const { loading, error, data } = useQuery(ME_QUERY);

    if (loading) {
        return <p>Loading...</p>
    }
    if (error) {
        <p>{ error.message}</p>
    }

    const openModal = () => {
        setIsOpen(true)
    }
    const closeModal = () => {
        setIsOpen(false)
    }

    const initialValues: CommentProps = {
        content: ""
    }

    const validationSchema = Yup.object({
        content: Yup.string().required().min(1, "Must be more than 1 character").max(256, "Must be less than 257 characters")
    })

    return (
        <div>
            <span onClick={openModal}>
                <i className="far fa-comment" aria-hidden="true"></i>
            </span>

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
                <div className="header" />
				<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 8fr", marginTop: "10px" }}>
					<img src={avatar} style={{ width: "40px", borderRadius: "50%" }} alt="avatar" />
					<h5>{name}</h5>
				</div>
				<p
					style={{
						marginLeft: "20px",
						borderLeft: "1px solid var(--accent)",
						paddingLeft: "20px",
						height: "50px",
						marginTop: 0
					}}
				>
					{comment}
				</p>
            <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (value, { setSubmitting }) => {
                        setSubmitting(true)
                        await createComment({
                            variables: {...value, id, commentID},
                        })
                        
                        setSubmitting(false)
                        setIsOpen(false)
                    }}
            >
                    <Form>
                        <img src={data.me.Profile.avatar} style={{width:"40px",borderRadius:"50%"}} alt="avartar"/>
                        <Field name="content" type="text" as="textarea" placeholder="Your reply." />
                        <ErrorMessage name="content" component={'div'} />

                        <div className="footer"></div>
                        <button type="submit" className="tweet-button" >
                            <span>Reply</span>
                        </button>
                    </Form>
                </Formik>
            </Modal>
        </div>
    );
}

export default CreateReply;