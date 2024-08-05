import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function PatientListview() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Gọi API để lấy dữ liệu
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://patientmanagementapi20240803214503.azurewebsites.net/api/patients/nopaged"
        );
        const data = await response.json();

        // Chuyển đổi dữ liệu thành định dạng phù hợp với DataGrid
        const formattedRows = data.map((patient) => ({
          id: patient.id,
          firstName: patient.firstName,
          lastName: patient.lastName,
          dateOfBirth: new Date(patient.dateOfBirth).toLocaleDateString(),
          email: patient.email,
          phone: patient.phone,
          address: `${patient.primaryAddress}, ${patient.primaryProvince}, ${patient.primaryDistrict}, ${patient.primaryWard}`,
          description: patient.description,
          isActive: patient.isActive ? "Active" : "Inactive",
        }));

        // Định nghĩa cột
        const formattedColumns = [
          { field: "firstName", headerName: "First Name", width: 120 },
          { field: "lastName", headerName: "Last Name", width: 120 },
          { field: "dateOfBirth", headerName: "Date of Birth", width: 100 },
          { field: "email", headerName: "Email", width: 150 },
          { field: "phone", headerName: "Phone", width: 100 },
          { field: "address", headerName: "Address", width: 140 },
          { field: "description", headerName: "Description", width: 150 },
          { field: "isActive", headerName: "Status", width: 90 },
        ];

        setRows(formattedRows);
        setColumns(formattedColumns);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddNew = () => {
    navigate(`/patients/${"00000000-0000-0000-0000-000000000000"}`);
  };

  const handleRowClick = (params, event, details) => {
    navigate(`/patients/${params.row.id}`);
  };

  return (
    <Box sx={{ height: "100%", width: "100%", p: 2 }}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Grid item>
          <Typography variant="h5">Patient List</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleAddNew}>
            Add Patient
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ height: 420, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          sx={{
            "& .MuiDataGrid-columnHeader": {
              fontWeight: "bold",
            },
            "& .MuiDataGrid-row:hover": {
              color: "primary.main",
            },
          }}
          onRowClick={handleRowClick}
        />
      </Box>
    </Box>
  );
}
