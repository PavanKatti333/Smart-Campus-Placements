const API_BASE_URL = "http://localhost:8083";

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get("content-type");
    let data = null;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      const errorMessage =
        (data && data.message) ||
        (data && data.error) ||
        (typeof data === "string" ? data : "Request failed");
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || "GET"} ${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Authentication
  login: (credentials) => request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  register: (studentData) => request("/auth/register", { method: "POST", body: JSON.stringify(studentData) }),

  // Students
  getStudents: () => request("/students"),
  getStudentById: (id) => request(`/students/${id}`),
  updateStudent: (id, studentData) => request(`/students/${id}`, { method: "PUT", body: JSON.stringify(studentData) }),

  // Companies
  getCompanies: () => request("/companies"),
  getCompanyById: (id) => request(`/companies/${id}`),
  createCompany: (companyData) => request("/companies", { method: "POST", body: JSON.stringify(companyData) }),
  deleteCompany: (id) => request(`/companies/${id}`, { method: "DELETE" }),

  // Jobs
  getJobs: () => request("/jobs"),
  getJobById: (id) => request(`/jobs/${id}`),
  createJob: (jobData) => request("/jobs", { method: "POST", body: JSON.stringify(jobData) }),
  updateJob: (id, jobData) => request(`/jobs/${id}`, { method: "PUT", body: JSON.stringify(jobData) }),
  deleteJob: (id) => request(`/jobs/${id}`, { method: "DELETE" }),

  // Applications & Eligibility
  getApplications: () => request("/applications"),
  getApplicationById: (id) => request(`/applications/${id}`),
  getApplicationsByStudentId: (studentId) => request(`/applications/student/${studentId}`),
  applyForJob: (studentId, jobId) => request("/applications", { method: "POST", body: JSON.stringify({ studentId, jobId }) }),
  updateApplicationStatus: (applicationId, status) =>
    request(`/applications/${applicationId}/status?status=${encodeURIComponent(status)}`, { method: "PUT" }),
  checkEligibility: (studentId, jobId) => request(`/applications/check-eligibility?studentId=${studentId}&jobId=${jobId}`),
  deleteApplication: (id) => request(`/applications/${id}`, { method: "DELETE" }),

  // Interviews
  getInterviews: () => request("/interviews"),
  getInterviewById: (id) => request(`/interviews/${id}`),
  getInterviewsByStudentId: (studentId) => request(`/interviews/student/${studentId}`),
  scheduleInterview: (interviewData) => request("/interviews", { method: "POST", body: JSON.stringify(interviewData) }),
  updateInterviewStatus: (interviewId, status) =>
    request(`/interviews/${interviewId}/status?status=${encodeURIComponent(status)}`, { method: "PUT" }),

  // Offers
  getOffers: () => request("/offers"),
  getOfferById: (id) => request(`/offers/${id}`),
  getOffersByStudentId: (studentId) => request(`/offers/student/${studentId}`),
  createOffer: (offerData) => request("/offers", { method: "POST", body: JSON.stringify(offerData) }),
  updateOfferStatus: (offerId, status) =>
    request(`/offers/${offerId}/status?status=${encodeURIComponent(status)}`, { method: "PUT" }),

  // Notifications
  getNotifications: (studentId) => request(`/notifications/student/${studentId}`),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: "PUT" }),

  // Analytics
  getDashboardMetrics: () => request("/analytics/dashboard"),
};

export default api;
