import {MouseEvent, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {Box, Container, CssBaseline, Alert} from '@mui/material'
import Form from "../components/form/Form";
import {IFormField} from "../interfaces/global";
import axios from "axios";
import {isAuth} from "../helpers/isAuth";

interface IFormData {
    name: string,
    lastName: string,
    email: string
    password: string
}

export default function Register() {
    const [authError, setAuthError] = useState<boolean>(false)
    const navigate = useNavigate()

    const isAuthenticated = isAuth()
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated, navigate]);

    const formik = useFormik({
        initialValues: {
            name: '',
            lastName: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            lastName: Yup.string().required('Last name is required'),
            email: Yup.string().email('Invalid email').required('Invalid email'),
            password: Yup.string()
              .min(5, 'Too Short!')
              .max(15, 'Too Long!')
              .required('Invalid password'),
        }),
        onSubmit: (values: IFormData) => {
            handleOnSubmit(values)
        },
    });

    const fields: IFormField[] = [
        {
            id: 'name',
            name: 'name',
            label: 'Name',
            type: 'text'
        },
        {
            id: 'lastName',
            name: 'lastName',
            label: 'Last Name',
            type: 'text'
        },
        {
            id: 'email',
            name: 'email',
            label: 'Email',
            type: 'type'
        },
        {
            id: 'password',
            name: 'password',
            label: 'Password',
            type: 'password'
        },
    ]
    const navigationData = {
        text: 'Already have an account?',
        path: '/login'
    }

    const handleNavigate = (path: string) => (event: MouseEvent<HTMLElement>) => {
        navigate(path)
    }

    const errorHandler = () => {
        setAuthError(true)
        setTimeout(() => {
            setAuthError(false)
        }, 3000)
    }

    const handleOnSubmit = (values: IFormData) => {
        try {
            axios.post(`${process.env.REACT_APP_SERVER_API_URI}/auth/register`, values)
              .then(res => {
                  if (res.data.error) {
                      errorHandler()
                  } else {
                      navigate('/login')
                  }
              })
              .catch(e => {
                  errorHandler()
              })
        } catch (e) {
            errorHandler()
        }
    }

    return (
      <>
          <Box
            sx={{
                width: 700,
                mx: 'auto',
                my: 4,
                py: 3,
                px: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRadius: 5,
                boxShadow: 'md',
                border: '1px solid #ccc',
            }}
          >
              <Container component="main" maxWidth="xs">
                  <CssBaseline/>
                  {
                      authError
                        ? <Alert severity="error">Something went wrong</Alert>
                        : null
                  }
                  <Form formik={formik}
                        handleNavigate={handleNavigate}
                        fields={fields}
                        navigationData={navigationData}
                        page={'Register'}
                  />
              </Container>
          </Box>
      </>
    )
}