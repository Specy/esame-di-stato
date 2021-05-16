import React, { Component } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons"
class NavBar extends Component {
	constructor(props) {
		super(props)
		this.ref = React.createRef()
		this.state = {
			searchValue: "",
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
	render() {
		const { props } = this
		return (
			<>
				<div className="navbar-wrapper">
					<div className="navbar-logo">
						<FontAwesomeIcon icon={faBars} />
						<div>Site Name</div>
					</div>
					{props.hidden !== true && (
						<div className="navbar-input-wrapper">
							<input
								value={this.state.searchValue}
								ref={this.ref}
								onChange={this.handleChange}
								className="navbar-input"
								placeholder={props.placeholder}
							/>
							<FontAwesomeIcon onClick={this.sendChange} icon={faSearch} />
						</div>
					)}
				</div>
			</>
		)
	}
}

export default NavBar
