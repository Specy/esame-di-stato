import React, { Component, useRef, useState } from "react"
import "./MainPage.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
	faUser,
	faCheck,
	faTimes,
	faFilter,
} from "@fortawesome/free-solid-svg-icons"
import NavBar from "./NavBar"
import RestaurantPreview from "./RestaurantPreview"
import { RestaurantPreviewCard } from "./utils"
import { FaMapMarkerAlt, FaPlus } from "react-icons/fa"
import { matchSorter } from "match-sorter"
import Menu from "./Menu"
import { Link } from "react-router-dom"
class MainPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			user: {
				name: "Nome Utente",
			},
			restaurantPreview: {
				visible: false,
				...new RestaurantPreviewCard(),
			},
			login: {
				email: "",
				password: "",
			},
			register: {
				email: "",
				password: "",
				name: "",
				surname: "",
				address: "",
			},
			step: "login",
			search: "",
			restaurants: [
				new RestaurantPreviewCard(),
				new RestaurantPreviewCard(),
				new RestaurantPreviewCard(),
				new RestaurantPreviewCard(),
				new RestaurantPreviewCard(),
				new RestaurantPreviewCard(),
				new RestaurantPreviewCard(),
				new RestaurantPreviewCard(),
				new RestaurantPreviewCard(),
			],
		}
	}
	handleInput = (obj) => {}
	changeStep = (step) => {
		this.setState({
			step: step,
		})
	}
	search = (newSearch) => {
		let sort = matchSorter(this.state.restaurants, newSearch, {
			keys: ["name", "tags"],
			threshold: matchSorter.rankings.NO_MATCH,
		})
		this.setState({
			search: newSearch,
			restaurants: sort,
		})
	}
	selectRestaurantPreview = (restaurant) => {
		this.setState({
			restaurantPreview: {
				visible: true,
				...restaurant,
			},
		})
	}
	hideRestaurantPreview = () => {
		let preview = this.state.restaurantPreview
		preview.visible = false
		this.setState({
			restaurantPreview: preview,
		})
	}
	render() {
		const { step, user, restaurants, restaurantPreview } = this.state
		return (
			<div className="main-page">
				<div
					className={
						"blur-filter " +
						(restaurantPreview.visible ? "scale-expand" : "scale-close")
					}
				>
					<div className={"restaurant-floating-data box-shadow "}>
						<div className="floating-restaurant-title">
							<div>{restaurantPreview.name}</div>
							<img src={restaurantPreview.src} />
						</div>

						<div className="floating-restaurant-address">
							<div>
								<FaMapMarkerAlt /> {restaurantPreview.address}
							</div>

							<button
								className="visit-btn"
								style={{ backgroundColor: "var(--dark-blue)" }}
								onClick={this.hideRestaurantPreview}
							>
								Chiudi
							</button>
						</div>
						<div>{restaurantPreview.description}</div>
						<Menu data={restaurantPreview}></Menu>
						<button className="visit-btn">Visita</button>
					</div>
				</div>

				<div className="left-page">
					<NavBar placeholder="Cerca un ristorante" search={this.search} />
					<div className="left-page-top-container">
						<div>Un ristorante, un ordine, è tutto ciò che ti serve.</div>
					</div>
					<div className="title-and-filter">
						<div className="big-text">Ristoranti</div>
						<div className="filter-wrapper">
							Filtra
							<FontAwesomeIcon icon={faFilter} />
						</div>
					</div>

					<div className="restaurants-wrapper">
						{restaurants.map((restaurant) => (
							<RestaurantPreview
								click={this.selectRestaurantPreview}
								key={restaurant.name}
								data={restaurant}
							/>
						))}
						<Link to='registerRestaurant'>
							<div className="restaurant-preview add-restaurant">
								<FaPlus size={20} />
								<div>Vuoi registrare il tuo ristorante? Clicca qui</div>
							</div>
						</Link>
					</div>
				</div>
				<div className="right-page">
					<div className="row center-y space-between">
						<div className="big-text center-y">{user.name}</div>
						<FontAwesomeIcon icon={faUser} className="user-icon" />
					</div>
					<div className="login-wrapper">
						<div
							className={
								step === "login"
									? "login-btn-wrapper login-btn-wrapper-visible"
									: "login-btn-wrapper"
							}
						>
							<div>Bentornato, entra nel tuo account!</div>

							<div className="login-form">
								{Object.entries(this.state.login).map(([key, value]) => {
									return (
										<InputEl
											key={key + value}
											objKey={key}
											value={value}
											sendChange={this.handleInput}
										/>
									)
								})}
							</div>

							<button
								className="rounded-btn login-btn"
								onClick={() => this.changeStep("login")}
							>
								Fai il login
							</button>
							<div className="small-text">oppure</div>
							<button
								className="rounded-btn register-btn"
								onClick={() => this.changeStep("register")}
							>
								Registrati
							</button>
						</div>

						<div
							className={
								step === "register"
									? "login-btn-wrapper login-btn-wrapper-visible"
									: "login-btn-wrapper"
							}
						>
							<div>Registrati!</div>
							<div className="login-form">
								{Object.entries(this.state.register).map(([key, value]) => {
									return (
										<InputEl
											key={key + value}
											objKey={key}
											value={value}
											sendChange={this.handleInput}
										/>
									)
								})}
							</div>
							<button
								className="rounded-btn login-btn"
								onClick={() => this.changeStep("register")}
							>
								Registrati
							</button>
							<div className="small-text">oppure</div>
							<button
								className="rounded-btn register-btn"
								onClick={() => this.changeStep("login")}
							>
								Fai il login
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

function InputEl(props) {
	const { objKey, value, sendChange } = props
	const [valid, changeValidity] = useState(false)
	const [inputValue, setValue] = useState(value)
	let type = objKey === "password" ? "password" : "text"
	let regex = /.{3,}$/
	if (objKey === "email") regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
	if (objKey === "password") regex = /.{6,}$/
	const ref = useRef()
	function update() {
		let el = ref.current
		let value = el.value
		changeValidity(regex.test(value))
		console.log(regex.test(value))
		setValue(value)
	}
	function updateParent() {
		sendChange({ key: objKey, value: value })
	}
	return (
		<div className="input-wrapper">
			<input
				className="login-input"
				type={type}
				value={inputValue}
				ref={ref}
				onInput={update}
				placeholder={capitalize(objKey)}
				onBlur={updateParent}
			/>
			<FontAwesomeIcon
				icon={valid ? faCheck : faTimes}
				className={(valid ? "valid" : "invalid") + " valid-icon"}
			/>
		</div>
	)
}

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}
export default MainPage
