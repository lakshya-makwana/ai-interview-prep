import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";

import AppCard from "../components/AppCard";
import EmptyState from "../components/EmptyState";
import DashboardLayout from "../layouts/DashboardLayout";
import SectionHeader from "../components/SectionHeader";
import StatusChip from "../components/StatusChip";
import SubmissionsSkeleton from "../components/skeletons/SubmissionsSkeleton";
import { getMySubmissions } from "../services/codingSubmissionService";

function formatStatus(status) {
  if (!status) {
    return "--";
  }

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusColor(status) {
  if (status === "Accepted" || status === "accepted") {
    return "success";
  }

  if (
    status === "Wrong Answer" ||
    status === "wrong_answer"
  ) {
    return "warning";
  }

  return "error";
}

function formatDate(value) {
  if (!value) {
    return "--";
  }

  return new Date(value).toLocaleString();
}

export default function CodingSubmissions() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [problemFilter, setProblemFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubmissions() {
      try {
        const data = await getMySubmissions();
        setSubmissions(data.submissions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadSubmissions();
  }, []);

  const problemOptions = useMemo(() => {
    const problems = new Map();

    submissions.forEach((submission) => {
      problems.set(
        submission.question_id,
        submission.question_title
      );
    });

    return Array.from(problems.entries()).map(
      ([questionId, title]) => ({
        questionId,
        title,
      })
    );
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    if (!problemFilter) {
      return submissions;
    }

    return submissions.filter(
      (submission) =>
        submission.question_id === Number(problemFilter)
    );
  }, [submissions, problemFilter]);

  const columns = [
    {
      field: "question_title",
      headerName: "Problem",
      flex: 1.4,
      minWidth: 180,
    },
    {
      field: "language",
      headerName: "Language",
      flex: 0.7,
      minWidth: 110,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.9,
      minWidth: 150,
      renderCell: (params) => (
        <StatusChip
          label={formatStatus(params.value)}
          color={getStatusColor(params.value)}
        />
      ),
    },
    {
      field: "runtime_ms",
      headerName: "Runtime",
      flex: 0.7,
      minWidth: 110,
      valueFormatter: (value) =>
        value == null ? "--" : `${value} ms`,
    },
    {
      field: "score",
      headerName: "Score",
      flex: 0.6,
      minWidth: 100,
      valueFormatter: (value) => `${value}%`,
    },
    {
      field: "submitted_at",
      headerName: "Submitted At",
      flex: 1,
      minWidth: 180,
      valueFormatter: (value) => formatDate(value),
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <SubmissionsSkeleton />
      </DashboardLayout>
    );
  }

  if (submissions.length === 0) {
    return (
      <DashboardLayout>
        <EmptyState
          icon={HistoryRoundedIcon}
          title="No Submissions Yet"
          description="You haven't submitted any code solutions yet. Choose a problem from the practice library, test your code, and submit to see your execution statistics."
          actionLabel="Practice Coding"
          onAction={() => navigate("/coding")}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Stack spacing={3}>
        <AppCard>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={2}
          >
            <SectionHeader
              title="My Submissions"
              subtitle="Review your previous coding submissions."
            />

            <TextField
              select
              size="small"
              label="Filter by Problem"
              value={problemFilter}
              onChange={(e) =>
                setProblemFilter(e.target.value)
              }
              sx={{
                width: { xs: "100%", md: 260 },
              }}
            >
              <MenuItem value="">
                All problems
              </MenuItem>

              {problemOptions.map((problem) => (
                <MenuItem
                  key={problem.questionId}
                  value={problem.questionId}
                >
                  {problem.title}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </AppCard>

        {filteredSubmissions.length === 0 ? (
          <EmptyState
            icon={SearchOffRoundedIcon}
            title="No Submissions Match Filter"
            description="No submissions found for the selected problem."
            actionLabel="Show All Submissions"
            onAction={() => setProblemFilter("")}
          />
        ) : (
          <AppCard>
            <Box sx={{ height: 560, width: "100%" }}>
              <DataGrid
                rows={filteredSubmissions}
                columns={columns}
                pageSizeOptions={[10, 25, 50]}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                disableRowSelectionOnClick
                onRowClick={(params) =>
                  navigate(`/coding/submissions/${params.id}`)
                }
                sx={{
                  border: 0,
                  "& .MuiDataGrid-row": {
                    cursor: "pointer",
                  },
                }}
              />
            </Box>
          </AppCard>
        )}
      </Stack>
    </DashboardLayout>
  );
}
