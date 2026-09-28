import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export function usePlacementData(isAuthenticated, role, user, toastError) {
  const [loadingData, setLoadingData] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [offers, setOffers] = useState([]);
  const [students, setStudents] = useState([]);

  const loadPlatformData = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoadingData(true);
    try {
      if (role === "STUDENT" && user?.id) {
        const [jobsData, appsData, interviewsData, offersData] = await Promise.all([
          api.getJobs().catch(() => []),
          api.getApplicationsByStudentId(user.id).catch(() => []),
          api.getInterviewsByStudentId(user.id).catch(() => []),
          api.getOffersByStudentId(user.id).catch(() => []),
        ]);

        setJobs(Array.isArray(jobsData) ? jobsData : []);
        setApplications(Array.isArray(appsData) ? appsData : []);
        setInterviews(Array.isArray(interviewsData) ? interviewsData : []);
        setOffers(Array.isArray(offersData) ? offersData : []);
      } else if (role === "ADMIN" || role === "RECRUITER") {
        const [jobsData, compData, appsData, interviewsData, offersData, studentsData] =
          await Promise.all([
            api.getJobs().catch(() => []),
            api.getCompanies().catch(() => []),
            api.getApplications().catch(() => []),
            api.getInterviews().catch(() => []),
            api.getOffers().catch(() => []),
            api.getStudents().catch(() => []),
          ]);

        setJobs(Array.isArray(jobsData) ? jobsData : []);
        setCompanies(Array.isArray(compData) ? compData : []);
        setApplications(Array.isArray(appsData) ? appsData : []);
        setInterviews(Array.isArray(interviewsData) ? interviewsData : []);
        setOffers(Array.isArray(offersData) ? offersData : []);
        setStudents(Array.isArray(studentsData) ? studentsData : []);
      }
    } catch (err) {
      console.error("Error loading platform data:", err);
      if (toastError) {
        toastError("Failed to synchronize campus placement data.");
      }
    } finally {
      setLoadingData(false);
    }
  }, [isAuthenticated, role, user?.id, toastError]);

  useEffect(() => {
    loadPlatformData();
  }, [loadPlatformData]);

  return {
    loadingData,
    jobs,
    setJobs,
    companies,
    setCompanies,
    applications,
    setApplications,
    interviews,
    setInterviews,
    offers,
    setOffers,
    students,
    setStudents,
    refreshData: loadPlatformData,
  };
}
