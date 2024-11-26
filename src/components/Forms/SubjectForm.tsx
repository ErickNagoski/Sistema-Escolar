import React from 'react';
import { useForm } from 'react-hook-form';

const TesteForm = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('nome')} placeholder="Nome" />
      <button type="submit">Enviar</button>
    </form>
  );
};

export default TesteForm;
