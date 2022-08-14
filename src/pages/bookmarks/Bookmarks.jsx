import React from 'react'
import './bookmarks.scss'
import {motion} from 'framer-motion'

export default function Bookmarks() {
  return (
    <motion.div className='bookmarks' initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: .1 }}>Bookmarks</motion.div>
  )
}
