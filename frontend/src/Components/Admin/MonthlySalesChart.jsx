import { useEffect, useState } from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from "axios";

export default function MonthlySalesChart({ startDate, endDate }) {
    const [sales, setSales] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const monthlySales = async () => {
        try {
            setLoading(true)
            setError('')
            const config = {
                params: { startDate, endDate },
                withCredentials: true
            }

            const { data } = await axios.get(`${import.meta.env.VITE_API}/admin/sales-per-month`, config)
            setSales(data.salesPerMonth)
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Failed to load monthly sales')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        monthlySales()
    }, [startDate, endDate])

    if (loading) {
        return <div className="chart-message">Loading chart...</div>
    }

    if (error) {
        return <div className="chart-message chart-error" role="alert">{error}</div>
    }

    if (sales.length === 0) {
        return <div className="chart-message">No monthly sales to display yet.</div>
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sales} margin={{ top: 12, right: 16, bottom: 8, left: 8 }}>
                <Line type="monotone" dataKey="total" name="Sales" stroke="#ed1000" strokeWidth={3} activeDot={{ r: 5 }} />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" height={30} />
            </LineChart>
        </ResponsiveContainer>
    );
}
