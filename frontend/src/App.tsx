
import {
  useEffect,
  useState,
  type ComponentProps,
  type ChangeEvent,
} from "react";
import axios from "axios";
import "./App.css";

// API configuration
const API_URL = import.meta.env.VITE_API_URL;

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
  created_at?: string;
}

interface EmployeeForm {
  name: string;
  email: string;
  role: string;
}

const emptyForm: EmployeeForm = {
  name: "",
  email: "",
  role: "",
};

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState<EmployeeForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      setError("");

      const response = await axios.get<Employee[]>(
        `${API_URL}/employees`
      );

      setEmployees(response.data);
    } catch (err: unknown) {
      console.error("Fetch employees error:", err);

      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ||
              "Failed to load employees. Check your backend."
          : "Failed to load employees."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchEmployees();
  }, []);

  // Handle form inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Search by name, email, or role
  const filteredEmployees = employees.filter((employee) => {
    const query = search.trim().toLowerCase();

    return (
      employee.name.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query) ||
      employee.role.toLowerCase().includes(query)
    );
  });

  // Pagination calculations
  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / pageSize)
  );

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  // Keep page valid when records are deleted or filtered
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Add or update employee
  const handleSubmit: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await axios.put(
          `${API_URL}/employees/${editingId}`,
          form
        );

        setSuccess("Employee updated successfully!");
      } else {
        await axios.post(`${API_URL}/employees`, form);

        setSuccess("Employee added successfully!");
        setSearch("");
        setCurrentPage(1);
      }

      setForm(emptyForm);
      setEditingId(null);

      await fetchEmployees();
    } catch (err: unknown) {
      console.error("Save employee error:", err);

      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ||
              err.response?.data?.error ||
              err.message ||
              "Failed to save employee."
          : "Failed to save employee."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (employee: Employee) => {
    setForm({
      name: employee.name,
      email: employee.email,
      role: employee.role,
    });

    setEditingId(employee._id);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    setSuccess("");

    try {
      await axios.delete(`${API_URL}/employees/${id}`);

      setSuccess("Employee deleted successfully!");

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }

      await fetchEmployees();
    } catch (err: unknown) {
      console.error("Delete employee error:", err);

      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ||
              "Failed to delete employee."
          : "Failed to delete employee."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
  };

  return (
    <main className="app-container">
      <header className="page-header">
        <div>
          <h1>Employee Management</h1>
          <p>Manage your team in one place.</p>
        </div>
      </header>

      <section className="form-card">
        <div className="section-heading">
          <div>
            <h2>
              {editingId ? "Edit Employee" : "Add New Employee"}
            </h2>

            <p>
              {editingId
                ? "Update the employee information below."
                : "Enter the details to add an employee."}
            </p>
          </div>
        </div>

        {error && (
          <div className="alert error" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert success" role="status">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Full Name

              <input
                name="name"
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Email Address

              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="role-field">
              Role

              <input
                name="role"
                type="text"
                placeholder="Enter your role"
                value={form.role}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-actions">
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Employee"
                  : "+ Add Employee"}
            </button>
          </div>
        </form>
      </section>

      {/* Employee List */}
      <section className="table-card">
        <div className="table-heading">
          <div>
            <h2>All Employees</h2>
            <p>Search and manage your employee records.</p>
          </div>

          <span className="count-badge">
            {filteredEmployees.length} employees
          </span>
        </div>

        {/* Search and Page Size */}
        <div className="table-controls">
          <div className="search-box">
            <span className="search-icon" aria-hidden="true">
              ⌕
            </span>

            <input
              type="search"
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search employees"
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <label className="page-size-control">
            Show

            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              aria-label="Employees per page"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>

            entries
          </label>
        </div>

        {/* Loading, Empty State, or Employee Table */}
        {loading ? (
          <p className="empty-state">Loading employees...</p>
        ) : filteredEmployees.length === 0 ? (
          <p className="empty-state">
            {search
              ? "No employees match your search."
              : "No employees found. Add your first employee above."}
          </p>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedEmployees.map((employee) => (
                    <tr key={employee._id}>
                      <td>
                        <div className="employee-name">
                          <span className="avatar">
                            {employee.name
                              .charAt(0)
                              .toUpperCase()}
                          </span>

                          <strong>{employee.name}</strong>
                        </div>
                      </td>

                      <td>{employee.email}</td>

                      <td>
                        <span className="role-badge">
                          {employee.role}
                        </span>
                      </td>

                      <td>
                        {employee.created_at
                          ? new Date(
                              employee.created_at
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      <td>
                        <div className="row-actions">
                          <button
                            className="btn-edit"
                            type="button"
                            onClick={() => handleEdit(employee)}
                            disabled={saving || deletingId !== null}
                          >
                            Edit
                          </button>

                          <button
                            className="btn-delete"
                            type="button"
                            onClick={() =>
                              void handleDelete(employee._id)
                            }
                            disabled={
                              deletingId !== null || saving
                            }
                          >
                            {deletingId === employee._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
              <p className="pagination-info">
                Showing{" "}
                {(currentPage - 1) * pageSize + 1}
                {"–"}
                {Math.min(
                  currentPage * pageSize,
                  filteredEmployees.length
                )}
                {" of "}
                {filteredEmployees.length} employees
              </p>

              <div className="pagination-buttons">
                <button
                  type="button"
                  className="page-btn"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => page - 1)
                  }
                >
                  Previous
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                )
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                  )
                  .map((page, index, pages) => (
                    <span key={page} className="page-item">
                      {index > 0 &&
                        page - pages[index - 1] > 1 && (
                          <span className="page-dots">
                            …
                          </span>
                        )}

                      <button
                        type="button"
                        className={`page-btn ${
                          currentPage === page ? "active" : ""
                        }`}
                        onClick={() => setCurrentPage(page)}
                        aria-current={
                          currentPage === page ? "page" : undefined
                        }
                      >
                        {page}
                      </button>
                    </span>
                  ))}

                <button
                  type="button"
                  className="page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => page + 1)
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="page-footer">
        Employee Management System · React + TypeScript
      </footer>
    </main>
  );
}

export default App;
