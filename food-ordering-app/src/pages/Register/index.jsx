import React from 'react';
import { Form, Button, Col, Card, Alert, Container } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { registerUser } from '../../app/api/auth';
import { useNavigate } from 'react-router-dom'; 

const schema = yup.object({
  full_name: yup.string().required('Nama Lengkap harus diisi'),
  email: yup.string().email('Email harus valid').required('Email harus diisi'),
  password: yup.string().min(8, 'Minimal panjang password harus 8 karakter').required('Password harus diisi'),
  password_confirmation: yup.string().oneOf([yup.ref('password'), null], 'Password konfirmasi tidak sama'),
}).required();

const statusList = {
  idle: 'idle',
  process: 'process',
  success: 'success',
  error: 'error'
};

export default function Register() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: yupResolver(schema)
  });
  const [status, setStatus] = React.useState(statusList.idle);
  const navigate = useNavigate(); 

  const onSubmit = async formData => {
    setStatus(statusList.process);
    const { data } = await registerUser(formData);
    if (data.error) {
      let fields = Object.keys(data.fields);
      fields.forEach(field => setError(field, { type: 'server', message: data.fields[field]?.properties?.message }));
      setStatus(statusList.error);
      return;
    }
    setStatus(statusList.success);
  };

  return (
    <Container style={{ width: 'fit-content', margin: '150px auto', padding: '70px' }}>
      {status === statusList.success ?
        <Alert variant='success'>
          Registrasi berhasil silahkan {' '}
          <Alert.Link onClick={() => navigate('/login')}>Login</Alert.Link> dengan email dan password anda
        </Alert> : null
      }
      <Card>
        <h1 style={{ textAlign: 'center', margin: '30px' }}>Registration</h1>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)} style={{ margin: '0 40px' }}>
            <Form.Group as={Col} controlId="formGridName">
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type="text"
                isInvalid={errors.full_name}
                placeholder="Masukkan nama lengkap"
                {...register('full_name')} 
                style={{ marginBottom: '20px', width: '500px' }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.full_name?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Masukkan email"
                isInvalid={errors.email}
                {...register('email')} 
                style={{ marginBottom: '20px' }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                isInvalid={errors.password}
                {...register('password')} 
                style={{ marginBottom: '20px' }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPasswordConfirmation">
              <Form.Label>Konfirmasi Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Konfirmasi Password"
                isInvalid={errors.password_confirmation}
                {...register('password_confirmation')} 
                style={{ marginBottom: '20px' }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password_confirmation?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              disabled={status === statusList.process} 
              style={{ textAlign: 'center', marginBottom: '30px', marginTop: '15px' }}
            >
              {status === statusList.process ? 'Memproses...' : 'Mendaftar'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
