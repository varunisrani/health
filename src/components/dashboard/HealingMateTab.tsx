import React from 'react';
import { HealingMate } from '@/components/HealingMate';
import { HealingMateProvider } from '@/context/HealingMateContext';

export const HealingMateTab = () => {
  return (
    <HealingMateProvider>
      <HealingMate />
    </HealingMateProvider>
  );
};