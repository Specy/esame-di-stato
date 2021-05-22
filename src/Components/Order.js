import React, { Component, useState } from "react"
import { FaMapMarkerAlt } from "react-icons/fa"
import NavBar from "./NavBar"
import { RestaurantPreviewCard } from "./utils"
import {
	FaChevronRight,
	FaShoppingCart,
	FaPlusCircle,
	FaMinusCircle,
} from "react-icons/fa"
import "./Order.css"
class Orders extends Component {
	constructor(props) {
		super(props)
		let time = new Date(new Date().getTime() + 3600000)
		time = time.toTimeString().split(" ")[0].split(":")
		time.splice(2, 1)
		let bodySize = document.body.getBoundingClientRect()
		this.isPortrait = bodySize.width > bodySize.height 
		this.state = {
			openSideMenu: this.isPortrait,
			restaurant: {
				...(this.props.location.state || new RestaurantPreviewCard({})),
			},
			order: {
				address: "",
				time: time.join(":"),
				foods: [],
				restaurantId: null
			},
		}
	}
	search = () => {}
	showFood = (food) => {
		let order = this.state.order
		food = JSON.parse(JSON.stringify(food))
		let index = order.foods.findIndex((e) => e.id === food.id)
		food.quantity = 1
		if (index !== -1) {
			order.foods[index].quantity += food.quantity
		} else {
			order.foods.push(food)
		}
		this.setState({
			order: order,
		})
	}
	mobileOpenSideMenu = () => {
		this.setState({
			openSideMenu: !this.state.openSideMenu,
		})
	}
	order = async () => {
		let data = this.state.order
		data.restaurantId = Number(this.state.restaurant.id)
		let response = await fetch('/esame-di-stato/api/placeOrder.php',{
			method:'POST',
			body: JSON.stringify(this.state.order)
		}).then(data => data.json())
		alert(`${response.status}! ${response.content}`)
	}
	changeQuantity = (id, quantity) => {
		let order = this.state.order
		let index = order.foods.findIndex((e) => e.id === id)
		let food = order.foods[index]
		food.quantity += quantity
		if (food.quantity <= 0) {
			order.foods.splice(index, 1)
		}
		this.setState({
			order: order,
		})
	}
	handleOrderInput = (key, value) => {}
	render() {
		const { state, props } = this
		let categoryFunctions = {
			showFood: this.showFood,
		}
		let sideMenuClass = this.state.openSideMenu
			? "right-page-open right-page"
			: "right-page"
		let ordersTable = [
			...state.restaurant.menu.table.map((category) => {
				return {
					categoryName: category.categoryName,
					categoryId: category.categoryId,
					foods: this.state.order.foods.filter(
						(food) => food.categoryId === category.categoryId
					),
				}
			}),
		].filter((category) => category.foods.length > 0)
		return (
			<div className="main-page">
				<div className="left-page">
					<NavBar
						placeholder="Cerca cibo"
						search={this.search}
						openSide={
							<div className="nav-open-side" onClick={this.mobileOpenSideMenu}>
								<FaShoppingCart />
							</div>
						}
					/>
					<div className="restaurant-image-wide" style={{ cursor: "default" }}>
						<div className="restaurant-name">{state.restaurant.name}</div>
						<img src={state.restaurant.src} 
													onError={(e) => e.target.src = 'https://cdn.discordapp.com/attachments/771432833034092554/845258746368360468/unknown.png'}
						/>
					</div>
					<div className="restaurant-info">
						<div className="row">
							<div className="bold">Indirizzo: </div>
							<div>
								{state.restaurant.address}		
							</div>
							 
						</div>
						<div className="row">
							<div className="bold">Telefono: </div>{" "}
							<div>
								{state.restaurant.phoneNumber}		
							</div>
						</div>
						<div className="row">
							<div className="bold">Descrizione: </div>
							<div>
								{state.restaurant.description}		
							</div>
						</div>
					</div>
					<div>
						<div className="big-text">Categorie</div>
						{state.restaurant.menu.table.map((category) => (
							<Category data={category} functions={categoryFunctions} />
						))}
					</div>
				</div>

				<div className={sideMenuClass}>
					<div className="row space-between center-y">
						<div className="big-text">Carrello</div>
						<FaShoppingCart size={25} />
					</div>

					<div className="cart-address" style={{display:'none'}}>
						<div className="cart-row">
							<div>Indirizzo</div>
							<input
								value={state.order.address}
								onChange={(e) =>
									this.handleOrderInput("address", e.target.value)
								}
								placeholder="indirizzo"
								type="text"
							/>
						</div>
						<div className="cart-row">
							<div>Orario</div>
							<input
								value={state.order.time}
								onChange={(e) => this.handleOrderInput("time", e.target.value)}
								type="time"
							/>
						</div>
					</div>
					<div className="cart-wrapper">
						{ordersTable.map((category) => {
							return (
								<div>
									<div className="category-name">{category.categoryName}</div>
									{category.foods.map((food) => {
										return (
											<div className="cart-food">
												<div>
													{food.quantity} x {food.name}
												</div>
												<div className="cart-food-buttons">
													<FaMinusCircle
														onClick={() => this.changeQuantity(food.id, -1)}
													/>
													<FaPlusCircle
														onClick={() => this.changeQuantity(food.id, 1)}
													/>
												</div>
											</div>
										)
									})}
								</div>
							)
						})}
					</div>
					<div className="cart-bottom">
						<div className="cart-price">
							<div>
								{state.order.foods
									.reduce((acc, curr) => (acc += curr.price * curr.quantity), 0)
									.toPrecision(2)}
							</div>
							€
						</div>
						<button className="order-btn" onClick={this.order}>
							Ordina
						</button>
					</div>
				</div>
			</div>
		)
	}
}

function Category(props) {
	const { data, functions } = props
	const [visible, toggleVisible] = useState(false)
	return (
		<div className="order-category">
			<div
				className="order-category-title"
				onClick={() => toggleVisible(!visible)}
			>
				<FaChevronRight className={visible ? "rotate-90" : "rotate-0"} />
				<div>{data.categoryName}</div>
			</div>
			<div className={visible ? "visible order-foods-wrapper" : "hidden"}>
				{data.foods.map((food) => {
					return (
						<div className="order-food">
							<div className="order-title">{food.name}</div>
							<div className="order-description">{food.description}</div>
							<div className="row space-between" style={{ marginTop: "auto" }}>
								<div>{food.price}€ </div>
								<FaShoppingCart onClick={() => functions.showFood(food)} />
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
export default Orders
