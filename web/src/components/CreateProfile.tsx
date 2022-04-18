import { gql, useMutation } from '@apollo/client';
import { MutableRefObject, useRef, useState } from 'react';
import { ME_QUERY } from '../pages/Profile';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Modal from 'react-modal';
import CustomStyles from '../styles/CustomModalStyles';

const CREATE_PROFILE_MUTATION = gql`
    mutation createProfile (
        $bio: String
        $location: String
        $website: String
        $avatar: String
    ){
        createProfile(
            bio : $bio
            location : $location
            website : $website
            avatar : $avatar
        ){
            id
        }
    }
`
interface ProfileValue {
        bio: string
        location: string
        website: string
        avatar: string
}

const CreateProfile = () => {
    const [createProfile] = useMutation(CREATE_PROFILE_MUTATION, {
        refetchQueries: [{query: ME_QUERY}]
    }) // second argument is refetch queries
    const [image, setImage] = useState("")
    const inputFile = useRef() as MutableRefObject<HTMLInputElement>
    const [modalIsOpen, setIsOpen] = useState(false);

    const initialValues: ProfileValue = {
        bio: "",
        location: "",
        website: "",
        avatar: ""
    }

    const openModal = () => {
        setIsOpen(true)
    }
    const closeModal = () => {
        setIsOpen(false)
    }

    const uploadImage = async (e: any) => {
        const files = e.target.files
        const data = new FormData()
        data.append('file', files[0])
        data.append('upload_preset', 'Coaspe')
        const res = await fetch("https://api.cloudinary.com/v1_1/dvmln0mla/image/upload", {
            method: "POST",
            body: data
                })
        const file = await res.json()
        setImage(file.secure_url)
    }

    return (
        <div>
            <button onClick={openModal} className="edit-button">Create Profile</button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Modal"
                style={CustomStyles}
            >
                <input
                    type="file"
                    name="file"
                    ref={inputFile}
                    style={{ display: "none" }}
                    onChange={uploadImage}
                />
                {
                    image ? (
                        <img
                            onClick={() => inputFile.current.click()}
                            src={image}
                            style={{width:"150px", borderRadius: "30%"}}
                            alt="avatar"
                        />
                ) : (
                        <span onClick={() => inputFile.current.click()}>
                            <i className="fa fa-user fa-5x" aria-hidden="true"></i>
                        </span>
                )}
                <Formik
                    initialValues={initialValues}
                    // validationSchema={validationSchema}
                    onSubmit={async (value, { setSubmitting }) => {
                        setSubmitting(true)
                        await createProfile({
                            variables: { ...value, avatar:image }
                        })
                        
                        setSubmitting(false)
                        setIsOpen(false)
                    }}
                >
                    <Form>
                        <Field name="bio" type="text" as="textarea" placeholder="Bio" />
                        <ErrorMessage name="bio" component={'div'} />
                        <Field name="location" type="location" placeholder="Location" />
                        <ErrorMessage name="location" component={'div'} />
                        <Field name="website" type="website" placeholder="Website" />
                        <ErrorMessage name="website" component={'div'} />
                    
                        <button type="submit" className="login-button" >
                            <span>Create Profile</span>
                        </button>
                    </Form>

                </Formik>
            </Modal>
        </div>
    );
}

export default CreateProfile