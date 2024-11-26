import React from 'react'
import { useEffect } from 'react';
import { gsap } from 'gsap';

const Animation = () => {

    
  useEffect(() => {
    // GSAP animation for random motion
    const elements = document.querySelectorAll('.floating-element');
    elements.forEach((el) => {
      gsap.to(el, {
        x: 'random(-500, 690)',
        y: 'random(-300, 280)',
        rotation: 'random(-360, 360)',
        duration: 'random(3, 9)',
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      });
    });
  }, []);

  return (
    <div>
      <div className="floating-element absolute w-16 h-16 bg-blue-500 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-green-500 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-red-500 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-yellow-500 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-blue-900 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-green-400 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-red-100 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-yellow-900 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-blue-300 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-green-200 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-red-300 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-yellow-900 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-blue-800 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-green-600 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-purple-300 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-black rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-purple-600 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-black rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-purple-700 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-black rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-purple-400 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-black rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-yellow-200 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-yellow-500 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-blue-500 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-green-500 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-red-500 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-yellow-500 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-blue-900 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-green-400 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-red-100 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-yellow-900 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-blue-300 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-green-200 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-red-300 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-yellow-900 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-blue-800 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-green-600 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-purple-300 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-black rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-purple-600 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-black rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-purple-700 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-black rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-purple-400 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-black rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-yellow-200 rounded-full" />
      <div className="floating-element absolute w-16 h-16 bg-yellow-500 rounded-full" />
      
      <img src="app.png" alt="" className="floating-element absolute  h-10" />
      <img src="app.png" alt="" className="floating-element absolute  h-10"/>
      <img src="app.png" alt="" className="floating-element absolute  h-10"/>
      <img src="app.png" alt="" className="floating-element absolute  h-10"/>
      <img src="app.png" alt="" className="floating-element absolute  h-10"/>
      <img src="app.png" alt="" className="floating-element absolute  h-10" />
      <img src="app.png" alt="" className="floating-element absolute  h-10"/>
      <img src="app.png" alt="" className="floating-element absolute  h-10"/>
      <img src="app.png" alt="" className="floating-element absolute  h-10"/>
      <img src="app.png" alt="" className="floating-element absolute  h-10"/>
      <img src="app.png" alt="" className="floating-element absolute  h-10" />
      <img src="app.png" alt="" className="floating-element absolute  h-10"/>
      <img src="app.png" alt="" className="floating-element absolute  h-10"/>
      <img src="app.png" alt="" className="floating-element absolute  h-10"/>
      <img src="app.png" alt="" className="floating-element absolute  h-10"/>
      <img src="app.png" alt="" className="floating-element absolute  h-10" />
      <img src="app.png" alt="" className="floating-element absolute  h-10"/>
      <img src="app.png" alt="" className="floating-element absolute  h-10"/>
      <img src="app.png" alt="" className="floating-element absolute  h-10"/>
      <img src="app.png" alt="" className="floating-element absolute  h-10"/>
    </div>
  )
}

export default Animation
