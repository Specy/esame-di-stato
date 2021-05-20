import React, { Component } from "react"
import ReactDOM from "react-dom"
import "./index.css"
import MainPage from "./Components/MainPage"
import RegisterRestaurant from './Components/RegisterRestaurant'
import Order from './Components/Order'
import { Route, Link, HashRouter } from "react-router-dom"
import * as serviceWorkerRegistration from "./serviceWorkerRegistration"

class Index extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}
	render() {
		return (
			<div className="pages-wrapper">
				<HashRouter>
					<Route exact path="/" component={MainPage}/>
					<Route exact path="/registerRestaurant" component={RegisterRestaurant}/>
					<Route exact path="/order" component={Order}/>
				</HashRouter>
			</div>
		)
	}
}

ReactDOM.render(
	<React.StrictMode>
		<Index />
	</React.StrictMode>,
	document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister()
