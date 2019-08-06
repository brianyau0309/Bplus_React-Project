// App.jsx
// Auther: Brian
import React from 'react'
import ReactDOM from 'react-dom'

// Import component from other jsx file
import Page from './Page.jsx'

// The Node to insert DOM element in HTML
const contentNode = document.querySelector("#content")

ReactDOM.render(<Page />, contentNode)
