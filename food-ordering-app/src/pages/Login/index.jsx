import React from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../app/api/auth';
import { userLogin } from '../../app/features/Auth/action';
import { useNavigate } from 'react-router-dom';  
import { Link } from 'react-router-dom';

const schema = yup.object({
  email: yup.string().email('Email harus valid').required('Email harus diisi'),
  password: yup.string().min(8, 'Password minimal 8 karakter').required('Password harus diisi')
}).required();

const statusList = {
  idle: 'idle',
  process: 'process',
  success: 'success',
  error: 'error'
};

export default function Login() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: yupResolver(schema)
  });
  const [status, setStatus] = React.useState(statusList.idle);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const onSubmit = async formData => {
    setStatus(statusList.process);
    const { data } = await loginUser(formData);
    if (data.error) {
      setError('password', { type: 'invalidCredential', message: data.message });
      setStatus(statusList.error);
    } else {
      const { user, token, role } = data;
      dispatch(userLogin({ user, token, role }));
      navigate('/');  // Mengganti history.push dengan navigate
    }
    setStatus(statusList.success);
  };

  return (
    <Card style={{ width: 'fit-content', margin: '150px auto', padding: '40px' }}>
      <Card.Body>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Login Page</h1>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Alamat Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              isInvalid={errors.email}
              {...register('email')} 
              style={{ marginBottom: '20px', width: '500px' }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              isInvalid={errors.password}
              {...register('password')} 
              style={{ marginBottom: '20px', width: '500px' }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={status === statusList.process} 
            style={{ width: '100%', marginBottom: '20px' }}
          >
            {status === statusList.process ? 'Memprosess...' : 'Login'}
          </Button>
          <p style={{ textAlign: 'center' }}>
            Not a User? <Link to='/register'> Create Account</Link>
          </p>
        </Form>
      </Card.Body>
    </Card>
  );
}
