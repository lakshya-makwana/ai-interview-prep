import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import AppCard from "../components/AppCard";
import CodeEditor from "../components/coding/CodeEditor";
import DashboardLayout from "../layouts/DashboardLayout";
import SectionHeader from "../components/SectionHeader";
import StatusChip from "../components/StatusChip";
import { getSubmission } from "../services/codingSubmissionService";

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

function DetailItem({ label, value }) {
  return (
    <Box
      sx={{
        p: 2,
        border: 1,
        borderColor: "divider",
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        fontWeight={700}
      >
        {label}
      </Typography>
      <Typography sx={{ mt: 0.75 }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function CodingSubmissionDetail() {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubmission() {
      try {
        const data = await getSubmission(id);
        setSubmission(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadSubmission();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: 360 }}
        >
          <CircularProgress />
          <Typography
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            Loading submission...
          </Typography>
        </Stack>
      </DashboardLayout>
    );
  }

  if (!submission) {
    return (
      <DashboardLayout>
        <Typography variant="h5">
          Submission not found.
        </Typography>
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
              title={submission.question_title}
              subtitle="Submission details"
            />

            <StatusChip
              label={formatStatus(submission.status)}
              color={getStatusColor(submission.status)}
              sx={{ width: "fit-content" }}
            />
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                lg: "repeat(4, 1fr)",
              },
              gap: 2,
            }}
          >
            <DetailItem
              label="Language"
              value={submission.language}
            />
            <DetailItem
              label="Runtime"
              value={
                submission.runtime_ms == null
                  ? "--"
                  : `${submission.runtime_ms} ms`
              }
            />
            <DetailItem
              label="Memory"
              value={
                submission.memory_kb == null
                  ? "--"
                  : `${submission.memory_kb} KB`
              }
            />
            <DetailItem
              label="Passed Test Cases"
              value={`${submission.passed_test_cases} / ${submission.total_test_cases}`}
            />
            <DetailItem
              label="Score"
              value={`${submission.score}%`}
            />
            <DetailItem
              label="Submission Time"
              value={formatDate(submission.submitted_at)}
            />
          </Box>

          {submission.compiler_output && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography
                variant="subtitle1"
                fontWeight={700}
                gutterBottom
              >
                Compiler Output
              </Typography>
              <Typography
                sx={{
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                }}
              >
                {submission.compiler_output}
              </Typography>
            </>
          )}
        </AppCard>

        <AppCard>
          <SectionHeader
            title="Submitted Code"
            subtitle="Read-only source code from this submission."
          />

          <Box
            sx={{
              height: 520,
              overflow: "hidden",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CodeEditor
              language={submission.language}
              code={submission.source_code}
              setCode={() => {}}
              readOnly
            />
          </Box>
        </AppCard>
      </Stack>
    </DashboardLayout>
  );
}
