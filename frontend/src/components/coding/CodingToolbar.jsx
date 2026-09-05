import {
  Box,
  Chip,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function CodingToolbar({
  total,
  search,
  setSearch,
  difficulty,
  setDifficulty,
  category,
  setCategory,
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
        placeholder="Search problems..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
      >
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

        <TextField
          select
          size="small"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: 220, ml: 2 }}
        >
          <MenuItem value="">All Categories</MenuItem>

          <MenuItem value="arrays">Arrays</MenuItem>
          <MenuItem value="two_pointers">Two Pointers</MenuItem>
          <MenuItem value="sliding_window">Sliding Window</MenuItem>
          <MenuItem value="binary_search">Binary Search</MenuItem>
          <MenuItem value="linked_list">Linked List</MenuItem>
          <MenuItem value="trees">Trees</MenuItem>
          <MenuItem value="graphs">Graphs</MenuItem>
          <MenuItem value="dynamic_programming">
            Dynamic Programming
          </MenuItem>
        </TextField>
      </Stack>
    </Box>
  );
}