"use client"
import React, { useState } from 'react'
import IconTextButton from '../buttons/IconTextButton'
import { BsColumnsGap, BsClipboard2Check, BsCashStack, BsPeopleFill, BsBarChartFill } from "react-icons/bs";

function BottomBar() {
    const [ nav, setNav ] = useState("Dashboard")
  return (
    <header className=''>
        <nav className='flex justify-center item-center gap-8'>
            <IconTextButton textNav={nav} setText={setNav} text='Dashboard' icon={<BsColumnsGap className='w-4 h-4'/>}/>
       
            <IconTextButton textNav={nav} setText={setNav} text='Projects' icon={<BsClipboard2Check className='w-4 h-4'/>}/>
        
            <IconTextButton textNav={nav} setText={setNav} text='Payments' icon={<BsCashStack className='w-4 h-4'/>}/>
        
            <IconTextButton textNav={nav} setText={setNav} text='Members' icon={<BsPeopleFill className='w-4 h-4'/>}/>
        
            <IconTextButton textNav={nav} setText={setNav} text='Charts' icon={<BsBarChartFill className='w-4 h-4'/>}/>
        </nav>
    </header>
  )
}

export default BottomBar