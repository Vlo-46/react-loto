import {Button, TextField, Typography} from "@mui/material";
import {IFormField} from "../../interfaces/global";

interface IFormDataProps {
    formik: any,
    handleNavigate: (path: string) => void,
    fields: IFormField[],
    navigationData: {
        text: string
        path: string
    },
    page: string
}

export default function Form({formik, handleNavigate, fields, navigationData, page}: IFormDataProps) {
    return (
      <>
          <Typography component="h1" variant="h5" sx={{textAlign: 'center'}}>
              {page}
          </Typography>
          <form onSubmit={formik.handleSubmit}>
              {
                  fields
                    ? fields.map((field: IFormField) => (
                      <TextField
                        key={field.id}
                        fullWidth
                        id={field.id}
                        name={field.name}
                        label={field.label}
                        type={field.type}
                        margin="normal"
                        variant="outlined"
                        value={formik.values[field.id]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched[field.id] && Boolean(formik.errors[field.id])}
                        helperText={formik.touched[field.id] && formik.errors[field.id]}
                      />
                    ))
                    : null
              }
              <Button type="submit" fullWidth variant="contained" color="primary" sx={{mt: 3}}>
                  {page}
              </Button>
              <Typography
                fontSize="sm"
                sx={{textAlign: 'center', cursor: "pointer", mt: 3}}
                onClick={() => handleNavigate(navigationData.path)}
              >
                  {navigationData.text}
              </Typography>
          </form>
      </>
    )
}