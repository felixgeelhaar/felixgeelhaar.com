import React from 'react'
import {render} from 'react-dom'

import './style.css'

const rootEl = document.createElement('div')
rootEl.setAttribute('id', 'root')
document.body.append(rootEl)

const root = document.getElementById('root')
const App = () => (
  <>
    <h1>Hi there!</h1>
    <a href="mailto=hello@felixgeelhaar.de">write me</a>
  </>
)

render(<App />, root)
