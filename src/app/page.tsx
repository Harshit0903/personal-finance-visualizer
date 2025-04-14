'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type Transaction = {
  id: number
  amount: number
  date: string
  description: string
}

const generateChartData = (transactions: Transaction[]) => {
  const expensesByMonth: { [key: string]: number } = {}

  transactions.forEach((tx) => {
    const month = tx.date.substring(0, 7) // Get the 'YYYY-MM' part of the date
    if (!expensesByMonth[month]) {
      expensesByMonth[month] = 0
    }
    expensesByMonth[month] += tx.amount
  })

  // Convert to an array of { month, totalAmount }
  return Object.keys(expensesByMonth).map((month) => ({
    month,
    totalAmount: expensesByMonth[month],
  }))
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [form, setForm] = useState({ amount: '', date: '', description: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    // **This is the added validation code**
    if (!form.amount || !form.date || !form.description) {
      alert("All fields are required")  // Alert if fields are empty
      return
        // Prevent form submission
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      amount: parseFloat(form.amount),
      date: form.date,
      description: form.description,
    }

    setTransactions([newTransaction, ...transactions])
    setForm({ amount: '', date: '', description: '' })
  }

  const chartData = generateChartData(transactions)

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Transaction</h1>

      {/* Add Transaction Form */}
      <Card className="mb-6">
        <CardContent className="p-4 space-y-4">
          <Input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
          />
          <Input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
          <Button onClick={handleSubmit}>Add Transaction</Button>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <h2 className="text-xl font-semibold mb-2">Transactions</h2>
      {transactions.map((tx) => (
        <Card key={tx.id} className="mb-2">
          <CardContent className="p-4 flex justify-between">
            <div>
              <p className="font-semibold">{tx.description}</p>
              <p className="text-sm text-gray-500">{tx.date}</p>
            </div>
            <p className="text-right font-bold text-green-600">₹{tx.amount}</p>
          </CardContent>
        </Card>
      ))}

      {/* Monthly Expenses Bar Chart */}
      <h2 className="text-xl font-semibold mb-4">Monthly Expenses</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalAmount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </main>
  )
}
