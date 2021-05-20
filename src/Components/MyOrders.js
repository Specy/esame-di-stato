import React, { Component } from "react"
import { FaUser } from "react-icons/fa"
import NavBar from "./NavBar"
class MyOrders extends Component {
	constructor(props) {
		super(props)
		this.isPortrait = window.screen.width > window.screen.height
		let storedName = localStorage.getItem("name")
		storedName = storedName === null ? "Non sei loggato" : storedName
		this.state = {
			name: storedName,
			openSideMenu: this.isPortrait,
			restaurantsOrders: [],
		}
		this.sync()
	}
	sync = async () => {
		let response = await fetch("api/getOrders.php").then((data) => data.json())
		console.log(response)
		if (response.status === "error") {
			return alert(`${response.status}! ${response.content}`)
		}
		let grouped = groupBy(response.content, "restaurantId")
		let data = Object.entries(grouped).map(([key, value]) => {
			return {
				name: grouped[key][0].restaurantName,
				orders: grouped[key],
			}
		})
		this.setState({
			restaurantsOrders: data,
		})
	}
	mobileOpenSideMenu = () => {
		this.setState({
			openSideMenu: !this.state.openSideMenu,
		})
	}
	render() {
		const { state } = this
		let sideMenuClass = state.openSideMenu
			? "right-page-open right-page"
			: "right-page"
		return (
			<div className="main-page">
				<div className="left-page">
					<NavBar
						hidden={true}
						openSide={
							<div className="nav-open-side" onClick={this.mobileOpenSideMenu}>
								<FaUser />
							</div>
						}
					/>
					<div className="left-page-padding">
						<div className="big-text">Le mie ordinazioni</div>
						<div className="orders-wrapper">
							{state.restaurantsOrders.map((restaurant) => {
								return (
									<div className="order">
										<div className="medium-big-text">{restaurant.name}</div>
										<div className="order-food-wrapper">
											{restaurant.orders.map((order) => {
												return (
													<div className="order-food-row">
														<div>
															{order.quantity} x {order.name}
														</div>
														<div>{order.quantity * order.price}€</div>
													</div>
												)
											})}
										</div>
										<div className="order-total-price">
											Totale:{" "}
											{restaurant.orders
												.reduce(
													(acc, curr) => (acc += curr.price * curr.quantity),
													0
												)
												.toPrecision(2)}
											€
										</div>
									</div>
								)
							})}
						</div>
					</div>
				</div>
				<div className={sideMenuClass}>
					<div className="big-text space-between row center-y">
						<div>{state.name}</div>
						<FaUser />
					</div>
				</div>
			</div>
		)
	}
}

var groupBy = function (xs, key) {
	return xs.reduce(function (rv, x) {
		;(rv[x[key]] = rv[x[key]] || []).push(x)
		return rv
	}, {})
}

export default MyOrders
