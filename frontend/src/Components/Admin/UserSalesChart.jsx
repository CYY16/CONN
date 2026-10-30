import { useEffect, useState } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";
import axios from "axios";

const UserSalesChart = ({ startDate, endDate }) => {
    const [sales, setSales] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const userSales = async () => {
        try {
            setLoading(true)
            setError('')
            const config = {
                params: { startDate, endDate },
                withCredentials: true
            }

            const { data } = await axios.get(`${import.meta.env.VITE_API}/admin/customer-sales`, config)
            setSales(data.customerSales)
            setLoading(false)
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch customer sales')
            setLoading(false)
        }
    }

    const barColors = ["#ed1000", "#222222", "#777777"]

    useEffect(() => {
        userSales()
    }, [startDate, endDate])

    return (
        loading ? <div className="chart-message">Loading chart...</div> :
            error ? <div className="chart-message chart-error" role="alert">{error}</div> :
                sales.length === 0 ? <div className="chart-message">No customer sales to display yet.</div> : (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sales} margin={{ top: 12, right: 12, bottom: 38, left: 4 }}>
                    <CartesianGrid strokeDasharray="2 2" />
                    <XAxis dataKey="userDetails.name" angle={-25} textAnchor="end" interval={0} height={55} />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top" height={30} />
                    <Bar dataKey="total" name="Sales" radius={[4, 4, 0, 0]}>
                        {sales.map((item, index) => (
                            <Cell key={`cell-${item.userDetails.name}-${index}`} fill={barColors[index % barColors.length]} />
                        ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            )
    );
}
export default UserSalesChart
