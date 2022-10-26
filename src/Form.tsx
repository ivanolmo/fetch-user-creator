import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HashLoader } from 'react-spinners';

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
        setError(true);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

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
      console.log('success');
    } else {
      console.log('error');
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <>
        <div className='loader'>
          <HashLoader color='#f8a619' />
        </div>
        <p className='loader__text'>Loading...</p>
      </>
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
            <span className='label__field--error'>This field is required</span>
          )}
        </div>
        <input
          {...register('name', { required: true })}
          type='text'
          className={errors.name && 'input__error'}
        />
      </div>

      {/* Email */}
      <div>
        <div className='label__field'>
          <label htmlFor='email'>Email</label>
          {errors.email && (
            <span className='label__field--error'>This field is required</span>
          )}
        </div>
        <input
          {...register('email', { required: true })}
          type='email'
          className={errors.email && 'input__error'}
        />
      </div>

      {/* Password */}
      <div>
        <div className='label__field'>
          <label htmlFor='password'>Password</label>
          {errors.password && (
            <span className='label__field--error'>This field is required</span>
          )}
        </div>
        <input
          {...register('password', { required: true })}
          type='password'
          className={errors.password && 'input__error'}
        />
      </div>

      {/* Occupation */}
      <div>
        <div className='label__field'>
          <label htmlFor='occupation'>Occupation</label>
          {errors.occupation && (
            <span className='label__field--error'>This field is required</span>
          )}
        </div>
        <select
          {...register('occupation', { required: true })}
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
            <span className='label__field--error'>This field is required</span>
          )}
        </div>
        <select
          {...register('state', { required: true })}
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

      <button type='submit' disabled={isSubmitting}>
        Create User
      </button>
    </form>
  );
};

export default Form;
