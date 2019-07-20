import React from 'react'
import {render} from 'react-dom'
import App from 'App'

import './style.css'

const rootEl = document.createElement('div')
rootEl.setAttribute('id', 'root')
document.body.append(rootEl)

const root = document.getElementById('root')

render(<App />, root)
