import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import CameraswitchOutlinedIcon from "@mui/icons-material/CameraswitchOutlined";
import { useEffect, useRef, useState } from "react";

function stopStream(stream) {
  if (!stream) {
    return;
  }

  stream.getTracks().forEach((track) => track.stop());
}

export default function CameraCaptureDialog({ open, onClose, onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");

  useEffect(() => {
    if (!open) {
      stopStream(stream);
      setStream(null);
      setError("");
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError("");

    async function startCamera() {
      try {
        stopStream(stream);

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (!active) {
          stopStream(mediaStream);
          return;
        }

        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (cameraError) {
        setError(
          "Camera nu a putut fi pornita. Verifica permisiunile browserului sau daca exista o webcam disponibila.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    startCamera();

    return () => {
      active = false;
      stopStream(stream);
    };
  }, [open, facingMode]);

  const handleClose = () => {
    stopStream(stream);
    setStream(null);
    onClose();
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return;
        }

        const file = new File([blob], `animal-camera-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        onCapture(file);
        handleClose();
      },
      "image/jpeg",
      0.92,
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: "20px",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800 }}>Captureaza poza</DialogTitle>
      <DialogContent>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}

        <Box
          sx={{
            borderRadius: "16px",
            overflow: "hidden",
            backgroundColor: "#0f0f0f",
            minHeight: 360,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {loading && (
            <Typography sx={{ color: "white", fontWeight: 700 }}>
              Pornim camera...
            </Typography>
          )}

          <Box
            component="video"
            ref={videoRef}
            autoPlay
            playsInline
            muted
            sx={{
              width: "100%",
              display: loading ? "none" : "block",
            }}
          />
        </Box>

        <Typography sx={{ mt: 1.5, color: "#8a8a8a", fontSize: "0.86rem" }}>
          Pe laptop se foloseste webcam-ul direct din browser. Daca ai mai multe camere,
          poti incerca schimbarea perspectivei.
        </Typography>

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={() =>
            setFacingMode((current) =>
              current === "environment" ? "user" : "environment",
            )
          }
          startIcon={<CameraswitchOutlinedIcon />}
          sx={{ textTransform: "none", fontWeight: 700 }}
        >
          Schimba camera
        </Button>
        <Button onClick={handleClose} sx={{ textTransform: "none", fontWeight: 700 }}>
          Inchide
        </Button>
        <Button
          variant="contained"
          onClick={handleCapture}
          disabled={loading || !stream}
          startIcon={<PhotoCameraOutlinedIcon />}
          sx={{
            backgroundColor: "#a91111",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "10px",
            "&:hover": { backgroundColor: "#8a0d0d" },
          }}
        >
          Fa captura
        </Button>
      </DialogActions>
    </Dialog>
  );
}
