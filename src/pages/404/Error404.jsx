import React from 'react'
import { Link } from 'react-router-dom'
import './error404.scss'

export default function Error404() {
  return (
    <div>
        <h2>404 ERROR</h2>
        <p>Sorry this page dosent exist</p>
        <Link to='/'>&larr; Back to home</Link>
    </div>
  )
}
