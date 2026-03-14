import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Avatar,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllAdoptionRequests,
  updateAdoptionRequestStatus,
} from "../../../features/adoptionRequests/adoptionRequestsSlice";

const RED = "#a91111";
const RED_LIGHT = "#fff0f0";

const statusConfig = {
  Pending: {
    label: "În așteptare",
    color: "#b45309",
    bg: "#fffbeb",
    border: "#fde68a",
    icon: <AccessTimeIcon sx={{ fontSize: 13 }} />,
  },
  Approved: {
    label: "Aprobat",
    color: "#166534",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    icon: <CheckCircleOutlineIcon sx={{ fontSize: 13 }} />,
  },
  Rejected: {
    label: "Respins",
    color: "#991b1b",
    bg: "#fff1f2",
    border: "#fecdd3",
    icon: <CancelOutlinedIcon sx={{ fontSize: 13 }} />,
  },
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "white",
    fontSize: "0.88rem",
    "& fieldset": { borderColor: "#ebebeb" },
    "&:hover fieldset": { borderColor: "#ccc" },
    "&.Mui-focused fieldset": { borderColor: RED, borderWidth: "1.5px" },
  },
  "& .MuiInputBase-input": { py: "10px", px: "14px" },
};

function RequestCard({ request, onAction }) {
  const animal = request.Animal;
  const user = request.User;
  const cfg = statusConfig[request.status] || statusConfig.Pending;

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: "16px",
        border: "1.5px solid #f0f0f0",
        overflow: "hidden",
        transition: "box-shadow 0.2s, transform 0.2s",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ position: "relative", height: 140 }}>
        {animal?.image_url ? (
          <Box
            component="img"
            src={animal.image_url}
            alt={animal.name}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PetsIcon sx={{ fontSize: 40, color: "#ddd" }} />
          </Box>
        )}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            px: 1.2,
            py: 0.4,
            borderRadius: "20px",
            backgroundColor: cfg.bg,
            border: `1px solid ${cfg.border}`,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Box sx={{ color: cfg.color, display: "flex" }}>{cfg.icon}</Box>
          <Typography
            sx={{ fontSize: "0.7rem", fontWeight: 700, color: cfg.color }}
          >
            {cfg.label}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography
          sx={{ fontWeight: 800, fontSize: "1rem", color: "#1a1a1a", mb: 0.5 }}
        >
          {animal?.name || "—"}
        </Typography>
        <Typography sx={{ fontSize: "0.75rem", color: "#aaa", mb: 1.5 }}>
          {animal?.breed || "Rasă necunoscută"}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1.2,
            borderRadius: "10px",
            backgroundColor: "#fafafa",
            border: "1px solid #f0f0f0",
            mb: 1.5,
          }}
        >
          <Avatar
            sx={{
              width: 30,
              height: 30,
              backgroundColor: RED_LIGHT,
              color: RED,
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            {user?.username?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#333",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.username || "—"}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.7rem",
                color: "#aaa",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.email || "—"}
            </Typography>
          </Box>
        </Box>

        {user?.phonenumber && (
          <Typography sx={{ fontSize: "0.75rem", color: "#888", mb: 1.5 }}>
            📞 {user.phonenumber}
          </Typography>
        )}

        <Typography sx={{ fontSize: "0.72rem", color: "#bbb", mb: 1.5 }}>
          {new Date(request.createdAt).toLocaleDateString("ro-RO", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </Typography>

        {request.status === "Pending" && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              fullWidth
              onClick={() => onAction(request, "Approved")}
              sx={{
                backgroundColor: "#f0fdf4",
                color: "#166534",
                border: "1.5px solid #bbf7d0",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.78rem",
                py: 0.8,
                "&:hover": {
                  backgroundColor: "#dcfce7",
                  border: "1.5px solid #86efac",
                },
              }}
            >
              ✓ Aprobă
            </Button>
            <Button
              fullWidth
              onClick={() => onAction(request, "Rejected")}
              sx={{
                backgroundColor: "#fff1f2",
                color: "#991b1b",
                border: "1.5px solid #fecdd3",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.78rem",
                py: 0.8,
                "&:hover": {
                  backgroundColor: "#ffe4e6",
                  border: "1.5px solid #fda4af",
                },
              }}
            >
              ✕ Respinge
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default function AdoptionRequestsPage() {
  const dispatch = useDispatch();
  const { requests, loading } = useSelector((s) => s.adoptionRequests);

  const [searchAnimal, setSearchAnimal] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    request: null,
    action: null,
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllAdoptionRequests());
  }, [dispatch]);

  const filtered = requests.filter((r) => {
    const animalMatch = r.Animal?.name
      ?.toLowerCase()
      .includes(searchAnimal.toLowerCase());
    const userMatch = r.User?.username
      ?.toLowerCase()
      .includes(searchUser.toLowerCase());
    const statusMatch = filterStatus === "all" || r.status === filterStatus;
    return animalMatch && userMatch && statusMatch;
  });

  const handleAction = (request, action) =>
    setConfirmDialog({ open: true, request, action });

  const handleConfirm = async () => {
    setActionLoading(true);
    await dispatch(
      updateAdoptionRequestStatus({
        id: confirmDialog.request.id,
        status: confirmDialog.action,
      }),
    );
    setActionLoading(false);
    setConfirmDialog({ open: false, request: null, action: null });
  };

  const counts = {
    all: requests.length,
    Pending: requests.filter((r) => r.status === "Pending").length,
    Approved: requests.filter((r) => r.status === "Approved").length,
    Rejected: requests.filter((r) => r.status === "Rejected").length,
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: 1200,
        mx: "auto",
        pb: { xs: 8, md: 4 },
      }}
    >
      <Box sx={{ mb: 4 }}>
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
            <PetsIcon sx={{ color: "white", fontSize: 18 }} />
          </Box>
          <Typography
            sx={{
              fontSize: "1.4rem",
              fontWeight: 800,
              color: "#1a1a1a",
              letterSpacing: "-0.5px",
            }}
          >
            Cereri de adopție
          </Typography>
        </Box>
        <Typography sx={{ fontSize: "0.85rem", color: "#aaa", ml: "52px" }}>
          Gestionează și procesează cererile de adopție
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
        {[
          { key: "all", label: "Toate" },
          { key: "Pending", label: "În așteptare" },
          { key: "Approved", label: "Aprobate" },
          { key: "Rejected", label: "Respinse" },
        ].map(({ key, label }) => (
          <Box
            key={key}
            onClick={() => setFilterStatus(key)}
            sx={{
              px: 2,
              py: 0.8,
              borderRadius: "10px",
              cursor: "pointer",
              border: "1.5px solid",
              borderColor: filterStatus === key ? RED : "#ebebeb",
              backgroundColor: filterStatus === key ? RED_LIGHT : "white",
              display: "flex",
              alignItems: "center",
              gap: 1,
              transition: "all 0.15s",
              "&:hover": { borderColor: filterStatus === key ? RED : "#ccc" },
            }}
          >
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 700,
                color: filterStatus === key ? RED : "#888",
              }}
            >
              {label}
            </Typography>
            <Box
              sx={{
                px: 0.8,
                py: 0.1,
                borderRadius: "6px",
                backgroundColor: filterStatus === key ? RED : "#f0f0f0",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  color: filterStatus === key ? "white" : "#999",
                }}
              >
                {counts[key]}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 1.5,
          mb: 3,
        }}
      >
        <TextField
          placeholder="Caută după animal..."
          value={searchAnimal}
          onChange={(e) => setSearchAnimal(e.target.value)}
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PetsIcon sx={{ fontSize: 18, color: "#ccc" }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          placeholder="Caută după utilizator..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineIcon sx={{ fontSize: 18, color: "#ccc" }} />
              </InputAdornment>
            ),
          }}
        />
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
          <Typography sx={{ fontSize: "2rem", mb: 1 }}>🐾</Typography>
          <Typography
            sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#bbb" }}
          >
            Nu există cereri
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: "#ccc", mt: 0.5 }}>
            Nicio cerere nu corespunde filtrelor selectate
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
            gap: 2,
          }}
        >
          {filtered.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onAction={handleAction}
            />
          ))}
        </Box>
      )}

      <Dialog
        open={confirmDialog.open}
        onClose={() =>
          !actionLoading &&
          setConfirmDialog({ open: false, request: null, action: null })
        }
        PaperProps={{ sx: { borderRadius: "20px", p: 1, minWidth: 340 } }}
      >
        <DialogTitle sx={{ pb: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                backgroundColor:
                  confirmDialog.action === "Approved" ? "#f0fdf4" : "#fff1f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {confirmDialog.action === "Approved" ? (
                <CheckCircleOutlineIcon
                  sx={{ color: "#166534", fontSize: 18 }}
                />
              ) : (
                <CancelOutlinedIcon sx={{ color: "#991b1b", fontSize: 18 }} />
              )}
            </Box>
            <Typography fontWeight={800} fontSize="1rem">
              {confirmDialog.action === "Approved"
                ? "Confirmă aprobarea"
                : "Confirmă respingerea"}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: "1rem !important" }}>
          <Typography fontSize="0.9rem" color="#555">
            {confirmDialog.action === "Approved" ? (
              <>
                Ești sigur că vrei să aprobi cererea lui{" "}
                <strong>{confirmDialog.request?.User?.username}</strong> pentru{" "}
                <strong>{confirmDialog.request?.Animal?.name}</strong>?
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    mt: 1,
                    fontSize: "0.82rem",
                    color: "#999",
                  }}
                >
                  Toate celelalte cereri pentru acest animal vor fi respinse
                  automat.
                </Box>
              </>
            ) : (
              <>
                Ești sigur că vrei să respingi cererea lui{" "}
                <strong>{confirmDialog.request?.User?.username}</strong> pentru{" "}
                <strong>{confirmDialog.request?.Animal?.name}</strong>?
              </>
            )}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() =>
              setConfirmDialog({ open: false, request: null, action: null })
            }
            disabled={actionLoading}
            sx={{
              color: "#999",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
            }}
          >
            Anulează
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={actionLoading}
            sx={{
              backgroundColor:
                confirmDialog.action === "Approved" ? "#166534" : "#991b1b",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              "&:hover": {
                backgroundColor:
                  confirmDialog.action === "Approved" ? "#14532d" : "#7f1d1d",
              },
            }}
          >
            {actionLoading ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : confirmDialog.action === "Approved" ? (
              "Aprobă"
            ) : (
              "Respinge"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
