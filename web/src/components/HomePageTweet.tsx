import { gql, useMutation } from '@apollo/client';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "../styles/tweet.css"
import { TWEETS_QUERY } from './AllTweets';

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

const HomePageTweet = () => {
    const [createTweet] = useMutation(CREATE_TWEET_MUTATION, {
        refetchQueries: [{query: TWEETS_QUERY}] // auto refresh
    })

    const initialValues: TweetValues = {
        content: ""
    }

    const validationSchema = Yup.object({
        content: Yup.string().required().min(1, "Must be more than 1 character").max(256, "Must be less than 257 characters")
    })

    return (
        <div className="home-page-tweet">
            <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (value, { setSubmitting }) => {
                        setSubmitting(true)
                        await createTweet({
                            variables: value,
                        })
                        
                        setSubmitting(false)
                    }}
            >
                    <Form>
                        <Field
                            name="content"
                            type="text"
                            as="textarea"
                            placeholder="What's happening..."
                        />
                        <ErrorMessage name="content" component={'div'} />

                        <button type="submit" className="home-tweet-button" >
                            <span>Tweet</span>
                        </button>
                    </Form>
            </Formik>
            <div className="foote"/>
        </div>
    );
}

export default HomePageTweet;