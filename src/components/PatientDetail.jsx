import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
  Chip,
  Modal,
} from "@mui/material";
import axios from "axios";

export function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewPatient = id === "00000000-0000-0000-0000-000000000000";

  const [patient, setPatient] = useState({
    id: "",
    firstName: "",
    lastName: "",
    gender: 0,
    dateOfBirth: "",
    email: "",
    phone: "",
    primaryAddress: "",
    primaryProvince: "",
    primaryDistrict: "",
    primaryWard: "",
    secondaryAddress: "",
    secondaryProvince: "",
    secondaryDistrict: "",
    secondaryWard: "",
    description: "",
    reason: "",
    isActive: true,
  });

  const [reason, setReason] = useState(null);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [loading, setLoading] = useState(false);
  const [loadPage, setLoadPage] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  useEffect(() => {
    if (!isNewPatient) {
      setLoading(true);
      axios
        .get(
          `https://patientmanagementapi20240803214503.azurewebsites.net/api/patients/${id}`
        )
        .then((response) => {
          setPatient(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("There was an error fetching the patient!", error);
        });
    }
  }, [id, isNewPatient, loadPage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({
      ...patient,
      [name]: value,
    });
  };

  const handleChangeReason = (e) => {
    setReason(e.target.value);
  };

  const handleBtnClick = () => {
    if (patient.isActive) {
      handleModalOpen();
    } else {
      handleActive();
    }
  };

  const handleDeactive = (e) => {
    e.preventDefault();
    setLoading(true);
    handleModalClose();
    console.log(reason);

    axios
      .patch(
        `https://patientmanagementapi20240803214503.azurewebsites.net/api/patients/deactivate/${id}`,
        JSON.stringify(reason),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setLoading(false);
        setSnackbarMessage("Patient deactivated successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        setLoadPage(!loadPage);
        console.log("Patient deactivated successfully:", response.data);
      })
      .catch((error) => {
        setLoading(false);
        setSnackbarMessage("There was an error processing your request.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        console.error("There was an error deactivate the patient!", error);
      });
  };

  const handleActive = () => {
    setLoading(true);
    console.log(reason);

    axios
      .patch(
        `https://patientmanagementapi20240803214503.azurewebsites.net/api/patients/activate/${id}`
      )
      .then((response) => {
        setLoading(false);
        setSnackbarMessage("Patient activated successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        setLoadPage(!loadPage);
        console.log("Patient activated successfully:", response.data);
      })
      .catch((error) => {
        setLoading(false);
        setSnackbarMessage("There was an error processing your request.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        console.error("There was an error activate the patient!", error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const patientDto = { ...patient };
    delete patientDto.id;

    console.log("Submitting patient data:", patientDto);
    if (isNewPatient) {
      const dateOfBirthISO = new Date(patient.dateOfBirth).toISOString();
      patientDto.dateOfBirth = dateOfBirthISO;
      axios
        .post(
          "https://patientmanagementapi20240803214503.azurewebsites.net/api/patients",
          patientDto
        )
        .then((response) => {
          console.log("Patient created successfully:", response.data);
          setLoading(false);
          setSnackbarMessage("Patient created successfully!");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
          navigate(`/patients/${response.data.id}`);
        })
        .catch((error) => {
          setLoading(false);
          if (error.response.data === "Duplicate patient found.") {
            setSnackbarMessage("Patient already exists!");
            setSnackbarSeverity("error");
          } else {
            setSnackbarMessage("There was an error processing your request.");
            setSnackbarSeverity("error");
          }
          setOpenSnackbar(true);
          console.error("There was an error creating the patient!", error);
        });
    } else {
      axios
        .put(
          `https://patientmanagementapi20240803214503.azurewebsites.net/api/patients/${id}`,
          patientDto
        )
        .then((response) => {
          setLoading(false);
          setSnackbarMessage("Patient updated successfully!");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
          console.log("Patient updated successfully:", response.data);
        })
        .catch((error) => {
          setLoading(false);
          setSnackbarMessage("There was an error processing your request.");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
          console.error("There was an error updating the patient!", error);
        });
    }
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const formattedDateOfBirth = patient.dateOfBirth
    ? new Date(patient.dateOfBirth).toISOString().split("T")[0]
    : "";
  return (
    <Container component="main" maxWidth="lg">
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // Cover the whole screen
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.8)", // Optional: Background color with opacity
            zIndex: 1200, // Ensure it's above other content
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            component="h1"
            variant="h5"
            gutterBottom
            sx={{ marginRight: 1 }}
          >
            {isNewPatient
              ? "Create Patient"
              : `${patient.firstName} ${patient.lastName}`}
          </Typography>
          {!isNewPatient && (
            <Chip
              label={patient.isActive ? "Active" : "Inactive"}
              color="default"
              sx={{
                marginLeft: 2,
                color: patient.isActive ? "green" : "red",
              }}
            />
          )}
        </Box>
        {!isNewPatient && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              variant="contained"
              color={patient.isActive ? "error" : "primary"}
              onClick={handleBtnClick}
            >
              {patient.isActive ? "Deactivate" : "Activate"}
            </Button>
          </Box>
        )}
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              value={patient.firstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              value={patient.lastName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="gender"
              label="Gender"
              name="gender"
              select
              value={patient.gender}
              onChange={handleChange}
            >
              <MenuItem value={1}>Male</MenuItem>
              <MenuItem value={0}>Female</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="dateOfBirth"
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formattedDateOfBirth}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              value={patient.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="phone"
              label="Phone"
              name="phone"
              value={patient.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              id="description"
              label="Description"
              name="description"
              value={patient.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="primaryAddress"
              label="Primary Address"
              name="primaryAddress"
              value={patient.primaryAddress}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="primaryProvince"
              label="Primary Province"
              name="primaryProvince"
              value={patient.primaryProvince}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="primaryDistrict"
              label="Primary District"
              name="primaryDistrict"
              value={patient.primaryDistrict}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="primaryWard"
              label="Primary Ward"
              name="primaryWard"
              value={patient.primaryWard}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              id="secondaryAddress"
              label="Secondary Address"
              name="secondaryAddress"
              value={patient.secondaryAddress}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              id="secondaryProvince"
              label="Secondary Province"
              name="secondaryProvince"
              value={patient.secondaryProvince}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              id="secondaryDistrict"
              label="Secondary District"
              name="secondaryDistrict"
              value={patient.secondaryDistrict}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              id="secondaryWard"
              label="Secondary Ward"
              name="secondaryWard"
              value={patient.secondaryWard}
              onChange={handleChange}
            />
          </Grid>
          {!patient.isActive && (
            <Grid item xs={12} sm={12}>
              <TextField
                variant="outlined"
                margin="dense"
                fullWidth
                id="reason"
                label="Inactive Reason"
                name="reason"
                value={patient.reason}
                onChange={handleChange}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              {isNewPatient ? "Create" : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Please enter the reason!
          </Typography>
          <form onSubmit={handleDeactive}>
            <TextField
              variant="standard"
              required
              margin="dense"
              fullWidth
              id="reason"
              label="Reason"
              name="reason"
              value={reason}
              onChange={handleChangeReason}
              sx={{ marginBottom: 2 }}
            />
            <Grid container spacing={2} justifyContent="flex-end">
              <Grid item>
                <Button variant="contained" color="primary" type="submit">
                  Ok
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleModalClose}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </Container>
  );
}
