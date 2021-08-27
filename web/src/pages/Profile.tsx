import { gql, useQuery } from '@apollo/client';
import { Link, useHistory } from 'react-router-dom';
import CreateProfile from '../components/CreateProfile';
import UpdateProfile from '../components/UpdateProfile';
import "../styles/profile.css"
import "../styles/primary.css"
import '../styles/UpdateProfile.css'
import LeftNav from '../components/LeftNav';
import PopularTweets from '../components/PopularTweets';
import LikedTweets from '../components/LikedTweets';
import Following from '../components/Following';

export const ME_QUERY = gql`
    query me {
        me {
            id
            name
            Following {
                id
                followId
                name
                avatar
            }
            likedTweet {
                id
                tweet {
                    id
                    content
                    createdAt
                    author {
                        id
                        name
                        Profile {
                            id
                            avatar
                        }
                    }
                }
            }
            Profile {
                id
                bio
                location
                website
                avatar
            }
        }
    }
`

const Profile = () => {
    // npm install react-modal
    // npm install -D @types/react-modal
    const history = useHistory();
    const { loading, error, data } = useQuery(ME_QUERY);
    if (loading) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>{error.message}</p>
    }
    return (
        <>
        <div className="primary">
                <div className="left"><LeftNav /></div>
                <div className="profile">
                    <div className="profile-info">
                        <div className="profile-head">
                            <span className="back-arrow" onClick={() => history.goBack()}>
                                <i className="fa fa-arrow-left" aria-hidden="true"></i>
                            </span>
                            <span className="nickname">
                                <h3>{data.me.name}</h3>
                            </span>
                        </div>
                        <div className="avatar">
                            {data.me.Profile?.avatar ? (
                                <img className="profile_img"
                                src={data.me.Profile.avatar}
                                style={{width:"150px", borderRadius: "30%"}}
                                    alt="avatar"
                                />
                            ) : (<i className="fa fa-user fa-5x" aria-hidden="true"></i>) }
                        </div>
                        <div className="make-profile">
                            {data.me.Profile ? <UpdateProfile /> : <CreateProfile />}
                        </div>

                        <h3 className="name">{data.me.name}</h3>
                        {data.me.Profile ? 
                            <p>{data.me.Profile.bio}</p>
                            : null}
                        {data.me.Profile ? 
                            <p>{data.me.Profile.location}</p>
                         : null}
                        {data.me.Profile ? (
                            <p>
                                <i className="fas fa-link"> </i>{" "}
                                <Link
                                    to={{ pathname: `http://${data.me.Profile.website}` }}
                                    target="_blank"
                                >
                                    {data.me.Profile.website}
                                </Link>
                            </p>
                        ) : null}
                        <div className="followers">
                            <Following />
                            <p>384 followers</p>
                        </div>
                    </div>
                    <LikedTweets tweets={data.me} />
                </div>
                <div className="right">
                    <PopularTweets />
                </div>
        </div>
        </>
    );
}

export default Profile;