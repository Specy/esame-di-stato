import React, { Component } from "react"
import NavBar from "./NavBar"
import { IoMdRestaurant } from 'react-icons/io'

class RestaurantArea extends Component {
	constructor(props) {
		super(props)
		this.isPortrait = window.screen.width > window.screen.height 
		this.state = {
			openSideMenu: this.isPortrait,
			user: {
				loggedIn: false,
				name: "Non loggato",
			},
			credentials: {
				email: "email@gmail.com",
				password: "123456",
			},
			userOrders: [],
		}
	}
	handleInput = (key, value) => {
		let state = this.state.credentials
		state[key] = value
		this.setState({
			credentials: state,
		})
	}
    mobileOpenSideMenu = () =>{
        this.setState({
            openSideMenu: !this.state.openSideMenu
        })
    }
	login = async () => {
		let response = await fetch("/esame-di-stato/api/getRestaurantOrders.php", {
			method: "POST",
			body: JSON.stringify(this.state.credentials),
		}).then((data) => data.json())
		if (response.status !== "success") {
			return alert(`${response.status}! ${response.content}`)
		}
		let grouped = groupBy(response.content.orders, "userId")
		let data = Object.entries(grouped).map(([key, value]) => {
			return {
				name: grouped[key][0].user,
				address: grouped[key][0].userAddress,
				phoneNumber: grouped[key][0].userPhone,
				orders: grouped[key],
			}
		})
		this.setState({
			userOrders: data,
			user: {
				loggedIn: true,
				name: response.content.restaurantName,
			},
		})
	}
	render() {
		const { state } = this
        let sideMenuClass = this.state.openSideMenu ?'right-page-open right-page' : 'right-page'
		return (
			<div className="main-page">
				<div className="left-page">
					<NavBar
						hidden={true}
						openSide={
							<div className="nav-open-side" onClick={this.mobileOpenSideMenu}>
								<IoMdRestaurant />
							</div>
						}
					/>
					<div className="left-page-padding">
						<div className="orders-wrapper">
							{state.userOrders.map((user) => {
								console.log(user)
								return (
									<div className="order">
										<div className="medium-big-text">{user.name}</div>
										<div className="order-food-wrapper">
											{user.orders.map((order) => {
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
											{user.orders
												.reduce(
													(acc, curr) => (acc += curr.price * curr.quantity),
													0
												)
												.toPrecision(2)}
											€
										</div>
										<div className="user-info-wrapper">
											<div className="row">
												<div className="bold">Indirizzo:</div>
												<div>{user.address}</div>
											</div>
											<div className="row">
												<div className="bold">Numero di telefono:</div>
												<div>{user.phoneNumber}</div>
											</div>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				</div>
				<div className={sideMenuClass}>
					<div className="row center-y space-between">
						<div className="big-text">{this.state.user.name}</div>
						<IoMdRestaurant size={25} />
					</div>
					<div className="restaruant-login-wrapper">
						<div>Fai il login</div>
						<div className="input-wrapper">
							<input
								type="text"
								className="login-input"
								placeholder="email"
								onChange={(e) => this.handleInput("email", e.target.value)}
								value={state.credentials.email}
							/>
						</div>
						<div className="input-wrapper">
							<input
								type="password"
								className="login-input"
								placeholder="password"
								onChange={(e) => this.handleInput("password", e.target.value)}
								value={state.credentials.password}
							/>
						</div>
						<button className="rounded-btn login-btn" onClick={this.login}>
							{state.user.loggedIn ? "Cambia account" : "Login"}
						</button>
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
export default RestaurantArea
