import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HashLoader } from 'react-spinners';
import toast from 'react-hot-toast';

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
  const [error, setError] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      occupation: '',
      state: '',
    },
    mode: 'onChange',
  });

  // email regex
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  // form submit handler
  const onSubmit = async (data: FormData) => {
    setLoading(true);

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

    if (response.ok) {
      toast.success('User created successfully!');
    } else {
      toast.error('User creation failed!');
    }

    setLoading(false);
  };

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
        setError(true);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // reset form on successful submit
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  if (loading) {
    return (
      <div className='loader__container'>
        <div className='loader'>
          <HashLoader color='#f8a619' />
        </div>
        <p className='loader__text'>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='error__block'>
        <p>
          There was an error fetching the data, please refresh the page and try
          again!
        </p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Name */}
      <div>
        <div className='label__field'>
          <label htmlFor='name'>Name</label>
          {errors.name && (
            <span className='label__field--error'>{errors.name.message}</span>
          )}
        </div>
        <input
          {...register('name', {
            required: { value: true, message: 'Please enter your name' },
            minLength: {
              value: 4,
              message: 'Must be at least 4 characters',
            },
          })}
          type='text'
          className={errors.name && 'input__error'}
        />
      </div>

      {/* Email */}
      <div>
        <div className='label__field'>
          <label htmlFor='email'>Email</label>
          {errors.email && (
            <span className='label__field--error'>
              Please enter a valid email address
            </span>
          )}
        </div>
        <input
          {...register('email', {
            required: {
              value: true,
              message: 'Please enter a valid email address',
            },
            pattern: {
              value: emailPattern,
              message: 'Please enter a valid email address',
            },
          })}
          type='email'
          className={errors.email && 'input__error'}
        />
      </div>

      {/* Password */}
      <div>
        <div className='label__field'>
          <label htmlFor='password'>Password</label>
          {errors.password && (
            <span className='label__field--error'>
              {errors.password.message}
            </span>
          )}
        </div>
        <input
          {...register('password', {
            required: { value: true, message: 'Please enter a password' },
            minLength: { value: 6, message: 'Must be at least 6 characters' },
          })}
          type='password'
          className={errors.password && 'input__error'}
        />
      </div>

      {/* Occupation */}
      <div>
        <div className='label__field'>
          <label htmlFor='occupation'>Occupation</label>
          {errors.occupation && (
            <span className='label__field--error'>
              {errors.occupation.message}
            </span>
          )}
        </div>
        <select
          {...register('occupation', {
            required: { value: true, message: 'Please choose your occupation' },
          })}
          className={errors.occupation && 'input__error'}
        >
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
        <div className='label__field'>
          <label htmlFor='state'>State</label>
          {errors.state && (
            <span className='label__field--error'>{errors.state.message}</span>
          )}
        </div>
        <select
          {...register('state', {
            required: { value: true, message: 'Please choose your state' },
          })}
          className={errors.state && 'input__error'}
        >
          <option value=''>Select a state</option>
          {data.states?.map((state) => (
            <option key={state.abbreviation} value={state.abbreviation}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <button type='submit' disabled={isSubmitting}>
          Create User
        </button>
      </div>
    </form>
  );
};

export default Form;
