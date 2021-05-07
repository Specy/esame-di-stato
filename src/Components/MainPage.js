import React, { Component, useRef, useState } from 'react'
import "./MainPage.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
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
            step: "login"
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
    render() {
        const { step, user} = this.state
        return <div className="main-page">
            <div className="left-page">

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
            placeholder={objKey}
            onBlur={updateParent}
        />
        <FontAwesomeIcon
            icon={valid ? faCheck : faTimes}
            className={(valid ? "valid" : "invalid") + " valid-icon"}
        />
    </div>
}


export default MainPage