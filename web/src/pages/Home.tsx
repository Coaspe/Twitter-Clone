import { gql, useQuery } from '@apollo/client';
import "../styles/home.css"
import "../styles/primary.css"
import '../styles/UpdateProfile.css'
import LeftNav from '../components/LeftNav';
import AllTweets from '../components/AllTweets';
import HomePageTweet from '../components/HomePageTweet';
import PopularTweets from '../components/PopularTweets';

export const ME_QUERY = gql`
    query me {
        me {
            id
            name
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

const Home = () => {
  
    const { loading, error} = useQuery(ME_QUERY);
    if (loading) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>{error.message}</p>
    }
    return (
        <>
            <div className="primary">
                    <div className="left">
                        <LeftNav />
                    </div>
                    <div className="home">
                        <div className="home-header">
                        <h3 className="home-title">Home</h3>
                        <HomePageTweet />
                        <AllTweets />
                        </div>
                    </div>
                    <div className="right">
                        <PopularTweets />
                    </div>
            </div>
        </>
    );
}

export default Home;