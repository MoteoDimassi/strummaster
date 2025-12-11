import React from 'react';
import { Helmet } from 'react-helmet-async';
import { HarmonicEarTrainer } from '../features/harmonic-ear-trainer/components/HarmonicEarTrainer';

export const HarmonicEarTrainerPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Harmonic Ear Trainer | StrumMaster</title>
        <meta name="description" content="Train your ear to recognize chord progressions and scale degrees." />
      </Helmet>
      <HarmonicEarTrainer />
    </>
  );
};