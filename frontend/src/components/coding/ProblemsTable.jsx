import { useNavigate } from "react-router-dom";

import {
  Chip,
  IconButton,
  Paper,
  Stack,
  Tooltip,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";

import EmptyState from "../EmptyState";
import ProblemsSkeleton from "../skeletons/ProblemsSkeleton";

export default function ProblemsTable({
  questions,
  loading,
  onToggleFavorite,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
}) {
  const navigate = useNavigate();

  const columns = [
    {
      field: "is_favorited",
      headerName: "",
      width: 64,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Tooltip
          title={
            params.value
              ? "Remove from favorites"
              : "Add to favorites"
          }
        >
          <IconButton
            size="small"
            aria-label={params.value ? "Remove from favorites" : "Add to favorites"}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite?.(params.row);
            }}
          >
            {params.value ? (
              <BookmarkRoundedIcon color="primary" />
            ) : (
              <BookmarkBorderRoundedIcon />
            )}
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: "title",
      headerName: "Problem",
      flex: 2,
      minWidth: 320,
    },
    {
      field: "difficulty",
      headerName: "Difficulty",
      width: 140,

      sortComparator: (v1, v2) => {
        const order = {
          easy: 0,
          medium: 1,
          hard: 2,
        };

        return order[v1] - order[v2];
      },

      renderCell: (params) => {
        const difficulty = params.value;

        let color = "default";

        if (difficulty === "easy") color = "success";
        if (difficulty === "medium") color = "warning";
        if (difficulty === "hard") color = "error";

        return (
          <Chip
            label={difficulty.toUpperCase()}
            color={color}
            size="small"
          />
        );
      },
    },
    {
      field: "category",
      headerName: "Category",
      width: 180,
    },
    {
      field: "tags",
      headerName: "Tags",
      flex: 1,
      minWidth: 220,
      sortable: false,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={0.5}
          flexWrap="wrap"
          sx={{ py: 1 }}
        >
          {(params.value || []).slice(0, 3).map((tag) => (
            <Chip
              key={tag.id}
              label={tag.name}
              size="small"
              variant="outlined"
            />
          ))}
        </Stack>
      ),
    },
    {
      field: "companies",
      headerName: "Companies",
      flex: 1,
      minWidth: 220,
      sortable: false,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={0.5}
          flexWrap="wrap"
          sx={{ py: 1 }}
        >
          {(params.value || [])
            .slice(0, 3)
            .map((company) => (
              <Chip
                key={company.id}
                label={company.name}
                size="small"
              />
            ))}
        </Stack>
      ),
    },
    {
      field: "acceptance_rate",
      headerName: "Acceptance",
      width: 140,
      renderCell: (params) =>
        `${params.value}%`,
    },
  ];

  if (loading) {
    return <ProblemsSkeleton rows={8} />;
  }

  if (!questions || questions.length === 0) {
    return (
      <EmptyState
        icon={SearchOffRoundedIcon}
        title={emptyTitle || "No Problems Found"}
        description={emptyDescription || "No coding practice problems matched your selected search query and filter criteria."}
        actionLabel={emptyActionLabel || (onEmptyAction ? "Reset Filters" : undefined)}
        onAction={onEmptyAction}
        sx={{ mt: 3 }}
      />
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        mt: 3,
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <DataGrid
        rows={questions}
        columns={columns}
        loading={loading}
        pageSizeOptions={[20]}
        disableRowSelectionOnClick
        autoHeight
        getRowHeight={() => "auto"}
        onRowClick={(params) =>
          navigate(`/coding/${params.row.slug}`)
        }
      />
    </Paper>
  );
}
