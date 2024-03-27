import React from 'react'
import AppLayout from '../components/AppLayout'

const Home = () => {
  return (
    <AppLayout> {/* No need for wrapping () */}
      <div className='p-8'> 
        <h1 className='text-center font-bold text-xl'>S E L E C T _ A _ F R I E N D _ T O _ C H A T </h1>
      </div>
    </AppLayout>
  )
}

export default Home;
