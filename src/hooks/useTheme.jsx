"use client"

import { useEffect, useState } from "react"

export const useTheme = () => {
    const [theme, setTheme] = useState("dark")

    // Load theme from localStorage after mount
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme")
        if (storedTheme) {
            setTheme(storedTheme)
        }
    }, [])

    // Apply theme changes
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
        localStorage.setItem("theme", theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"))
    }

    return { theme, toggleTheme }
}
