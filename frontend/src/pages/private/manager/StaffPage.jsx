import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Avatar,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../../../features/staff/staffSlice";
import { fetchPositions } from "../../../features/positions/positionsSlice";

const RED = "#a91111";
const RED_LIGHT = "#fff0f0";
const RED_DARK = "#8a0d0d";

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

function StaffCard({ member, positionTitle, onEdit, onDelete }) {
  const fullName = member.name || "-";
  const role = positionTitle || "-";
  const email = member.email || "-";
  const phone = member.phonenumber || null;
  const initials = getInitials(fullName);

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: "16px",
        border: "1.5px solid #f0f0f0",
        p: 2.5,
        width: "100%",
        height: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
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
            <WorkOutlineIcon sx={{ fontSize: 11, color: RED }} />
            <Typography
              sx={{ fontSize: "0.68rem", fontWeight: 700, color: RED }}
            >
              {positionTitle}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 0.6, flexShrink: 0 }}>
          <Box
            onClick={() => onEdit(member)}
            sx={{
              width: 30,
              height: 30,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#ccc",
              "&:hover": { backgroundColor: "#f5f5f5", color: "#666" },
              transition: "all 0.15s",
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 17 }} />
          </Box>

          <Box
            onClick={() => onDelete(member)}
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
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 17 }} />
          </Box>
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
            {email}
          </Typography>
        </Box>

        {phone && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: "0.78rem", color: "#666" }}>
              {phone}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
          <Box
            sx={{
              px: 1,
              py: 0.3,
              borderRadius: "6px",
              backgroundColor:
                role === "Manager"
                  ? "#eff6ff"
                  : role === "Vet"
                    ? "#f0fdf4"
                    : role === "Caretaker"
                      ? "#fff7ed"
                      : "#fafafa",
              border: `1px solid ${
                role === "Manager"
                  ? "#bfdbfe"
                  : role === "Vet"
                    ? "#bbf7d0"
                    : role === "Caretaker"
                      ? "#fed7aa"
                      : "#ebebeb"
              }`,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color:
                  role === "Manager"
                    ? "#1d4ed8"
                    : role === "Vet"
                      ? "#166534"
                      : role === "Caretaker"
                        ? "#c2410c"
                        : "#888",
              }}
            >
              {role}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function StaffPage() {
  const dispatch = useDispatch();
  const { staff, loading } = useSelector((s) => s.staff);
  const { positions, loading: positionsLoading } = useSelector(
    (s) => s.positions,
  );

  const emptyForm = {
    name: "",
    email: "",
    phonenumber: "",
    position_id: "",
  };

  const [search, setSearch] = useState("");
  const [filterPosition, setFilterPosition] = useState("all");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editError, setEditError] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [editFormData, setEditFormData] = useState(emptyForm);

  useEffect(() => {
    dispatch(fetchStaff());
    dispatch(fetchPositions());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditChange = (e) => {
    setEditFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getPositionTitle = (member) => {
    if (member.Position?.title) {
      return member.Position.title;
    }

    const position = positions.find((item) => item.id === member.position_id);
    return position?.title || "-";
  };

  const handleAdd = async () => {
    setError(null);
    setAddLoading(true);
    const result = await dispatch(createStaff(formData));
    setAddLoading(false);

    if (result.meta?.requestStatus === "fulfilled") {
      dispatch(fetchStaff());
      setOpenAdd(false);
      setFormData(emptyForm);
      return;
    }

    setError(
      typeof result.payload === "string"
        ? result.payload
        : "A aparut o eroare. Incearca din nou.",
    );
  };

  const handleEditClick = (member) => {
    setSelectedMember(member);
    setEditError(null);
    setEditFormData({
      name: member.name || "",
      email: member.email || "",
      phonenumber: member.phonenumber || "",
      position_id: member.position_id || "",
    });
    setOpenEdit(true);
  };

  const handleEditSave = async () => {
    if (!selectedMember) {
      return;
    }

    setEditError(null);
    setEditLoading(true);
    const result = await dispatch(
      updateStaff({
        id: selectedMember.id,
        data: editFormData,
      }),
    );
    setEditLoading(false);

    if (result.meta?.requestStatus === "fulfilled") {
      setOpenEdit(false);
      setSelectedMember(null);
      setEditFormData(emptyForm);
      return;
    }

    setEditError(
      typeof result.payload === "string"
        ? result.payload
        : "A aparut o eroare la actualizare. Incearca din nou.",
    );
  };

  const handleDeleteClick = (member) => {
    setSelectedMember(member);
    setOpenDelete(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMember) {
      return;
    }

    setDeleteLoading(true);
    await dispatch(deleteStaff(selectedMember.id));
    setDeleteLoading(false);
    setOpenDelete(false);
    setSelectedMember(null);
  };

  const filtered = staff.filter((member) => {
    const nameMatch = (member.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const positionMatch =
      filterPosition === "all" ||
      String(member.position_id) === String(filterPosition);

    return nameMatch && positionMatch;
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
              <PersonOutlineIcon sx={{ color: "white", fontSize: 18 }} />
            </Box>
            <Typography
              sx={{
                fontSize: "1.4rem",
                fontWeight: 800,
                color: "#1a1a1a",
                letterSpacing: "-0.5px",
              }}
            >
              Echipa
            </Typography>
          </Box>
          <Typography sx={{ fontSize: "0.85rem", color: "#aaa", ml: "52px" }}>
            {staff.length} membri in echipa
          </Typography>
        </Box>

        <Button
          onClick={() => {
            setError(null);
            setFormData(emptyForm);
            setOpenAdd(true);
          }}
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: RED,
            color: "white",
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 700,
            px: 2.5,
            py: 1.2,
            fontSize: "0.88rem",
            width: { xs: "100%", sm: "auto" },
            "&:hover": {
              backgroundColor: RED_DARK,
              boxShadow: "0 4px 16px rgba(169,17,17,0.3)",
            },
          }}
        >
          Adauga membru
        </Button>
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
          placeholder="Cauta dupa nume..."
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
          value={filterPosition}
          onChange={(e) => setFilterPosition(e.target.value)}
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <WorkOutlineIcon sx={{ fontSize: 18, color: "#ccc" }} />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="all">Toate pozitiile</MenuItem>
          {positions.map((position) => (
            <MenuItem key={position.id} value={String(position.id)}>
              {position.title}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {loading || positionsLoading ? (
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
            Niciun membru gasit
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: "#ccc", mt: 0.5 }}>
            Incearca sa schimbi filtrele sau adauga un membru nou
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 1.5, md: 2 },
            alignItems: "stretch",
            width: "100%",
          }}
        >
          {filtered.map((member) => (
            <Box
              key={member.id}
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 8px)",
                  md: "1 1 calc(33.333% - 11px)",
                },
                maxWidth: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                  md: "calc(33.333% - 11px)",
                },
                minWidth: 0,
                display: "flex",
              }}
            >
              <StaffCard
                member={member}
                positionTitle={getPositionTitle(member)}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            </Box>
          ))}
        </Box>
      )}

      <Dialog
        open={openAdd}
        onClose={() => !addLoading && setOpenAdd(false)}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            p: 1,
            width: { xs: "calc(100vw - 24px)", sm: 400 },
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
                backgroundColor: RED_LIGHT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AddIcon sx={{ color: RED, fontSize: 18 }} />
            </Box>
            <Typography fontWeight={800} fontSize="1rem">
              Adauga membru nou
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: "1.2rem !important" }}>
          {error && (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                borderRadius: "10px",
                backgroundColor: "#fff1f2",
                border: "1px solid #fecdd3",
              }}
            >
              <Typography sx={{ fontSize: "0.82rem", color: "#991b1b" }}>
                {error}
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            label="Nume complet"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            sx={{ ...fieldSx, mb: 1.5 }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{ ...fieldSx, mb: 1.5 }}
          />

          <TextField
            fullWidth
            label="Telefon"
            name="phonenumber"
            value={formData.phonenumber}
            onChange={handleChange}
            required
            sx={{ ...fieldSx, mb: 1.5 }}
          />

          <TextField
            select
            fullWidth
            label="Pozitie"
            name="position_id"
            value={formData.position_id}
            onChange={handleChange}
            required
            sx={fieldSx}
          >
            <MenuItem value="" disabled>
              <em style={{ color: "#bbb" }}>Alege pozitia</em>
            </MenuItem>
            {positions.map((position) => (
              <MenuItem key={position.id} value={position.id}>
                {position.title}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => {
              setOpenAdd(false);
              setError(null);
            }}
            disabled={addLoading}
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
            onClick={handleAdd}
            disabled={
              addLoading ||
              !formData.name ||
              !formData.email ||
              !formData.phonenumber ||
              !formData.position_id
            }
            sx={{
              backgroundColor: RED,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              "&:hover": { backgroundColor: RED_DARK },
              "&.Mui-disabled": { backgroundColor: "#f5f5f5", color: "#ccc" },
            }}
          >
            {addLoading ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : (
              "Adauga"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEdit}
        onClose={() => !editLoading && setOpenEdit(false)}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            p: 1,
            width: { xs: "calc(100vw - 24px)", sm: 400 },
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
                backgroundColor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <EditOutlinedIcon sx={{ color: "#555", fontSize: 18 }} />
            </Box>
            <Typography fontWeight={800} fontSize="1rem">
              Editeaza membru
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: "1.2rem !important" }}>
          {editError && (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                borderRadius: "10px",
                backgroundColor: "#fff1f2",
                border: "1px solid #fecdd3",
              }}
            >
              <Typography sx={{ fontSize: "0.82rem", color: "#991b1b" }}>
                {editError}
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            label="Nume complet"
            name="name"
            value={editFormData.name}
            onChange={handleEditChange}
            required
            sx={{ ...fieldSx, mb: 1.5 }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={editFormData.email}
            onChange={handleEditChange}
            required
            sx={{ ...fieldSx, mb: 1.5 }}
          />

          <TextField
            fullWidth
            label="Telefon"
            name="phonenumber"
            value={editFormData.phonenumber}
            onChange={handleEditChange}
            required
            sx={{ ...fieldSx, mb: 1.5 }}
          />

          <TextField
            select
            fullWidth
            label="Pozitie"
            name="position_id"
            value={editFormData.position_id}
            onChange={handleEditChange}
            required
            sx={fieldSx}
          >
            <MenuItem value="" disabled>
              <em style={{ color: "#bbb" }}>Alege pozitia</em>
            </MenuItem>
            {positions.map((position) => (
              <MenuItem key={position.id} value={position.id}>
                {position.title}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => {
              setOpenEdit(false);
              setEditError(null);
            }}
            disabled={editLoading}
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
            onClick={handleEditSave}
            disabled={
              editLoading ||
              !editFormData.name ||
              !editFormData.email ||
              !editFormData.phonenumber ||
              !editFormData.position_id
            }
            sx={{
              backgroundColor: RED,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              "&:hover": { backgroundColor: RED_DARK },
              "&.Mui-disabled": { backgroundColor: "#f5f5f5", color: "#ccc" },
            }}
          >
            {editLoading ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : (
              "Salveaza"
            )}
          </Button>
        </DialogActions>
      </Dialog>

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
            Esti sigur ca vrei sa stergi pe <strong>{selectedMember?.name}</strong>
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
