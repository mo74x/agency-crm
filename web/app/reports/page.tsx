/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/lib/api";

export default function ReportsPage() {
  const api = useApi();
  const [reports, setReports] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  
  // The Report Data Form
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [metrics, setMetrics] = useState({
    visits: 0,
    leads: 0,
    conversion: 0
  });

  useEffect(() => {
    // Load projects for the dropdown
    api("/projects").then(setProjects);
    // Load existing reports
    api("/reports").then(setReports);
  }, [api]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!projectId) return alert("Select a project");

    await api("/reports", {
      method: "POST",
      body: JSON.stringify({
        title,
        month: new Date().toISOString().slice(0, 7), // "2026-02"
        projectId,
        content: metrics // <--- Sending our JSON data
      }),
    });
    
    // Reset and Refresh
    setTitle("");
    setMetrics({ visits: 0, leads: 0, conversion: 0 });
    const data = await api("/reports");
    setReports(data);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Client Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: Builder Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow border h-fit">
          <h2 className="font-semibold mb-4">Create New Report</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Project Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Project</label>
              <select 
                className="w-full border p-2 rounded mt-1 bg-white"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
              >
                <option value="">Select Project...</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            {/* Report Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Report Title</label>
              <input 
                className="w-full border p-2 rounded mt-1"
                placeholder="e.g. February SEO Report"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <hr className="my-4"/>

            {/* Metrics Inputs */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Website Visits</label>
              <input 
                type="number"
                className="w-full border p-2 rounded mt-1"
                value={metrics.visits}
                onChange={(e) => setMetrics({...metrics, visits: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Leads</label>
              <input 
                type="number"
                className="w-full border p-2 rounded mt-1"
                value={metrics.leads}
                onChange={(e) => setMetrics({...metrics, leads: parseInt(e.target.value)})}
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700">
              Generate Report
            </button>
          </form>
        </div>

        {/* RIGHT: Reports List */}
        <div className="lg:col-span-2 space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white p-6 rounded-lg shadow border flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{report.title}</h3>
                <p className="text-sm text-gray-500">
                  {report.project.client.name} • {report.project.title}
                </p>
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span>Visits: <b>{report.content.visits}</b></span>
                  <span>Leads: <b>{report.content.leads}</b></span>
                </div>
              </div>
              
              <button className="text-blue-600 hover:underline text-sm font-medium">
                View PDF &rarr;
              </button>
            </div>
          ))}
          {reports.length === 0 && (
            <div className="text-center text-gray-500 py-12 bg-gray-50 rounded border border-dashed">
              No reports generated yet.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}