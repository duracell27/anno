import React, { useContext, useState } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

export default function AuthPage() {
    const auth = useContext(AuthContext)

    const [formData, setFormData] = useState({ email: '', password: '' })
    const [response, setResponse] = useState(null)

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const registerHandler = () => {
        axios.post('/api/auth/registr', { ...formData }, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => setResponse(response.data.message))
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
        <div>
            <h1>Login page</h1>
            <label htmlFor="email">Email</label>
            <input onChange={changeHandler} type="text" name="email" />
            <label htmlFor="password">Пароль</label>
            <input onChange={changeHandler} type="password" name="password" />
            <button onClick={loginHandler}>login</button>
            <button onClick={registerHandler}>registr</button>
            {response ? (<div className="response">{response}</div>) : null}

        </div>

    )
}
