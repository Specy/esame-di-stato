import React, { Component, useRef, useState } from 'react'
import "./MainPage.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCheck, faTimes, faFilter } from '@fortawesome/free-solid-svg-icons'
import NavBar from "./NavBar"
import RestaurantPreview from "./RestaurantPreview"
class MainPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user:{
                name: "Nome Utente"
            },
            login: {
                email: "",
                password: ""
            },
            register: {
                email: "",
                password: "",
                name: "",
                surname: "",
                address: ""
            },
            step: "login",
            search : "",
            restaurants: [
                {
                    name: "Farina & Co",
                    src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
                    tags: ["Pizzeria","Panificio"]
                },{
                    name: "Sushi Maya",
                    src: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1190&q=80",
                    tags: ["Sushi"]
                },{
                    name: "Morrison",
                    src: "https://images.unsplash.com/photo-1496930666207-e76e8253a950?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
                    tags: ["Pub","Bar"]
                },{
                    name: "McDonald's",
                    src: "https://images.unsplash.com/photo-1616696269320-a4b68a57b1c1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
                    tags: ["Ristorante","Panineria"]
                },{
                    name :"La Tana",
                    src: "https://images.unsplash.com/photo-1594179047502-07fb8a5451f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
                    tags: ["Pizzeria", "Ristorante"]
                }
            ]
        }
    }
    handleInput = (obj) => {
        console.log(obj)
    }
    changeStep = (step) => {
        this.setState({
            step: step
        })
    }
    search = (newSearch) => {
        this.setState({
            search: newSearch
        })
    }
    render() {
        const { step, user, restaurants} = this.state
        return <div className="main-page">
            <div className="left-page">
                <NavBar 
                    placeholder="Cerca un ristorante"
                    search={this.search}
                />
                <div className="left-page-top-container">
                    <div>
                        Un ristorante, un ordine, è tutto ciò che ti serve.
                    </div>
                </div>
                <div className="title-and-filter">
                    <div className="big-text">
                        Ristoranti 
                    </div>
                    <div className="filter-wrapper">
                        Filtra
                        <FontAwesomeIcon icon={faFilter} />
                    </div>
                </div>
                <div className="restaurants-wrapper">
                    {restaurants.map(restaurant => {
                        return <RestaurantPreview 
                            key={restaurant.name}
                            data={restaurant}
                        />
                    })}
                    
                </div>
            </div>
            <div className="right-page">
                <div className="row center-y space-between">
                    <div className="big-text center-y">
                        {user.name}
                    </div>
                    <FontAwesomeIcon icon={faUser} className="user-icon" />
                </div>
                <div className="login-wrapper">

                    <div 
                        className={step === "login" ? "login-btn-wrapper login-btn-wrapper-visible" : "login-btn-wrapper" }
                    >
                        <div>
                            Bentornato, entra nel tuo account!
                        </div>

                        <div className="login-form">
                            {Object.entries(this.state.login).map(([key, value]) => {
                                return <InputEl
                                    key={key + value}
                                    objKey={key}
                                    value={value}
                                    sendChange={this.handleInput}
                                />
                            })}
                        </div>

                        <button
                            className="rounded-btn login-btn"
                            onClick={() => this.changeStep("login")}
                        >
                            Fai il login
                        </button>
                        <div className="small-text">
                            oppure
                        </div>
                        <button
                            className="rounded-btn register-btn"
                            onClick={() => this.changeStep("register")}
                        >
                            Registrati
                        </button>
                    </div>


                    <div 
                        className={step === "register" ? "login-btn-wrapper login-btn-wrapper-visible" : "login-btn-wrapper" }
                    >   
                        <div>
                            Registrati!
                        </div>
                        <div className="login-form">
                            {Object.entries(this.state.register).map(([key, value]) => {
                                return <InputEl
                                    key={key + value}
                                    objKey={key}
                                    value={value}
                                    sendChange={this.handleInput}
                                />
                            })}
                        </div>
                        <button
                            className="rounded-btn login-btn"
                            onClick={() => this.changeStep("register")}
                        >
                            Registrati
                        </button>
                        <div className="small-text">
                            oppure
                        </div>
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
    return <div className="input-wrapper">
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
}

function capitalize(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export default MainPage