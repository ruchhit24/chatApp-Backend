import React from 'react'
import Header from './Header'

const AppLayout = () => (wrappedComponent)=> {
   return(props) =>{
    return (
        <>
            <Header/>
            <wrappedComponent {...props}/>
            
        </>
    )
   }
}

export default AppLayout