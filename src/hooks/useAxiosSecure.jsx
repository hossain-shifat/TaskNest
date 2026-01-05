import axios from 'axios'
import React, { useEffect } from 'react'
import useAuth from './useAuth'

const axiosSecure = axios.create({
    baseURL: 'https://tasknest-backend-ashen.vercel.app'
})

const useAxiosSecure = () => {
    const { user } = useAuth()
    useEffect(() => {
        // interceptor request
        const requestInterceptors = axiosSecure.interceptors.request.use((config) => {
            config.headers.Authorization = `Bearer ${user?.accessToken}`
            return config
        })

        // interseptors responce
        const responceIntercepor = axiosSecure.interceptors.response.use((response) => {
            return response
        }, (error) => {
            console.log(error)

            const statusCode = error.response?.status;
            if (statusCode === 401 || statusCode === 403) {
                console.log("Unauthorized: Token invalid or expired")
            }

            return Promise.reject(error)
        })

        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptors)
            axiosSecure.interceptors.response.eject(responceIntercepor)
        }

    }, [user])

    return axiosSecure

}

export default useAxiosSecure
