import { useState, useEffect } from 'react'
import { getToken } from "../Utils/helpers";
import axios from "axios";

import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ProductSalesChart() {
    const [sales, setSales] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const pieColors = [
        "#ed1000",
        "#222222",
        "#777777",
        "#b80f05",
        "#d9d9d9"
    ]

    const productSales = async () => {
        try {
            const config = {
                headers: {

                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`${import.meta.env.VITE_API}/admin/product-sales`, config)
            setSales(data.totalPercentage)
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Failed to load product sales')
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        productSales()
    }, [])


    if (loading) {
        return <div className="chart-message">Loading chart...</div>
    }

    if (error) {
        return <div className="chart-message chart-error" role="alert">{error}</div>
    }

    if (sales.length === 0) {
        return <div className="chart-message">No product sales to display yet.</div>
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <Pie
                    dataKey="percent"
                    nameKey="name"
                    isAnimationActive={true}
                    data={sales}
                    cx="50%"
                    cy="50%"
                    outerRadius="66%"
                    fill="#ed1000"
                >
                    {sales.map((entry, index) => (
                        <Cell key={`cell-${entry.name}-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
        </ResponsiveContainer>
    );
}