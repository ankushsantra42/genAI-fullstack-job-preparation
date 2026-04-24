import React, { useState } from 'react'
import "../auth.form.scss"
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hook/useAuth';


export default function Login() {
    const navigate = useNavigate();
    const { handleLogin, loading } = useAuth();
    const [formData, setFormdata] = useState({
        email:"",
        password:""
    })
    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log("Login");
        await handleLogin(formData)
        console.log("login sucessfully");
        navigate("/home");
        
    }
    if(loading){
            <main> <h1> loading.......</h1></main>
        }
  return (
    <main>
        <div className="form-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input value={formData.email} onChange={(e) =>setFormdata({...formData, email:e.target.value})} type="email" name='email' id='email' placeholder='email@email.com' />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input value={formData.password} onChange={(e) =>setFormdata({...formData, password:e.target.value})} type="password" id='password' name='password' placeholder='enter password' />
                </div>
                <button className='button button-primary'>Login</button>
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    </main>
  )
}
