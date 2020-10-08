import React, { useEffect, useState } from 'react';
import Header from './Header';

// @ts-ignore
export default ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  )
}