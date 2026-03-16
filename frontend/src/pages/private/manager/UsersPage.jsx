import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Avatar,
  CircularProgress,
  InputAdornment,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, fetchUsers } from "../../../features/users/usersSlice";

const RED = "#a91111";
const RED_LIGHT = "#fff0f0";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#fafafa",
    fontSize: "0.88rem",
    "& fieldset": { borderColor: "#ebebeb" },
    "&:hover fieldset": { borderColor: "#ccc" },
    "&.Mui-focused fieldset": { borderColor: RED, borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root": { fontSize: "0.88rem" },
  "& label.Mui-focused": { color: RED },
  "& .MuiInputBase-input": { py: "10px", px: "14px" },
};

const AVATAR_COLORS = [
  "#a91111",
  "#1565c0",
  "#2e7d32",
  "#6a1b9a",
  "#e65100",
  "#00695c",
  "#37474f",
  "#ad1457",
];

function getAvatarColor(name = "") {
  const firstChar = name.trim()[0] || "A";
  const index = firstChar.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getRoleStyles(role) {
  if (role === "Manager") {
    return {
      bg: "#eff6ff",
      border: "#bfdbfe",
      color: "#1d4ed8",
    };
  }

  if (role === "Vet") {
    return {
      bg: "#f0fdf4",
      border: "#bbf7d0",
      color: "#166534",
    };
  }

  if (role === "Caretaker") {
    return {
      bg: "#fff7ed",
      border: "#fed7aa",
      color: "#c2410c",
    };
  }

  return {
    bg: "#fafafa",
    border: "#ebebeb",
    color: "#888",
  };
}

function UserCard({ user, onDelete }) {
  const roleStyle = getRoleStyles(user.role);
  const fullName = user.username || "-";
  const initials = getInitials(fullName);

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: "16px",
        border: "1.5px solid #f0f0f0",
        p: 2.5,
        transition: "box-shadow 0.2s, transform 0.2s",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2 }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            backgroundColor: getAvatarColor(fullName),
            fontSize: "1rem",
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {initials || <PersonOutlineIcon />}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "0.95rem",
              color: "#1a1a1a",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {fullName}
          </Typography>

          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              mt: 0.3,
              px: 1,
              py: 0.2,
              borderRadius: "6px",
              backgroundColor: RED_LIGHT,
              border: "1px solid rgba(169,17,17,0.15)",
            }}
          >
            <ManageAccountsOutlinedIcon sx={{ fontSize: 11, color: RED }} />
            <Typography
              sx={{ fontSize: "0.68rem", fontWeight: 700, color: RED }}
            >
              Utilizator platforma
            </Typography>
          </Box>
        </Box>

        <Box
          onClick={() => onDelete(user)}
          sx={{
            width: 30,
            height: 30,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#ccc",
            "&:hover": { backgroundColor: "#ffebee", color: "#d32f2f" },
            transition: "all 0.15s",
            flexShrink: 0,
          }}
        >
          <DeleteOutlineIcon sx={{ fontSize: 17 }} />
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BadgeOutlinedIcon sx={{ fontSize: 14, color: "#bbb" }} />
          <Typography
            sx={{
              fontSize: "0.78rem",
              color: "#666",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user.email || "-"}
          </Typography>
        </Box>

        {user.phonenumber && (
          <Typography sx={{ fontSize: "0.78rem", color: "#666" }}>
            {user.phonenumber}
          </Typography>
        )}

        {user.address && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PlaceOutlinedIcon sx={{ fontSize: 14, color: "#bbb" }} />
            <Typography sx={{ fontSize: "0.78rem", color: "#666" }}>
              {user.address}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
          <Box
            sx={{
              px: 1,
              py: 0.3,
              borderRadius: "6px",
              backgroundColor: roleStyle.bg,
              border: `1px solid ${roleStyle.border}`,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color: roleStyle.color,
              }}
            >
              {user.role}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function UsersPage() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((s) => s.users);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setOpenDelete(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) {
      return;
    }

    setDeleteLoading(true);
    await dispatch(deleteUser(selectedUser.id));
    setDeleteLoading(false);
    setOpenDelete(false);
    setSelectedUser(null);
  };

  const filtered = users.filter((user) => {
    const searchValue = search.toLowerCase();
    const nameMatch = (user.username || "").toLowerCase().includes(searchValue);
    const emailMatch = (user.email || "").toLowerCase().includes(searchValue);
    const roleMatch = filterRole === "all" || user.role === filterRole;

    return (nameMatch || emailMatch) && roleMatch;
  });

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2, md: 4 },
        pb: { xs: 10, sm: 4 },
        maxWidth: 1200,
        mx: "auto",
        width: "100%",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: { xs: 2.5, md: 4 },
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                backgroundColor: RED,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ManageAccountsOutlinedIcon sx={{ color: "white", fontSize: 18 }} />
            </Box>
            <Typography
              sx={{
                fontSize: "1.4rem",
                fontWeight: 800,
                color: "#1a1a1a",
                letterSpacing: "-0.5px",
              }}
            >
              Utilizatori
            </Typography>
          </Box>
          <Typography sx={{ fontSize: "0.85rem", color: "#aaa", ml: "52px" }}>
            {users.length} utilizatori in platforma
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 1.5,
          mb: { xs: 2, md: 3 },
        }}
      >
        <TextField
          placeholder="Cauta dupa nume sau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: "#ccc" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ManageAccountsOutlinedIcon sx={{ fontSize: 18, color: "#ccc" }} />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="all">Toate rolurile</MenuItem>
          <MenuItem value="user">user</MenuItem>
          <MenuItem value="Manager">Manager</MenuItem>
          <MenuItem value="Vet">Vet</MenuItem>
          <MenuItem value="Caretaker">Caretaker</MenuItem>
        </TextField>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: RED }} />
        </Box>
      ) : filtered.length === 0 ? (
        <Box
          sx={{
            py: 8,
            textAlign: "center",
            backgroundColor: "white",
            borderRadius: "16px",
            border: "1.5px dashed #e0e0e0",
          }}
        >
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#bbb" }}>
            Niciun utilizator gasit
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: "#ccc", mt: 0.5 }}>
            Incearca sa schimbi filtrele sau termenul de cautare
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: { xs: 1.5, md: 2 },
            alignItems: "stretch",
          }}
        >
          {filtered.map((user) => (
            <UserCard key={user.id} user={user} onDelete={handleDeleteClick} />
          ))}
        </Box>
      )}

      <Dialog
        open={openDelete}
        onClose={() => !deleteLoading && setOpenDelete(false)}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            p: 1,
            width: { xs: "calc(100vw - 24px)", sm: 340 },
            maxWidth: "calc(100vw - 24px)",
            m: { xs: 1.5, sm: 2 },
          },
        }}
      >
        <DialogTitle sx={{ pb: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                backgroundColor: "#ffebee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DeleteOutlineIcon sx={{ color: "#d32f2f", fontSize: 18 }} />
            </Box>
            <Typography fontWeight={800} fontSize="1rem">
              Confirma stergerea
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: "1rem !important" }}>
          <Typography fontSize="0.9rem" color="#555">
            Esti sigur ca vrei sa stergi pe <strong>{selectedUser?.username}</strong>
            ? Aceasta actiune nu poate fi anulata.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setOpenDelete(false)}
            disabled={deleteLoading}
            sx={{
              color: "#999",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
            }}
          >
            Anuleaza
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
            sx={{
              backgroundColor: "#d32f2f",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              "&:hover": { backgroundColor: "#b71c1c" },
            }}
          >
            {deleteLoading ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : (
              "Sterge"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
