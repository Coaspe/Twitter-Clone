import { gql, useMutation, useQuery } from '@apollo/client';
import React, { MutableRefObject, useRef, useState } from 'react';
import { ME_QUERY } from '../pages/Profile';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Modal from 'react-modal';
import CustomStyles from '../styles/CustomModalStyles';
import '../styles/UpdateProfile.css'

const UPDATE_PROFILE_MUTATION = gql`
    mutation updateProfile (
        $id: Int!
        $bio: String
        $location: String
        $website: String
        $avatar: String
    ){
        updateProfile(
            id : $id
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
        id : number
        bio: string
        location: string
        website: string
        avatar: string
}

const UpdateProfile = () => {
    const inputFile = useRef() as MutableRefObject<HTMLInputElement>
    // const inputFile = useRef<HTMLInputElement | null>(null)
    const [image, setImage] = useState("")
    const [imageLoading, setImageLoading] = useState(false)
    const { loading, error, data } = useQuery(ME_QUERY)
    const [updateProfile] = useMutation(UPDATE_PROFILE_MUTATION, {
        refetchQueries: [{query: ME_QUERY}]
    }) // second argument is refetch queries
    
    const [modalIsOpen, setIsOpen] = useState(false);

    if(loading) return <p>Loading...</p>
    if (error) return <p>{error.message}</p>

    const initialValues: ProfileValue = {
        id: data.me.Profile.id,
        bio: data.me.Profile.bio,
        location: data.me.Profile.location,
        website: data.me.Profile.website,
        avatar:data.me.Profile.avatar
    }

    const openModal = () => {
        setIsOpen(true)
    }
    const closeModal = () => {
        setIsOpen(false)
    }

    const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        
        const files = e.target.files as FileList
        const data = new FormData()
        data.append('file', files[0])
        data.append("upload_preset", "Coaspe")
        setImageLoading(true)
        const res = await fetch("h", {
            method: "POST",
            body: data
        })
        const file = await res.json()
        
        setImage(file.secure_url)
        setImageLoading(false)
    }
    return (
        <div>
            <button onClick={openModal} className="edit-button">Edit Profile</button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Modal"
                style={CustomStyles}
                ariaHideApp={false}
            >
                <input
                    type="file"
                    name="file"
                    placeholder="upload file"
                    onChange={uploadImage}
                    ref={inputFile}
                    style={{display:"none"}}
                />
                {/* velog 정리 */}
                {imageLoading ? (
                    <h3>Loading...</h3>
                ) : (
                        <>
                            {data.me.Profile.avatar ? (
                                // span 클릭하면 위에 input을 클릭한 것과 같다
                                <span onClick={() => inputFile.current.click()}> 
                                    <img className="profile_img"
                                    src={data.me.Profile.avatar}
                                    style={{width:"150px", borderRadius: "30%"}}
                                        alt="avatar"
                                    />
                                </span>
                            ) : (
                                <span onClick={() => inputFile.current.click()}>
                                    <i className="fa fa-user fa-5x" aria-hidden="true"></i>
                                </span>
                                )
                            }
                        </>
                )}
            <Formik
                    initialValues={initialValues}
                    // validationSchema={validationSchema}
                    onSubmit={async (value, { setSubmitting }) => {
                        setSubmitting(true)
                        await updateProfile({
                            variables: {...value, avatar: image}
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
                            <span>Update Profile</span>
                        </button>
                    </Form>

                </Formik>
                </Modal>
        </div>
    );
}

export default UpdateProfile