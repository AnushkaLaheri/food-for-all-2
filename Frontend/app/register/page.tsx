"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Header from "@/components/header"

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    role: "consumer",
  })

  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError("❌ Passwords do not match")
      setMessage("")
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        setMessage("✅ Registered successfully!")
        setError("")
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          password: "",
          confirmPassword: "",
          role: "consumer",
        })
      } else {
        setError(data.message || "❌ Registration failed")
        setMessage("")
      }
    } catch (err) {
      console.error("Registration error", err)
      setError("❌ Something went wrong. Try again.")
      setMessage("")
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header showAccount={false} />
      <div
        className="flex-1 flex items-center justify-center p-6 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/placeholder.svg?height=800&width=1200')",
        }}
      >
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Food For All</h1>
          <h2 className="text-xl font-semibold mb-6">Register Now</h2>

          {message && <div className="text-green-600 text-center font-medium mb-2">{message}</div>}
          {error && <div className="text-red-500 text-center font-medium mb-2">{error}</div>}

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={formData.address} onChange={handleChange} placeholder="Enter your address" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={formData.password} onChange={handleChange} placeholder="Create a password" />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" />
            </div>
            <div>
              <Label htmlFor="role">Register as</Label>
              <select id="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded-md">
                <option value="consumer">Consumer</option>
                <option value="donor">Donor</option>
                <option value="ngo">NGO</option>
              </select>
            </div>
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              Register
            </Button>
          </form>

          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
