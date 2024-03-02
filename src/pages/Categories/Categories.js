import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { Paper, Box, Chip, Grid, Button } from '../../../node_modules/@mui/material/index';
import { getRequest } from 'services/apiService';
import SearchComponents from 'components/SearchComponent';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';
import SkeletonComponent from 'components/SkeletonComponent';

export default function Category() {

  const [data, setData] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  const navigate = useNavigate()

  const columns = [
    { field: 'id', headerName: 'ID', width: 60, editable: false },
    { field: 'name', headerName: 'Name', width: 150, editable: false },
    { field: 'description', headerName: 'Description', width: 150, editable: false },
    { field: 'status', headerName: 'Status', width: 200, editable: false, type: 'singleSelect', renderCell: (params) => (
      params.row.status === 'active' ? (
        <Chip label="active" color="success" />
      ) : (
        <Chip label="deactive" color="error" />
      )
    )},
    { field: 'created_at', headerName: 'Created Date', type: 'date', width: 160, editable: false, valueGetter: (params) => new Date(params.row.created_at)},
    { field: 'actions', type: 'actions', headerName: 'Actions', width: 100, cellClassName: 'actions',
      getActions: (params) => {
        const index = [1,2]
        return [
          <GridActionsCellItem
            key={index}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={()=>{navigate(`/categories/update/${params.id}`)}}
            color="inherit"
          />
        ];
      },
    },
  ];
  
  const fetchData = async () => {
    setLoading(true)
    const response = await getRequest("category");
    if (response.data) {
        setData(response.data.results);
    }
    setLoading(false)
  }

  React.useEffect(()=>{
    fetchData()
  },[])

  return (
  <>
    <Grid container>
      <Grid item xs={6} >
        <Button onClick={()=>{navigate('/categories/create');}}>
          <AddIcon/> category
        </Button>
      </Grid>
      <Grid item xs={6} sx={{ display:"flex",justifyContent:"flex-end" }}>
        <SearchComponents fetchFun={(data)=>{fetchWithParams(data)}}/>
      </Grid>
    </Grid>
    <Box
      component={Paper}
      sx={{
        height: 630,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      {loading ? (
        <SkeletonComponent />
      ):(
      <DataGrid
        rows={data}
        columns={columns}
        pageSizeOptions={[2]}
      />
      )}
    </Box>
  </>
  );
}