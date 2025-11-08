"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { debounce } from "lodash";
import { jwtDecode } from "jwt-decode";
import { baseUrl } from "@/helper/api";

interface Account {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  last_login: string;
  created_at: string;
  updated_at: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  deadline: string;
  created_at: string;
  updated_at: string;
  accounts_id: number;
  accounts: Account;
  create_accounts_id: number;
  create_accounts: Account;
  update_accounts_id: number | null;
  update_accounts: Account | null;
}

interface ApiResponse {
  data: Task[];
  limit: string;
  page: string;
  total: number;
}

interface JwtPayload {
  user_id: number;
  [key: string]: unknown;
}

export default function Dashboard() {
  const router = useRouter();

  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"todo" | "in_progress" | "done">("todo");
  const [deadline, setDeadline] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "todo" | "in_progress" | "done" | ""
  >("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalTasks, setTotalTasks] = useState(0);

  const pageSize = 5;

  // Check token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Reset form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("todo");
    setDeadline("");
    setEditId(null);
  };

  // Reset filter
  const resetFilter = () => {
    setFilterStatus("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  // Debounced filter
  const triggerFetch = useCallback(
    debounce(() => {
      setPage(1);
      fetchTasks();
    }, 400),
    [filterStatus, startDate, endDate]
  );

  // FETCH TASKS → POST to /api/task/byfilter
  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const url = `${baseUrl}/byfilter`;
      console.log("🔍 Fetching from backend with filter:", url);

      // Prepare filter payload
      const filterPayload: any = {};

      if (filterStatus) {
        filterPayload.status = filterStatus;
      }

      // Set default dates if not provided
      if (startDate) {
        filterPayload.start_date = `${startDate}T00:00:00Z`;
      } else {
        // Default start date: 1 year ago
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        filterPayload.start_date =
          oneYearAgo.toISOString().split("T")[0] + "T00:00:00Z";
      }

      if (endDate) {
        filterPayload.end_date = `${endDate}T23:59:59Z`;
      } else {
        // Default end date: 1 year from now
        const oneYearLater = new Date();
        oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
        filterPayload.end_date =
          oneYearLater.toISOString().split("T")[0] + "T23:59:59Z";
      }

      console.log("📋 Filter payload:", filterPayload);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filterPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && Array.isArray(data.data)) {
        setTasks(data.data);
        setTotalTasks(data.total || 0);
      } else {
        console.warn("Unexpected response structure:", data);
        setTasks([]);
        setTotalTasks(0);
      }
    } catch (error) {
      console.error(" Fetch error:", error);

      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        Swal.fire({
          title: "Koneksi Gagal",
          text: "Tidak dapat terhubung ke server backend. Pastikan server berjalan di http://localhost:8080",
          icon: "error",
          background: "#ffffff",
          color: "#000000",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Gagal memuat data tugas",
          icon: "error",
          background: "#ffffff",
          color: "#000000",
        });
      }

      setTasks([]);
      setTotalTasks(0);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch on page change
  useEffect(() => {
    fetchTasks();
  }, [page]);

  // Trigger fetch on filter change
  useEffect(() => {
    triggerFetch();
    return () => triggerFetch.cancel();
  }, [filterStatus, startDate, endDate, triggerFetch]);

  // CRUD Operations
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (!title.trim() || !description.trim()) {
      Swal.fire({
        title: "Error",
        text: "Judul & deskripsi wajib diisi",
        icon: "error",
        background: "#ffffff",
        color: "#000000",
      });
      return;
    }

    // Get account_id from JWT token
    const decoded: JwtPayload = jwtDecode(token);
    const accountId = Number(decoded.user_id);

    // Set default deadline if not provided
    const taskDeadline = deadline ? `${deadline}:00Z` : "2025-12-31T23:59:59Z";

    try {
      if (editId) {
        await axios.put(
          `${baseUrl}/${editId}`,
          { title, description, status },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Swal.fire({
          title: "Sukses!",
          text: "Tugas diperbarui",
          icon: "success",
          background: "#ffffff",
          color: "#000000",
        });
      } else {
        await axios.post(
          baseUrl,
          {
            title,
            description,
            status,
            deadline: taskDeadline,
            account_id: accountId,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Swal.fire({
          title: "Sukses!",
          text: "Tugas ditambahkan",
          icon: "success",
          background: "#ffffff",
          color: "#000000",
        });
      }
      resetForm();
      fetchTasks();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      Swal.fire({
        title: "Gagal",
        text: error.response?.data?.message || "Operasi gagal",
        icon: "error",
        background: "#ffffff",
        color: "#000000",
      });
    }
  };

  const handleDelete = async (id: number) => {
    const { isConfirmed } = await Swal.fire({
      title: "Hapus?",
      text: "Tugas akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      background: "#ffffff",
      color: "#000000",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    });

    if (!isConfirmed) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      // Pastikan ID valid sebelum mengirim request
      if (!id || isNaN(id)) {
        throw new Error("ID tugas tidak valid");
      }

      console.log("🗑️ Menghapus task dengan ID:", id); // Debug log

      const response = await axios.delete(`${baseUrl}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Response delete:", response); // Debug log

      Swal.fire({
        title: "Dihapus!",
        text: "Tugas berhasil dihapus",
        icon: "success",
        background: "#ffffff",
        color: "#000000",
      });
      fetchTasks();
    } catch (err) {
      console.error("❌ Delete error:", err); // Debug log

      const error = err as AxiosError<{ message: string }>;
      Swal.fire({
        title: "Gagal",
        text: error.response?.data?.message || "Tidak bisa menghapus tugas",
        icon: "error",
        background: "#ffffff",
        color: "#000000",
      });
    }
  };

  const handleEdit = (task: Task) => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setEditId(task.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalTasks / pageSize);
  const hasNextPage = page < totalPages;

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
              Task Dashboard
            </h1>
            <p className="text-gray-700">
              Kelola tugas Anda dengan mudah dan efisien
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium shadow-md"
          >
            Logout
          </button>
        </div>

        {/* Form Section */}
        <div className="bg-gray-50 rounded-lg border border-gray-300 p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-black">
              {editId ? "Edit Task" : "Tambah Task Baru"}
            </h2>
            {editId && (
              <button
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 hover:text-black transition-colors font-medium border border-gray-400 rounded-lg hover:border-black"
              >
                ✕ Batal
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Judul Tugas */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-black">
                Judul Tugas *
              </label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul tugas"
                className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all bg-white text-black"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-black">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "todo" | "in_progress" | "done")
                  }
                  className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all bg-white text-black"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-black">
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all bg-white text-black"
                />
              </div>
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-black">
                Deskripsi *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Masukkan deskripsi tugas..."
                className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none resize-none transition-all bg-white text-black"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
              >
                {editId ? "Update Task" : "Tambah Task"}
              </button>
            </div>
          </form>
        </div>

        {/* Filter Section */}
        <div className="bg-gray-50 rounded-lg border border-gray-300 p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h2 className="text-xl font-bold text-black mb-2 md:mb-0">
              Filter Tugas
            </h2>
            <button
              onClick={resetFilter}
              className="px-4 py-2 text-gray-700 hover:text-black transition-colors font-medium border border-gray-400 rounded-lg hover:border-black"
            >
              Reset Filter
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filter Status */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-black">
                Filter Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value as "todo" | "in_progress" | "done" | ""
                  )
                }
                className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all bg-white text-black"
              >
                <option value="">Semua Status</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-black">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all bg-white text-black"
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-black">
                Tanggal Selesai
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all bg-white text-black"
              />
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                <span className="ml-3 text-black text-lg font-medium">
                  Memuat data...
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                      <th className="p-4 text-left font-bold text-black">
                        Task
                      </th>
                      <th className="p-4 text-left font-bold text-black">
                        Status
                      </th>
                      <th className="p-4 text-left font-bold text-black">
                        Deadline
                      </th>
                      <th className="p-4 text-center font-bold text-black">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {tasks.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-12">
                          <div className="text-gray-500 text-lg mb-2">📝</div>
                          <p className="text-black font-bold text-lg">
                            {filterStatus || startDate || endDate
                              ? "Tidak ada tugas yang sesuai dengan filter"
                              : "Belum ada tugas"}
                          </p>
                          <p className="text-gray-600 text-sm mt-1">
                            {!filterStatus &&
                              !startDate &&
                              !endDate &&
                              "Mulai dengan menambahkan task baru di atas"}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      tasks.map((task) => (
                        <tr
                          key={task.id}
                          className="hover:bg-gray-50 transition-colors group"
                        >
                          <td className="p-4">
                            <div className="max-w-md">
                              <div className="font-bold text-black group-hover:text-blue-800 transition-colors mb-1 text-lg">
                                {task.title}
                              </div>
                              <div className="text-gray-700 leading-relaxed">
                                {task.description}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-bold ${
                                task.status === "done"
                                  ? "bg-green-100 text-green-900 border border-green-300"
                                  : task.status === "in_progress"
                                  ? "bg-blue-100 text-blue-900 border border-blue-300"
                                  : "bg-yellow-100 text-yellow-900 border border-yellow-300"
                              }`}
                            >
                              {task.status === "done"
                                ? "✅ Selesai"
                                : task.status === "in_progress"
                                ? "🔄 Progress"
                                : "📋 To Do"}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-black">
                              {new Date(task.deadline).toLocaleDateString(
                                "id-ID",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              {new Date(task.deadline).toLocaleTimeString(
                                "id-ID",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center space-x-3">
                              <button
                                onClick={() => handleEdit(task)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  console.log(
                                    "Tombol delete diklik, ID:",
                                    task.id
                                  ); // Debug log
                                  handleDelete(task.id);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 font-medium"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {tasks.length > 0 && (
                <div className="bg-gray-100 px-6 py-4 border-t border-gray-300 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-black font-medium">
                    Menampilkan{" "}
                    <span className="font-bold">{tasks.length}</span> dari{" "}
                    <span className="font-bold">{totalTasks}</span> tugas
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-black"
                    >
                      ← Sebelumnya
                    </button>
                    <span className="px-4 py-2 font-bold text-black">
                      Halaman {page} dari {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!hasNextPage}
                      className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-black"
                    >
                      Berikutnya →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
