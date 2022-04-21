import React, { useContext, useState } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import "./../style.scss"

export default function AuthPage() {
    const auth = useContext(AuthContext)

    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({ email: '', password: '', name: '' })
    const [response, setResponse] = useState(null)

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const registerHandler = () => {
        axios.post('/api/auth/registr', { ...formData }, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => {
            setResponse(response.data.message)
            setFormData({ email: '', password: '', name: '' })
        })
    }

    const loginHandler = () => {
        axios.post('/api/auth/login', { ...formData }, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => {
            setResponse(response.data.message)
            auth.login(response.data.token, response.data.userId)
        })
    }

    return (
        <div className="loginWrapper">
            <div className="loginContainer">
                <h1 className="h1">Щоб дивитись на Богдану потрібно ввійти або зареєструватись</h1>
                {isLogin ? (<div className="loginInputs"><label htmlFor="email">Email</label>
                    <input onChange={changeHandler} type="text" name="email" />
                    <label htmlFor="password">Пароль</label>
                    <input onChange={changeHandler} type="password" name="password" />
                    <button onClick={loginHandler}>Залогінитись</button></div>) : (
                    <div className="loginInputs"><label htmlFor="email">Email</label>
                        <input onChange={changeHandler} type="text" name="email" />
                        <label htmlFor="name">Ім'я</label>
                        <input onChange={changeHandler} type="text" name="name" />
                        <label htmlFor="password">Пароль</label>
                        <input onChange={changeHandler} type="password" name="password" />
                        <button onClick={registerHandler}>Зареєструватись</button></div>)}


                {response ? (<div className="response">{response}</div>) : null}
                {isLogin ? (
                    <button className="changeLogin" onClick={() => { setIsLogin(false); setResponse(null) }}> Зареєструватись</button>
                ) : (
                    <button className="changeLogin" onClick={() => { setIsLogin(true); setResponse(null) }}> Залогінитись</button>
                )}

            </div>
        </div>

    )
}
