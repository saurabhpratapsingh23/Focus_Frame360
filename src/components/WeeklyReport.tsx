import React, { useEffect, useState, useRef } from "react";
import {
  Typography,
  Box,
  Divider,
  Paper,
  Chip,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


interface EmployeeData {
  e_emp_code: string;
  e_fullname: string;
  e_work_location: string;
  e_address: string;
  e_email: string;
  e_phone: string;
  e_department: string;
  e_designation: string;
  e_DOJ: string;
  e_DOB: string;
  e_emp_id: number;
  e_password: string;
  e_last_login_date: string;
  e_active: boolean;
  e_create_date: string;
}


const WeeklyReport: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  // The weekly data passed from WeeklySummaryPopScreen
  const weeklyData = location.state?.weeklyData || null;

  const [employee, setEmployee] = useState<EmployeeData | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch employee data based on empCode from sessionStorage 
  useEffect(() => {
    let empCode = null;
    try {
      const currentUser = sessionStorage.getItem("currentUser");
      if (currentUser) {
        try {
          const parsed = JSON.parse(currentUser);
          empCode = parsed.e_emp_code || parsed;
        } catch {
          empCode = currentUser;
        }
      }
    } catch {
      empCode = null;
    }
    if (empCode) {
      fetch(`${apiBaseUrl}/pms/api/e/employee/${empCode}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch employee data");
          return res.json();
        })
        .then((data) => {
          if (!data) return; // 304 or no data
          setEmployee({
            e_emp_code: data.e_emp_code || empCode || "N/A",
            e_fullname: data.e_fullname || "N/A",
            e_work_location: data.e_work_location || "NCR",
            e_address: data.e_address || "N/A",
            e_email: data.e_email || "N/A",
            e_phone: data.e_phone || "N/A",
            e_department: data.e_department || "Compliance & Audit",
            e_designation: data.e_designation || "N/A",
            e_DOJ: data.e_DOJ || "N/A",
            e_DOB: data.e_DOB || "N/A",
            e_emp_id: data.e_emp_id || 0,
            e_password: data.e_password || "",
            e_last_login_date: data.e_last_login_date || "N/A",
            e_active: typeof data.e_active === "boolean" ? data.e_active : false,
            e_create_date: data.e_create_date || "N/A",
          });
        })
        .catch(() => {
          setEmployee(null);
        });
    }
  }, [apiBaseUrl]);

  const expectedEfforts = 80;
  const totalEfforts = Number(weeklyData?.ws_efforts) || 0;

  if (!weeklyData) {
    return (
      <Box sx={{ maxWidth: 700, mx: "auto", p: 6, bgcolor: "#f9fafb", borderRadius: 2 }}>
        <Typography variant="h6" color="error" align="center" sx={{ mt: 20 }}>
          No Weekly Data Provided. Please access this page via the Weekly Summary screen.
        </Typography>
        <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
          <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Box>
      </Box>
    );
  }

  // HTML2Canvas + jsPDF export function
  const handleExportPDF = async () => {
    if (!contentRef.current) return;

    try {
      const element = contentRef.current;

      const canvas = await html2canvas(element, {
        scale: 2, // higher scale = better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // If the content is too tall, we might need to split it across pages
      if (pdfHeight > pdf.internal.pageSize.getHeight()) {
        // Handle multi-page content
        const pageHeight = pdf.internal.pageSize.getHeight();
        let position = 0;
        
        while (position < pdfHeight) {
          pdf.addImage(imgData, "PNG", 0, -position, pdfWidth, pdfHeight);
          position += pageHeight;
          
          if (position < pdfHeight) {
            pdf.addPage();
          }
        }
      } else {
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      }

      const fileName = employee?.e_fullname 
        ? `${employee.e_fullname.replace(/\s+/g, "_")}_Weekly_Report.pdf`
        : "Weekly_Report.pdf";
      
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  // Keep the original text-based PDF function as a backup
  const handleDownloadPdf = () => {
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const margin = 40;
    const lineHeight = 18;
    const pageHeight = pdf.internal.pageSize.getHeight();
    const maxWidth = pdf.internal.pageSize.getWidth() - margin * 2;
    let y = margin;

    pdf.setFont("helvetica");
    pdf.setFontSize(18);
    pdf.text("Weekly Report", margin, y);
    y += 30;

    pdf.setFontSize(13);
    if (employee) {
      pdf.text(`Name: ${employee.e_fullname}`, margin, y);
      y += lineHeight;
      pdf.text(`Employee Code: ${employee.e_emp_code}`, margin, y);
      y += lineHeight;
      pdf.text(`Designation: ${employee.e_designation}`, margin, y);
      y += lineHeight;
      pdf.text(`Department: ${employee.e_department}`, margin, y);
      y += lineHeight;
    }
    y += lineHeight;

    const period =
      weeklyData.ws_start_date && weeklyData.ws_end_date
        ? `Period: ${weeklyData.ws_start_date} – ${weeklyData.ws_end_date}`
        : "Period: N/A";
    pdf.text(period, margin, y);
    y += lineHeight * 2;

    const topFields = [
      { key: "ws_week_id", label: "Week ID" },
      { key: "ws_work_days", label: "Work Days" },
      { key: "ws_Holidays", label: "Holidays" },
      { key: "ws_WFH", label: "Work From Home" },
      { key: "ws_WFO", label: "Work From Office" },
      { key: "ws_efforts", label: "Efforts (hrs)" },
      { key: "ws_leaves", label: "Leaves" },
      { key: "ws_extra_days", label: "WOH" },
    ];

    topFields.forEach(({ key, label }) => {
      const value = weeklyData[key];
      if (value !== undefined) {
        pdf.text(`${label}: ${value}`, margin, y);
        y += lineHeight;
        if (y > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
      }
    });
    y += lineHeight;

    const utilizationText = totalEfforts < expectedEfforts ? "Needs Attention" : "On Track";
    pdf.text(`Utilization Health: ${utilizationText}`, margin, y);
    y += lineHeight * 2;

    const sections = [
      { key: "ws_success", label: "Weekly Success" },
      { key: "ws_challenges", label: "Roadblocks" },
      { key: "ws_unfinished_tasks", label: "Unfinished Tasks" },
      { key: "ws_next_actions", label: "Next Actions" },
    ];

    pdf.setFontSize(15);

    sections.forEach(({ key, label }) => {
      if (weeklyData[key]) {
        pdf.text(label, margin, y);
        y += lineHeight;
        pdf.setFontSize(12);

        const lines = pdf.splitTextToSize(weeklyData[key], maxWidth);
        lines.forEach((line: any) => {
          if (y > pageHeight - margin) {
            pdf.addPage();
            y = margin;
          }
          pdf.text(line, margin + 10, y);
          y += lineHeight;
        });

        y += lineHeight;
        pdf.setFontSize(15);
      }
    });

    pdf.save("WeeklyReport.pdf");
  };

  // const handleDownloadPdfAlter = () => window.print();

  return (
    <Box sx={{ maxWidth: 1800, mx: "auto", p: 4, bgcolor: "#f9fafb", borderRadius: 2 }}>
      <Paper
        ref={contentRef}
        elevation={3}
        sx={{
          p: 4,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: "0 3px 5px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4,
            boxShadow: "0 5px 8px rgba(0,0,0,0.5)",
            p: 3,
            borderRadius: 2,
            bgcolor: "#f0f4f8", }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="text.primary" sx={{display: "inline-block", gap: "2px", 
              spaces: 1,
            }} gutterBottom>
              {employee?.e_fullname ?? "Loading..."}
            </Typography>
            <Typography color="text.secondary" sx={{  
              display: "inline-block",
              fontSize: "11px",
              color: "#0a1325",
              background: "#c6e8ff",
              padding: "4px 8px",
              borderRadius: "999px",
              border: "1px solid rgba(10,19,37,.08)",
              marginLeft: "8px"
            }}>
              {employee?.e_emp_code ?? "-"}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
              {employee
          ? `${employee.e_designation} • ${employee.e_department} • ${employee.e_work_location}`
          : "-"}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 200, textAlign: "right", display: "flex", alignItems: "center"  }} 
          className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M7 2v3M17 2v3M3.5 9.5h17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Period: {weeklyData.ws_start_date ?? "-"} – {weeklyData.ws_end_date ?? "-"}
          </Typography>
        </Box> 
        
        {/* Summary Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 3,
            color: "text.secondary",
            mb: 4,
            boxShadow: "0 5px 8px rgba(0,0,0,0.5)",
            p: 3,
            borderRadius: 2,
            bgcolor: "#f0f4f8",
          }}
        >
          {[
            { label: "Official Working Days", value: weeklyData.ws_work_days },
            { label: "Work From Home", value: weeklyData.ws_WFH },
            { label: "Work From Office", value: weeklyData.ws_WFO },
            { label: "Leaves Taken", value: weeklyData.ws_leaves },
            { label: "Official Holidays", value: weeklyData.ws_Holidays },
            { label: "Worked on Holidays", value: weeklyData.ws_extra_days },
            { label: "Total Efforts (hrs)", value: weeklyData.ws_efforts },
            { label: "Expected Efforts (hrs)", value: expectedEfforts },
            { label: "Utilization Health", value: totalEfforts < expectedEfforts ? "Needs Attention" : "On Track", isChip: true },
          ].map(({ label, value, isChip }) => (
            <Box key={label}>
              <Typography fontWeight="bold" sx={{ mb: 0.5 }}>
                {label}
              </Typography>
              {isChip ? (
                <Chip
                  label={value}
                  color={value === "On Track" ? "success" : "warning"}
                  icon={value === "On Track" ? <CheckCircleIcon /> : <WarningAmberIcon />}
                  size="small"
                />
              ) : (
                <Typography>{value ?? "-"}</Typography>
              )}
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Sections in card style, 2 per row */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 3,
          mb: 4,
        }}>
          {[ 
            { label: "Weekly Success", icon: <CheckCircleIcon sx={{ mr: 1 }} />, color: "success.main", data: weeklyData.ws_success },
            { label: "Roadblocks", icon: <WarningAmberIcon sx={{ mr: 1 }} />, color: "warning.main", data: weeklyData.ws_challenges },
            { label: "Unfinished Tasks", icon: <ScheduleIcon sx={{ mr: 1 }} />, color: "text.secondary", data: weeklyData.ws_unfinished_tasks },
            { label: "Next Actions", icon: <ArrowForwardIosIcon sx={{ mr: 1 }} />, color: "info.main", data: weeklyData.ws_next_actions },
          ].map(({ label, icon, color, data }) => (
            <Paper key={label} elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: '#f8fafc', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ display: "flex", alignItems: "center", color, mb: 1 }}>
                {icon} {label}
              </Typography>
              <Typography sx={{ whiteSpace: "pre-wrap", color: "text.primary", fontSize: 15 }}>
                {data || "-"}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Paper>

      {/* Download & Back Buttons - Outside the content ref for better PDF layout */}
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mt: 3 }}>
        <Button variant="outlined" color="secondary" onClick={() => navigate('/app/performance')}>
          Back to Performance
        </Button>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" color="primary" onClick={handleDownloadPdf}>
            Download Text PDF
          </Button>
          <Button variant="contained" color="primary" onClick={handleExportPDF}>
            Export as PDF
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default WeeklyReport;
