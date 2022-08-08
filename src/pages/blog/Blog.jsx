import React from 'react'
import { useAuth } from '../../contexts/authContext'
import './blog.scss'

export default function Blog() {
  const {user} = useAuth()
  console.log(user)
  return (
    <div className='blog'>Blog</div>
  )
}
