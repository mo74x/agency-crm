/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/lib/api";

export default function ProjectsPage() {
  const api = useApi();
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  
  // Form State
  const [form, setForm] = useState({ title: "", clientId: "" });
  const [loading, setLoading] = useState(true);

  // Load both Projects and Clients (for the dropdown)
  useEffect(() => {
    Promise.all([
      api("/projects"),
      api("/clients")
    ]).then(([projectsData, clientsData]) => {
      setProjects(projectsData);
      setClients(clientsData);
      setLoading(false);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.clientId) return alert("Please select a client");
    
    await api("/projects", {
      method: "POST",
      body: JSON.stringify(form),
    });
    
    setForm({ title: "", clientId: "" });
    // Refresh projects
    const data = await api("/projects");
    setProjects(data);
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>

      {/* CREATE FORM */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 border">
        <h2 className="text-lg font-semibold mb-4">New Project</h2>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            placeholder="Project Title (e.g. SEO Audit)"
            className="border p-2 rounded w-full"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          
          <select 
            className="border p-2 rounded w-64 bg-white"
            value={form.clientId}
            onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            required
          >
            <option value="">Select Client...</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button className="bg-black text-white px-6 py-2 rounded">
            Create
          </button>
        </form>
      </div>

      {/* PROJECT LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div key={p.id} className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{p.title}</h3>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {p.status}
              </span>
            </div>
            <div className="text-gray-500 text-sm">
              Client: <span className="text-gray-900 font-medium">{p.client.name}</span>
            </div>
            <div className="mt-4 pt-4 border-t text-xs text-gray-400">
              Started {new Date(p.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}