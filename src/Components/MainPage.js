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
import { FaMapMarkerAlt, FaPlus, FaUser } from "react-icons/fa"
import { matchSorter } from "match-sorter"
import Menu from "./Menu"
import { Link } from "react-router-dom"
class MainPage extends Component {
	constructor(props) {
		super(props)
		let bodySize = document.body.getBoundingClientRect()
		this.isPortrait = bodySize.width > bodySize.height 
		this.state = {
			openSideMenu:this.isPortrait ,
			user: {
				name: "Non loggato",
			},
			restaurantPreview: {
				visible: false,
				...new RestaurantPreviewCard({}),
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
				phoneNumber: ""
			},
			step: "login",
			search: "",
			restaurants: [

			]

		}
		this.sync()
	}

	sync = async () =>{
		let restaurants = await fetch('/esame-di-stato/api/getRestaurants.php').then(data => data.json())
		restaurants = restaurants.map(restaurant => {
			return new RestaurantPreviewCard(restaurant)
		})
		this.setState({
			restaurants: restaurants
		})
		let validSession = await fetch('/esame-di-stato/api/checkSession.php').then(data => data.json())
		if(validSession){
			this.setState({
				user:{
					name: localStorage.getItem('name')
				}
			})
		}

	}
	handleInput = (obj) => {
		let state = this.state[this.state.step]
		state[obj.key] = obj.value
		this.setState({
			state: this.state
		})
	}
	mobileOpenSideMenu = () =>{
        this.setState({
            openSideMenu: !this.state.openSideMenu
        })
    }
	register = async () => {
		let response = await fetch("/esame-di-stato/api/registerUser.php",{
			method:"POST",
			body:JSON.stringify(this.state.register)
		}).then(data => data.json())
		alert(`${response.status}! ${response.content}`)
	}
	login = async () => {
		let response = await fetch("/esame-di-stato/api/loginUser.php",{
			method:"POST",
			body:JSON.stringify(this.state.login)
		}).then(data => data.json())
		localStorage.setItem('name',response.content.name)
		alert(`${response.status}! Loggato come: ${response.content.name}`)
		this.setState({
			user:{
				name:response.content.name
			}
		})
	}
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
		console.log(restaurant)
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
		let sideMenuClass = this.state.openSideMenu ?'right-page-open right-page' : 'right-page'
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
							<img src={restaurantPreview.src} 
							onError={(e) => e.target.src = 'https://cdn.discordapp.com/attachments/771432833034092554/845258746368360468/unknown.png'}
							/>
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
						<Link to={{
							pathname:'order',
							state: this.state.restaurantPreview
						}}>	
							<button className="visit-btn" style={{width:'100%', marginBottom:'1rem'}}>Visita</button>
						</Link>
						
					</div>
				</div>

				<div className="left-page">
					<NavBar 
						placeholder="Cerca un ristorante" 
						search={this.search} 
						openSide={<div className='nav-open-side' onClick={this.mobileOpenSideMenu}>
							<FaUser />
						</div>}
					/>
					<div className="left-page-top-container">
						<div>Un ristorante, un ordine, è tutto ciò che ti serve.</div>
					</div>
					<div className="title-and-filter">
						<div className="big-text">Ristoranti</div>
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
				<div className={sideMenuClass}>
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
								onClick={this.login}
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
								onClick={this.register}
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
	const [inputValue, setValue] = useState(value)
	let type = objKey === "password" ? "password" : "text"
	let regex = /.{3,}$/
	if (objKey === "email") regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
	if (objKey === "password") regex = /.{6,}$/
	const [valid, changeValidity] = useState(regex.test(value))
	const ref = useRef()
	function update() {
		let el = ref.current
		let value = el.value
		changeValidity(regex.test(value))
		setValue(value)
	}
	function updateParent() {
		sendChange({ key: objKey, value: inputValue })
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
