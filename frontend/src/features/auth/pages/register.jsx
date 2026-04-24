import React, { useState } from 'react'
import "../auth.form.scss";
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hook/useAuth';


export default function Register() {
    const navigate = useNavigate();
    const { handleRegister, loading } = useAuth();
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: ""
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Register");
        await handleRegister(formData);
        console.log("register sucessfully");
        navigate("/home");
        
    }
    if(loading){
            <main> <h1> loading.......</h1></main>
        }
  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
            <div className="input-group">
            <label htmlFor="userName">UserName</label>
            <input
              value={formData.userName}
              onChange={(e) => setFormData({...formData, userName: e.target.value})}
              type="text"
              name="userName"
              id="userName"
              placeholder="enter your userName"
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              type="email"
              name="email"
              id="email"
              placeholder="email@email.com"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              type="password"
              id="password"
              name="password"
              placeholder="enter password"
            />
          </div>
          <button type='submit' className="button button-primary">Register</button>
        </form>
        <p >Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </main>
  );
}
