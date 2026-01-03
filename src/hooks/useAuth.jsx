import React, { useContext } from 'react'
import { AuthContext } from '../context/Auth/AuthCOntext'

const useAuth = () => {
    const authInfo = useContext(AuthContext)
  return authInfo
}

export default useAuth
