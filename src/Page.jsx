// Page.jsx 
// Auther: Brian
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Nav from './Nav.jsx'
import Footer from './Footer.jsx'

import Memo from './Memo.jsx'
import Notification from './Notification.jsx'
import Counter from './Counter.jsx'

export default class Page extends React.Component {
    render() {
        return (
        <div>
            <header>
                <a>Bplus</a>
            </header>
            <Router>
                <Nav />
                <main>
                    <Switch>
                        <Route path="/cloud" component={Memo} /> 
                        <Route path="/calendar" component={Memo} /> 
                        <Route path="/memo" component={Memo} /> 
                        <Route path="/notification" component={Notification} /> 
                        <Route path="/counter/:id" component={Counter} />
                        <Route path="/counter" component={Counter} /> 
                    </Switch>
                </main>
            </Router>
        </div>
        )
    }
}
