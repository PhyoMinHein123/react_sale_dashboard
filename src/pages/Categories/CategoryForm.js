import { useEffect, useState } from 'react';
import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  MenuItem,
  Select,
  Paper
} from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { getRequest, postRequest } from 'services/apiService';
import { useNavigate, useParams } from 'react-router-dom';


const CategoryForm = () => {

  const intialValues = { name: "", description: "", status: "ACTIVE"};
  const [formValues, setFormValues] = useState(intialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageSelected, setImageSelected] = useState(false)
  
  const params  = useParams()
  const navigate = useNavigate()

  const createData = async () => {
    const formData = new FormData()
    const objectArray = Object.entries(formValues);
    objectArray.map(([key, value]) => {
      formData.append(key, value)
    });
    const response = await postRequest("caregory/create", formData);
    if (response.data) {
      navigate('/category/list')
    }
    else {
      console.log("Internal Server Error")
    }
    console.log(formData)
    setIsSubmitting(false)
  };

  const fetchData = async () => {
    const response = await getRequest(`category/${params.Id}`);
    if (response.data) {
      setFormValues(response.data);
    }
  }

  const updateData = async () => {
    const formData = new FormData()
    if(!imageSelected){
      delete formValues.image;
    }
    const objectArray = Object.entries(formValues);
    objectArray.map(([key, value]) => {
      formData.append(key, value)
    });
    const response = await postRequest(`category/update/${params.Id}`, formData);
    if (response.data) {
      setImageSelected(false)
      navigate('/category/list')
    }
    else {
      console.log("Internal Server Error")
    }
    setIsSubmitting(false)
  };

  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setFormErrors(validate(formValues));
  };

//   const handleImageChange = (e) => {
//       const file = e.target.files[0];
//         console.log(file)
//       setFormValues({ ...formValues, image: file });
//       console.log(formValues.image)
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormValues({ ...formValues, imageUrl: reader.result });
//       };
//       if (file) {
//         reader.readAsDataURL(file);
//       }
//   };

  const selectedFile = (e) => {
    setFormValues({...formValues, image: e.target.files[0]})
    setImageSelected(true)
    // const reader = new FileReader();
    // reader.onloadend = () => {
    //   setFormValues({ ...formValues, imageUrl: reader.result });
    // };
    // if (e.target.files[0]) {
    //   reader.readAsDataURL(e.target.files[0]);
    // }
  }

  const validate = (values) => {
    let errors = {};
    if (!values.name) {
      setIsSubmitting(false);
      errors.name = "Cannot be blank";
    } 
    if (!values.description) {
      setIsSubmitting(false);
      errors.price = "Cannot be blank";
    }
    if (!values.status) {
      setIsSubmitting(false);
      errors.status = 'Please select a status';
    }
    return errors;
  };  

    useEffect(() => {
      if (Object.keys(formErrors).length === 0 && isSubmitting) {
        if ( params.Id > 0 ) {
          updateData();
        } else {
          createData();
        }
      }
    }, [formErrors]);

    useEffect(()=>{
      if( params.Id > 0 ){
        fetchData()
      }
    },[params])


  return (
    <>
      <Paper elevation={3} style={{ padding: 20 }}>
           <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="table-name">Name*</InputLabel>
                  <OutlinedInput
                    id="table-name"
                    type="text"
                    value={formValues.name}
                    onChange={handleChange}
                    name="name"
                    placeholder="TU-1"
                  />
                  {formErrors.name && (
                    <FormHelperText error id="helper-text-table-name">
                      {formErrors.name}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="table-description">Description*</InputLabel>
                  <OutlinedInput
                    id="table-description"
                    type="text"
                    value={formValues.description}
                    onChange={handleChange}
                    name="description"
                    placeholder="TU-1"
                  />
                  {formErrors.description && (
                    <FormHelperText error id="helper-text-table-description">
                      {formErrors.description}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="status">Status</InputLabel>
                  <Select
                    label="Status"
                    id="status"
                    value={formValues.status}
                    onChange={handleChange}
                    name="status"
                  >
                    <MenuItem value="ACTIVE">Active</MenuItem>
                    <MenuItem value="DISABLE">Disable</MenuItem>
                  </Select>
                  {formErrors.status && (
                    <FormHelperText error id="helper-text-status">
                      {formErrors.status}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    {params.Id > 0 ? "Update Table":"Create Table"}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        </Paper>
    </>
  );
};

export default DrinkForm;
