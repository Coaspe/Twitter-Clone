import {gql, useQuery} from '@apollo/client'
import { Redirect } from 'react-router'

const IS_LOGGED_IN = gql`
{
    me {
        id
    }
}
`
interface Props {
    children?: React.ReactNode
}
const IsAuthenticated = ({children} : Props) => {
    const{loading, error, data} = useQuery(IS_LOGGED_IN)
    if(loading) return <p>Loading...</p>
    if (!data) {
        return <Redirect to={{pathname : '/landing'}} />
    }
    if (error) return <p>{error.message}</p>
    console.log("data",data);
    
    return <>{children}</>
}

export default IsAuthenticated;