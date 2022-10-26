import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import './Form.css';

// interfaces for expected data fetched from endpoint
interface Data {
  occupations: string[];
  states: State[];
}

interface State {
  name: string;
  abbreviation: string;
}

// interface for form data
interface FormData {
  name: string;
  email: string;
  password: string;
  occupation: string;
  state: string;
}

const Form = () => {
  const [data, setData] = useState<Data>({} as Data);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: 'onChange',
  });

  // fetch occupation and state data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetch(
        'https://frontend-take-home.fetchrewards.com/form'
      );
      const data = await response.json();

      if (response.ok) {
        setData(data);
      } else {
        setData({} as Data);
        setError('There was an error fetching the data');
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const onSubmit = async (data: FormData) => {
    // submit to post endpoint
    const response = await fetch(
      'https://frontend-take-home.fetchrewards.com/form',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Name */}
      <div>
        <div className='labelField'>
          <label htmlFor='name'>Name</label>
          {errors.name && (
            <span className='errorField'>This field is required</span>
          )}
        </div>
        <input {...register('name', { required: true })} type='text' />
      </div>

      {/* Email */}
      <div>
        <div className='labelField'>
          <label htmlFor='email'>Email</label>
          {errors.email && (
            <span className='errorField'>This field is required</span>
          )}
        </div>
        <input {...register('email', { required: true })} type='email' />
      </div>

      {/* Password */}
      <div>
        <div className='labelField'>
          <label htmlFor='password'>Password</label>
          {errors.password && (
            <span className='errorField'>This field is required</span>
          )}
        </div>
        <input {...register('password', { required: true })} type='password' />
      </div>

      {/* Occupation */}
      <div>
        <div className='labelField'>
          <label htmlFor='occupation'>Occupation</label>
          {errors.occupation && (
            <span className='errorField'>This field is required</span>
          )}
        </div>
        <select {...register('occupation', { required: true })}>
          <option value=''>Select an occupation</option>
          {data.occupations?.map((occupation) => (
            <option key={occupation} value={occupation}>
              {occupation}
            </option>
          ))}
        </select>
      </div>

      {/* State */}
      <div>
        <div className='labelField'>
          <label htmlFor='state'>State</label>
          {errors.state && (
            <span className='errorField'>This field is required</span>
          )}
        </div>
        <select {...register('state', { required: true })}>
          <option value=''>Select a state</option>
          {data.states?.map((state) => (
            <option key={state.abbreviation} value={state.abbreviation}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      <button type='submit' disabled={isSubmitting}>
        Create User
      </button>
    </form>
  );
};

export default Form;
