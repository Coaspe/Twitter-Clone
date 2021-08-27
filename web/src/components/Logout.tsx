import { useHistory } from "react-router";
import {useState} from 'react'
import React from "react";
import Modal from 'react-modal';
import { logoutModalStyles } from "../styles/LogoutMadal";
import { useQuery } from "@apollo/client";
import { ME_QUERY } from "../pages/Profile";
import "../styles/logout.css"

const Logout = () => {
    const history = useHistory() // to redirect
    const [modalIsOpen, setIsOpen] = useState(false);

    const {loading, error, data} = useQuery(ME_QUERY)
    if (loading) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>{error.message}</p>
    }
    const openModal = () => {
        setIsOpen(true)
    }
    const closeModal = () => {
        setIsOpen(false)
    }

    const handleLogout = async () => {
        localStorage.removeItem('token')
        console.log(history);
        history.push('login') // Change window to login page
    }

    return (
        <div className="logout">
            <span onClick={openModal} style={{flex: 1, flexDirection: 'row'}}>
                <h4>
(                    <img
                        src={data.me.Profile.avatar}
                        style={{ width: "40px", borderRadius: "50%" }}
                        alt="avatar" />)
                    <span style={{ marginLeft: "10px", marginTop: "-10px" }}>
                        {data.me.name}
                    </span>
                    <span style={{marginLeft: "30px"}}>
                        <i className="fas fa-ellipiss-h"></i>
                    </span>
                </h4>
            </span>
            <div style={{position: 'absolute', bottom:0}}>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Modal"
                    style={logoutModalStyles}
                >
                    <span onClick={handleLogout} style={{ cursor: 'pointer' }}>
                        <p style={{borderBottom: '1px solid black'}}>
                            Log out @{data.me.name}
                        </p>
                    </span>
                </Modal>
            </div>
        </div>
    );
}

export default Logout;