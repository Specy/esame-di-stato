import React, { Component } from "react"
import { FaUser } from "react-icons/fa"
import NavBar from "./NavBar"
class MyOrders extends Component {
	constructor(props) {
		super(props)
		let bodySize = document.body.getBoundingClientRect()
		this.isPortrait = bodySize.width > bodySize.height 
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
		let response = await fetch("/esame-di-stato/api/getOrders.php")
		.then(data => data.text())
		console.log(response)
		response = JSON.parse(response)
		if (response.status === "error") {
			return alert(`${response.status}! ${response.content}`)
		}
		//raggruppa l'array in un oggetto utilizzando la chiave restaurantId
		let grouped = groupBy(response.content, "restaurantId")
		//prende tutte le chiavi nell'oggetto e le converte in un singolo
		//array di oggetti, contenenti tutti gli ordini fatti in un ristorante
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
