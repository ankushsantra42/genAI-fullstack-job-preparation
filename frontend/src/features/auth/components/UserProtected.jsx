import React from 'react'
import { useAuth } from '../hook/useAuth'
import { Navigate } from 'react-router';

export default function UserProtected({children}) {
    const { user, loading } = useAuth();

    if(loading){
        return <div><h1>Loading...</h1></div>
    }
    if(!user){
        return <Navigate to="/login" />
    }
    return (
        <div>{children}</div>
    )
}
