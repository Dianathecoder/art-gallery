import React from 'react'
import Gallery from './Gallery'

export default function App(){
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Galería de Arte</h1>
        <Gallery />
      </div>
    </div>
  )
}

