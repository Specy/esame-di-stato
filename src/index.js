import React, { Component } from "react"
import ReactDOM from "react-dom"
import "./index.css"
import MainPage from "./Components/MainPage"
import RegisterRestaurant from './Components/RegisterRestaurant'
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
					<Route exact path="/">
						<MainPage />
					</Route>

					<Route exact path="/registerRestaurant">
						<RegisterRestaurant />
					</Route>
					<Route exact path="/restaurants"></Route>
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
