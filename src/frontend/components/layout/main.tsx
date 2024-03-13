// libs
import React from 'react';
import Styled from 'styled-components';

// layout components
import TopBar from './top-bar';
import BottomBar from './bottom-bar';

// router
import { MainRouter } from '../../router';

export default () => {
  return (
    <Main.Layout>
      <Main.TopWrapper>
        <TopBar />
      </Main.TopWrapper>
      <Main.MainWrapper>
        <MainRouter />
      </Main.MainWrapper>
      <Main.BottomWrapper>
        <BottomBar />
      </Main.BottomWrapper>
    </Main.Layout>
  );
};

const Main = {
  Layout: Styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.colors.core};
  `,
  TopWrapper: Styled.div`
    display: flex;
    width: 100%;
    height: ${(props) => props.theme.layout.topBarHeight}px;
    flex-shrink: 0;
  `,
  MainWrapper: Styled.div`
    display: flex;
    width: 80%;
    max-width: 850px;
    flex-grow: 1;
    border-radius: 30px;
    border: 5px solid ${(props) => props.theme.colors.hunter};
    padding: 10px;
    overflow: hidden;
  `,
  BottomWrapper: Styled.div`
    display: flex;
    width: 100%;
    height:  ${(props) => props.theme.layout.bottomBarHeight}px;
    flex-shrink: 0;
  `,
};
