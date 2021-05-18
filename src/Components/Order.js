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
		this.state = {
			restaurant: {
				...new RestaurantPreviewCard(),
			},
			order: {
				address: "",
				time: time.getHours() +':'+time.getMinutes(),
				foods: [],
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
	handleOrderInput = (key, value) => {}
	render() {
		const { state, props } = this
		let categoryFunctions = {
			showFood: this.showFood,
		}
		return (
			<div className="main-page">
				<div className="left-page">
					<NavBar placeholder="Cerca cibo" search={this.search} />
					<div className="restaurant-image-wide" style={{ cursor: "default" }}>
						<div className="restaurant-name">{state.restaurant.name}</div>
						<img src={state.restaurant.src} />
					</div>
                    <div>
                       <div className='row'>
                            Indirizzo: {state.restaurant.address}
                       </div>
                       <div className='row'>
                            Telefono: {state.restaurant.address}
                       </div>
                       <div className='row'>
                            Indirizzo: {state.restaurant.address}
                       </div>
                    </div>
					<div>
						<div className="big-text">Categorie</div>
						{state.restaurant.menu.table.map((category) => (
							<Category data={category} functions={categoryFunctions} />
						))}
					</div>
				</div>

				<div className="right-page">
					<div className="row space-between center-y">
						<div className="big-text">Carrello</div>
						<FaShoppingCart size={25} />
					</div>

					<div className="cart-address">
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
						{state.order.foods.map((food) => {
							return (
								<div className="cart-food">
									<div>
										{food.quantity} x {food.name}
									</div>
									<div className="cart-food-buttons">
										<FaMinusCircle />
										<FaPlusCircle />
									</div>
								</div>
							)
						})}
					</div>
					<div className="cart-bottom">
						<div className="cart-price">
							<div>
								{state.order.foods
									.reduce((acc, curr) => (acc += curr.price), 0)
									.toPrecision(2)}
							</div>
							€
						</div>
						<button className="order-btn">Ordina</button>
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
		<div className="order-cateogry">
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
