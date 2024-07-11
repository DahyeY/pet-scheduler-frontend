// contexts/PetContext.js
import React, { createContext, useState } from 'react';

export const PetContext = createContext();

export const PetProvider = ({ children }) => {
  const [pets, setPets] = useState([]);

  const addPet = (newPet) => {
    setPets([...pets, newPet]);
  };

  const removePet = (id) => {
    setPets(pets.filter(pet => pet.id !== id));
  };

  return (
    <PetContext.Provider value={{ pets, addPet, removePet }}>
      {children}
    </PetContext.Provider>
  );
};
