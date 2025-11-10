import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';

test('HomeScreen renders correctly', () => {
  const { getByText } = render(<HomeScreen />);

  // Check if title exists
  const titleElement = getByText('Welcome to Home Screen');
  expect(titleElement).toBeTruthy();

  // Check if subtitle exists
  const subtitleElement = getByText('This is our testing screen');
  expect(subtitleElement).toBeTruthy();
});