/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/lib/api";

export default function ClientsPage() {
  const api = useApi();
  const [clients, setClients] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [loading, setLoading] = useState(true);

  // 1. Fetch Clients
  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      const data = await api("/clients");
      setClients(data);
    } catch (err) {
      console.error("Failed to load clients", err);
    } finally {
      setLoading(false);
    }
  }

  // 2. Create Client
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api("/clients", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm({ name: "", email: "", company: "" }); // Reset form
      loadClients(); // Refresh list
    } catch (err) {
      alert("Failed to create client");
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Clients</h1>

      {/* CREATE FORM */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 border">
        <h2 className="text-lg font-semibold mb-4">Add New Client</h2>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            placeholder="Name"
            className="border p-2 rounded w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Email"
            className="border p-2 rounded w-full"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            placeholder="Company"
            className="border p-2 rounded w-full"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Add
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : clients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No clients found.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-medium text-gray-500">Name</th>
                <th className="p-4 font-medium text-gray-500">Email</th>
                <th className="p-4 font-medium text-gray-500">Company</th>
                <th className="p-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4 font-medium">{client.name}</td>
                  <td className="p-4 text-gray-600">{client.email}</td>
                  <td className="p-4 text-gray-600">{client.company}</td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {client.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}