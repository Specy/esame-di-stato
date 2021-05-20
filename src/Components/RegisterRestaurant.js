import React, { Component, useRef } from "react"
import { FaMapMarkerAlt, FaPlus, FaTimes } from "react-icons/fa"
import { IoMdRestaurant } from 'react-icons/io'
import NavBar from "./NavBar"
import "./RegisterRestaurant.css"
import Picker from "emoji-picker-react"
import EmojiPicker from "emoji-picker-react"
class RegisterRestaurant extends Component {
	constructor(props) {
		super(props)
		this.isPortrait = window.screen.width > window.screen.height 
		this.state = {
			openSideMenu: this.isPortrait,
			info: {
				src: "",
				name: "",
				address: "",
				description: "",
				phoneNumber: "",
				email: "",
				password: "",
				tags: "",
			},
			menu: {
				categories: [new Category()],
				foods: [new Food()],
			},
		}
	}
	addCategoryInput = () => {
		let menu = this.state.menu
		let nextCategory = new Category()
		let nextId = Math.max(...menu.categories.map((e) => e.id)) + 1

		nextCategory.id = nextId
		nextCategory.name += nextCategory.id
		menu.categories.push(nextCategory)
		this.setState({
			menu: menu,
		})
	}
	addImage = (base64) => {
		let info = this.state.info
		info.src = base64
		this.setState({
			info: info,
		})
	}
	handleCategory = (id, value, key) => {
		let menu = this.state.menu
		let category =
			menu.categories[menu.categories.findIndex((e) => e.id === id)]
		if (category !== undefined) {
			category[key] = value
		}
		this.setState({
			menu: menu,
		})
	}
	handleFood = (id, value, key) => {
		let menu = this.state.menu
		let food = menu.foods[menu.foods.findIndex((e) => e.id === id)]
		if (food !== undefined) {
			food[key] = value
		}
		this.setState({
			menu: menu,
		})
	}
	removeCategory = (id) => {
		let menu = this.state.menu
		let category = menu.categories.findIndex((e) => e.id === id)
		if (category >= 0) {
			menu.categories.splice(category, 1)
		}
		this.setState({
			menu: menu,
		})
	}
	mobileOpenSideMenu = () =>{
        this.setState({
            openSideMenu: !this.state.openSideMenu
        })
    }
	addFoodInput = () => {
		let menu = this.state.menu
		let nextFood = new Food()
		let nextId = Math.max(...menu.foods.map((e) => e.id)) + 1
		nextFood.id = nextId
		menu.foods.push(nextFood)
		this.setState({
			menu: menu,
		})
	}
	handleRestaurantForm = (key, value) => {
		let info = this.state.info
		info[key] = value
		this.setState({
			info: info,
		})
	}
	registerRestaurant = async() =>{
		const {info, menu} = this.state
		let dataToSend = {
			name: info.name,
			address: info.address,
			description: info.description,
			phoneNumber: info.phoneNumber,
			email: info.email,
			password: info.password,
			tags: info.tags,
			categories: menu.categories,
			foods: menu.foods,
			src: info.src
		}
		let response = await fetch("/api/registerRestaurant.php",{
			method:"POST",
			body: JSON.stringify(dataToSend)
		}).then(data => data.json())
		alert(`${response.status}! \n${response.content}`)
	}
	removeFood = (id) => {
		let menu = this.state.menu
		let food = menu.foods.findIndex((e) => e.id === id)
		if (food >= 0) {
			menu.foods.splice(food, 1)
		}
		this.setState({
			menu: menu,
		})
	}
	render() {
		const { state } = this
		let categoryFunctions = {
			handleCategory: this.handleCategory,
			removeCategory: this.removeCategory,
		}
		let foodFunctions = {
			handleFood: this.handleFood,
			removeFood: this.removeFood,
		}
		let sideMenuClass = this.state.openSideMenu ?'right-page-open right-page' : 'right-page'
		return (
			<div className="main-page">
				<div className="left-page">
					<NavBar
					 hidden={true}
					 openSide={<div className='nav-open-side' onClick={this.mobileOpenSideMenu}>
							<IoMdRestaurant />
						</div>}
					/>
					<div className="register-restaurant-wrapper">
						<FilePicker onChange={this.addImage}>
							<div className="restaurant-image-wide">
								{state.info.src === "" && "Premi per aggiungere un immagine"}
								<img src={state.info.src} />
							</div>
						</FilePicker>
					</div>
					<div>
						<div className="big-text">Informazioni</div>
						<div className="restaurant-form">
							<div className="restaurant-form-row">
								<div>Nome ristorante</div>
								<input
									value={state.info.name}
									onChange={(e) =>
										this.handleRestaurantForm("name", e.target.value)
									}
								/>
							</div>
							<div className="restaurant-form-row">
								<div>Indirizzo</div>
								<input
									value={state.info.address}
									onChange={(e) =>
										this.handleRestaurantForm("address", e.target.value)
									}
								/>
							</div>

							<div className="restaurant-form-row">
								<div>Tags</div>
								<input
									value={state.info.tags}
									onChange={(e) =>
										this.handleRestaurantForm("tags", e.target.value)
									}
								/>
							</div>
							<div className="restaurant-form-row">
								<div>Email</div>
								<input
									value={state.info.description}
									onChange={(e) =>
										this.handleRestaurantForm("email", e.target.value)
									}
								/>
							</div>
							<div className="restaurant-form-row">
								<div>Password</div>
								<input
									value={state.info.description}
									onChange={(e) =>
										this.handleRestaurantForm("password", e.target.value)
									}
								/>
							</div>
							<div className="restaurant-form-row">
								<div>Numero di telefono</div>
								<input
									value={state.info.description}
									onChange={(e) =>
										this.handleRestaurantForm("phoneNumber", e.target.value)
									}
								/>
							</div>
							<div className="restaurant-form-row">
								<div>Descrizione</div>
								<input
									value={state.info.description}
									onChange={(e) =>
										this.handleRestaurantForm("description", e.target.value)
									}
								/>
							</div>
						</div>
					</div>
					<div>
						<div className="big-text">Categorie</div>
						<div className="category-wrapper">
							{state.menu.categories.map((category) => (
								<CategoryInput data={category} functions={categoryFunctions} />
							))}
							<div
								className="add-category-inputs-wrapper"
								onClick={this.addCategoryInput}
								style={{ cursor: "pointer" }}
							>
								<FaPlus />
								<div>Aggiungi</div>
							</div>
						</div>
					</div>
					<div>
						<div className="big-text">Pietanze</div>
						<div className="food-wrapper">
							{state.menu.foods.map((food) => {
								let data = {
									...food,
									categories: state.menu.categories,
								}
								return <FoodInput data={data} functions={foodFunctions} />
							})}
							<div
								onClick={this.addFoodInput}
								className="add-food-inputs-wrapper"
							>
								Aggiungi un altro
							</div>
						</div>
					</div>
				</div>
				<div className={sideMenuClass}>
				<div className='row space-between center-y'>
                        <div className='big-text'>Registra</div>
                        <IoMdRestaurant size={25}/>
                    </div>
					<div className="login-wrapper">
						<button className="rounded-btn login-btn" onClick={this.registerRestaurant}>
							Termina la registrazione
						</button>
					</div>
				</div>
			</div>
		)
	}
}

function FilePicker(props) {
	const ref = useRef(null)
	async function handleChange(e) {
		let file = e.target.files[0]
		if (file !== undefined) {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => props.onChange(reader.result)
		}
	}
	return (
		<div className={props.className} onClick={() => ref.current.click()}>
			<input
				type="file"
				onChange={handleChange}
				style={{ display: "none" }}
				ref={ref}
			/>
			{props.children}
		</div>
	)
}

class Category {
	constructor(name, emoji, id) {
		this.name = name || "categoria"
		this.emoji = emoji || "🍕"
		this.id = id || 0
	}
}
class Food {
	constructor(name, categoryId, price, description, id) {
		this.id = id || 0
		this.name = name || ""
		this.categoryId = categoryId || 0
		this.price = price || 0
		this.description = description || ""
	}
}
function CategoryInput(props) {
	const { data, functions } = props
	return (
		<div className="category-inputs-wrapper">
			<input
				value={data.emoji}
				placeholder="emoji"
				className="category-input"
				onInput={(e) =>
					functions.handleCategory(data.id, e.target.value, "emoji")
				}
			/>
			<input
				value={data.name}
				placeholder="nome"
				className="category-input"
				onInput={(e) =>
					functions.handleCategory(data.id, e.target.value, "name")
				}
			/>
			<FaTimes
				className="icon"
				color="#ff335b"
				onClick={() => functions.removeCategory(data.id)}
			/>
		</div>
	)
}
function FoodInput(props) {
	const { data, functions } = props
	function handleCategorySelect(e) {
		let index = e.target.selectedIndex
		functions.handleFood(data.id, data.categories[index].id, "categoryId")
	}
	return (
		<div className="food-inputs-wrapper">
			<div className="food-input-row">
				<div>Nome:</div>
				<input
					value={data.name}
					placeholder="Nome pietanza"
					onChange={(e) =>
						functions.handleFood(data.id, e.target.value, "name")
					}
				/>
			</div>
			<div className="food-input-row">
				<div>Prezzo:</div>
				<input
					type="number"
					value={data.price}
					placeholder="0"
					onChange={(e) =>
						functions.handleFood(data.id, e.target.value, "price")
					}
				/>
			</div>
			<div className="food-input-row">
				<div>Descrizione:</div>
				<input
					value={data.description}
					placeholder="Descrizione pietanza"
					onChange={(e) =>
						functions.handleFood(data.id, e.target.value, "description")
					}
				/>
			</div>
			<div className="food-input-row">
				<div>Categoria</div>
				<select onChange={handleCategorySelect}>
					{data.categories.map((category) => {
						return (
							<option
								key={category.id}
								selected={category.id === data.categoryId}
							>
								{category.name}
							</option>
						)
					})}
				</select>
			</div>
			<div className="food-row-bottom">
				<button
					onClick={() => functions.removeFood(data.id)}
					className="danger-btn"
				>
					Rimuovi
				</button>
			</div>
		</div>
	)
}

export default RegisterRestaurant
