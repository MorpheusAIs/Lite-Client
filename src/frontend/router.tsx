// libs
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Styled from 'styled-components';

// views
// import HomeView from './views/home';
import UnderConstruction from './views/underConstruction';
import ChatView from './views/chat';

export const RoutesWrapper = () => {
  return (
    <Routes>
      <Route path="/wallet" Component={UnderConstruction} />
      <Route path="/chat" Component={ChatView} />
      <Route path="/models" Component={UnderConstruction} />
      <Route path="/agents" Component={UnderConstruction} />
      <Route path="/provider" Component={UnderConstruction} />
      <Route path="/session" Component={UnderConstruction} />
    </Routes>
  );
};

export const MainRouter = () => {
  return (
    <Router>
      <RoutesWrapper />
    </Router>
  );
};

const Router = Styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;
