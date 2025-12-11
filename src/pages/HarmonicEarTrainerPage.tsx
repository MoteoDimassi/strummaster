import React from 'react';
import { Helmet } from 'react-helmet-async';
import { HarmonicEarTrainer } from '../features/harmonic-ear-trainer/components/HarmonicEarTrainer';

export const HarmonicEarTrainerPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Гармонический Тренажер Слуха | StrumMaster</title>
        <meta name="description" content="Тренируйте свой слух для распознавания гармонических последовательностей и ступеней шкалы." />
      </Helmet>
      <HarmonicEarTrainer />
    </>
  );
};