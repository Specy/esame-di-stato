import React, { Component } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
	FaTimes,
	FaSearch,
	FaBars,
	FaHome,
	FaShoppingCart,
} from "react-icons/fa"
import { IoMdRestaurant } from "react-icons/io"
import { Link } from "react-router-dom"
class NavBar extends Component {
	constructor(props) {
		super(props)
		this.ref = React.createRef()
		this.state = {
			searchValue: "",
			open: false,
		}
	}
	handleChange = () => {
		this.setState({
			searchValue: this.ref.current.value,
		})
	}
	sendChange = () => {
		this.props.search(this.state.searchValue)
	}
	toggleNavbar = () => {
		this.setState({
			open: !this.state.open,
		})
	}
	render() {
		const { props, state } = this
		let bottomClass = state.open ? "bottom-navbar navbar-open" : "bottom-navbar"
		return (
			<>
				<div className="navbar-wrapper">
					<div className="row" style={{flex:'1'}}>
						<div className="top-navbar">
							<div className="navbar-logo">
								{state.open ? (
									<FaTimes onClick={this.toggleNavbar} className="icon" />
								) : (
									<FaBars onClick={this.toggleNavbar} className="icon" />
								)}
								<div>Manduca</div>
							</div>
							{!props.hidden && (
								<div className="navbar-input-wrapper">
									<input
										value={this.state.searchValue}
										ref={this.ref}
										onChange={this.handleChange}
										className="navbar-input"
										placeholder={props.placeholder}
									/>
									<FaSearch onClick={this.sendChange} className="icon" />
								</div>
							)}
						</div>
						{this.props.openSide}
					</div>

					<div className={bottomClass}>
						<Link to="/">
							<div className="navbar-link">
								<FaHome />
								Pagina principale
							</div>
						</Link>
						<Link to='/myOrders'>
							<div className="navbar-link">
								<FaShoppingCart />
								Le mie ordinazioni
							</div>
						</Link>
						<Link to="registerRestaurant">
							<div className="navbar-link">
								<IoMdRestaurant />
								Registra il tuo ristorante
							</div>
						</Link>
						<Link to="restaurantArea">
							<div className="navbar-link">
								<IoMdRestaurant />
								Area ristoratori
							</div>
						</Link>
					</div>
				</div>
			</>
		)
	}
}

export default NavBar
