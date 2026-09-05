import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export default function CodingToolbar({
  total,
  search,
  setSearch,
  difficulty,
  setDifficulty,
  category,
  setCategory,
  tag,
  setTag,
  tagsList = [],
  solved,
  setSolved,
  favorite,
  setFavorite,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onResetFilters,
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          Coding Practice
        </Typography>

        <Typography color="text.secondary">
          {total} Problems
        </Typography>
      </Stack>

      <TextField
        fullWidth
        placeholder="Search problems by title or slug..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      <Stack spacing={2}>
        <Stack
          direction="row"
          spacing={1.5}
          flexWrap="wrap"
          alignItems="center"
        >
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Chip
              label="All"
              clickable
              color={difficulty === "" ? "primary" : "default"}
              onClick={() => setDifficulty("")}
            />

            <Chip
              label="Easy"
              clickable
              color={difficulty === "easy" ? "success" : "default"}
              onClick={() => setDifficulty("easy")}
            />

            <Chip
              label="Medium"
              clickable
              color={difficulty === "medium" ? "warning" : "default"}
              onClick={() => setDifficulty("medium")}
            />

            <Chip
              label="Hard"
              clickable
              color={difficulty === "hard" ? "error" : "default"}
              onClick={() => setDifficulty("hard")}
            />
          </Box>

          <TextField
            select
            size="small"
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="arrays">Arrays</MenuItem>
            <MenuItem value="two_pointers">Two Pointers</MenuItem>
            <MenuItem value="sliding_window">Sliding Window</MenuItem>
            <MenuItem value="binary_search">Binary Search</MenuItem>
            <MenuItem value="linked_list">Linked List</MenuItem>
            <MenuItem value="trees">Trees</MenuItem>
            <MenuItem value="graphs">Graphs</MenuItem>
            <MenuItem value="dynamic_programming">Dynamic Programming</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label="Tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All Tags</MenuItem>
            {tagsList.map((t) => (
              <MenuItem key={t.id || t.name} value={t.name}>
                {t.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <FormControlLabel
              control={
                <Switch
                  checked={solved === true}
                  onChange={(e) => setSolved(e.target.checked ? true : null)}
                  color="primary"
                />
              }
              label="Solved Only"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={favorite === true}
                  onChange={(e) => setFavorite(e.target.checked ? true : null)}
                  color="primary"
                />
              }
              label="Favorites Only"
            />
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            <TextField
              select
              size="small"
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="id">Default</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="difficulty">Difficulty</MenuItem>
              <MenuItem value="acceptance_rate">Acceptance Rate</MenuItem>
              <MenuItem value="estimated_time">Estimated Time</MenuItem>
              <MenuItem value="newest">Newest</MenuItem>
            </TextField>

            <TextField
              select
              size="small"
              label="Order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              sx={{ minWidth: 130 }}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </TextField>

            {onResetFilters && (
              <Button
                variant="outlined"
                size="medium"
                startIcon={<RestartAltIcon />}
                onClick={onResetFilters}
              >
                Reset
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}