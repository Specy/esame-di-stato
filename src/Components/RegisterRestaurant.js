import React, { Component } from "react"
import { FaMapMarkerAlt, FaPlus } from "react-icons/fa"
import NavBar from "./NavBar"
import "./RegisterRestaurant.css"
import Picker from "emoji-picker-react"
import { FilePicker } from "react-file-picker"
import EmojiPicker from "emoji-picker-react"
class RegisterRestaurant extends Component {
	constructor(props) {
		super(props)
		this.state = {
			src: "",
			name: "",
			address: "",
			description: "",
			menu: {
				categories: [new Category()],
				foods: [new Food()],
			},
		}
	}
	addCategoryInput = () => {
		let menu = this.state.menu
		let nextCategory = new Category()
		nextCategory.id = menu.categories[menu.categories.length]?.id + 1
		menu.categories.push(nextCategory)
		this.setState({
			menu: menu,
		})
	}
	handleCategory = (id, value, key) => {
		let menu = this.state.menu
		let category = menu.categories.findIndex((e) => e.id === id)
		if (category !== undefined) {
			menu.categories[category][key] = value
		}
		this.setState({
			menu: menu,
		})
	}
    handleFood = (id, value, key) => {
		let menu = this.state.menu
		let food = menu.foods.findIndex((e) => e.id === id)
		if (food !== undefined) {
			menu.foods[food][key] = value
		}
		this.setState({
			menu: menu,
		})
        console.log(this.state.menu)
	}
	addFoodInput = () => {
		let menu = this.state.menu
		menu.foods.push(new Food())
		this.setState({
			menu: menu,
		})
	}
	render() {
		const { state } = this
		let categoryFunctions = {
			handleCategory: this.handleCategory,
		}
		let foodFunctions = {
            handleFood: this.handleFood
        }
		return (
			<div className="main-page">
				<div className="left-page">
					<NavBar hidden={true} />
					<div className="register-restaurant-wrapper">
						<FilePicker>
							<div className="restaurant-image-wide">
								Premi per aggiungere un immagine
							</div>
						</FilePicker>
					</div>
					<div className="big-text">
						Categorie
						<div className="category-wrapper">
							{state.menu.categories.map((category) => (
								<CategoryInput data={category} functions={categoryFunctions} />
							))}
							<div
								className="category-inputs-wrapper"
								onClick={this.addCategoryInput}
								style={{ cursor: "pointer" }}
							>
								<FaPlus />
								<div>Aggiungi</div>
							</div>
						</div>
					</div>
					<div className="big-text">
						Pietanze
						<div className="food-wrapper">
							{state.menu.foods.map((food) => (
								<FoodInput data={food} functions={foodFunctions} />
							))}
						</div>
					</div>
				</div>
				<div className="right-page">
					<div className="row center-y space-between">
						<div className="big-text center-y">Registra il tuo ristorante</div>
					</div>
				</div>
			</div>
		)
	}
}

class Category {
	constructor(name, emoji, id) {
		this.name = name || "categoria"
		this.emoji = emoji || "🍕"
		this.id = id || 0
	}
}
class Food {
	constructor(name, categoryId, price, description,id) {
        this.id = id || 0
		this.name = name || "nome"
		this.categoryId = categoryId || 0
		this.price = price || 0
		this.description = description || "descrizione"
	}
}
function CategoryInput(props) {
	const { data, functions } = props
	return (
		<div className="category-inputs-wrapper">
			<input
				value={data.emoji}
				className="category-input"
				onInput={(e) =>
					functions.handleCategory(data.id, e.target.value, "emoji")
				}
			/>
			<input
				value={data.name}
				className="category-input"
				onInput={(e) =>
					functions.handleCategory(data.id, e.target.value, "name")
				}
			/>
		</div>
	)
}
function FoodInput(props) {
    const { data, functions } = props
	return <div className="food-inputs-wrapper">
        <div className='food-input-row'>
            <div >
                Nome: 
            </div>
            <input 
                value={data.name} 
                onChange={(e) => functions.handleFood(data.id,e.target.value,"name")}
            />
        </div>
        <div className='food-input-row'>
            <div >
                Prezzo: 
            </div>
            <input 
                type='number'
                value={data.price} 
                onChange={(e) => functions.handleFood(data.id,e.target.value,"price")}
            />
        </div>
        <div className='food-input-row'>
            <div >
                Descrizione: 
            </div>
            <input 
                value={data.description} 
                onChange={(e) => functions.handleFood(data.id,e.target.value,"description")}
            />
        </div>
    </div>
}

export default RegisterRestaurant
