import { useState } from 'react'
import { Upload } from 'lucide-react'
import http from '../../api/http'

const initialForm = {
  title: '',
  category: 'Travel',
  amount: '',
  currency: 'USD',
  description: '',
}

const ReimbursementForm = ({ onSubmitted }) => {
  const [form, setForm] = useState(initialForm)
  const [receipt, setReceipt] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = new FormData()
      Object.entries(form).forEach(([key, value]) => payload.append(key, value))
      if (receipt) {
        payload.append('receipt', receipt)
      }

      const response = await http.post('/reimbursements', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setForm(initialForm)
      setReceipt(null)
      onSubmitted?.(response.data.data.reimbursement)
    } catch (submissionError) {
      setError(submissionError.response?.data?.message || 'Unable to submit reimbursement')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Expense Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:border-cyan-500 outline-none transition text-white placeholder-gray-500"
            placeholder="Client dinner, travel, etc."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:border-cyan-500 outline-none transition text-white"
          >
            {['Travel', 'Meals', 'Supplies', 'Technology', 'Training', 'Mileage', 'Other'].map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Amount</label>
          <input
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:border-cyan-500 outline-none transition text-white placeholder-gray-500"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Currency</label>
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:border-cyan-500 outline-none transition text-white"
          >
            {['USD', 'EUR', 'GBP', 'AED', 'INR'].map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">Description</label>
        <textarea
          name="description"
          rows="4"
          value={form.description}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:border-cyan-500 outline-none transition text-white placeholder-gray-500 resize-none"
          placeholder="Explain the business purpose and context..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-3 text-gray-300">Upload Receipt</label>
        <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-cyan-500/30 rounded-lg cursor-pointer hover:border-cyan-500/60 transition bg-white/5">
          <Upload className="text-cyan-400 mb-2" size={24} />
          <span className="text-sm font-medium text-gray-300">Drag receipt here or click to browse</span>
          <span className="text-xs text-gray-500 mt-1">PNG, JPG, PDF (max 6MB)</span>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(event) => setReceipt(event.target.files?.[0] || null)}
            className="hidden"
          />
        </label>
        {receipt && (
          <p className="mt-2 text-sm text-cyan-400">✓ {receipt.name}</p>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-glow disabled:opacity-70 disabled:cursor-not-allowed font-semibold text-white transition"
      >
        {saving ? 'Submitting...' : 'Submit Claim'}
      </button>
    </form>
  )
}

export default ReimbursementForm
