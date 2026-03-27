

import React from 'react'
import Sidebar from './components/Sidebar'
// import PageBar from './components/PageBar'

const ChatLayout = ({children}:{children:React.ReactNode}) => {

  
  return (
        <div className="flex h-screen w-screen bg-gray-50 overflow-hidden">  
            {/* <div className=' w-15 bg-green-400'>
                <PageBar  />
            </div>  */}
      
      {/* Sidebar - user list */}
      <div className="w-125 min-w-[288px] bg-gray-100 border-r border-gray-300 flex flex-col">
        <Sidebar />
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-white ">
        {children}
      </div>

    </div>
  )
}

export default ChatLayout
