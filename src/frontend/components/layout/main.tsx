// libs
import React from 'react';
import Styled from 'styled-components';

// layout components
import TopBar from './top-bar';
import BottomBar from './bottom-bar';

// router
import { MainRouter } from '../../router';

import SidebarComponent from './sidebar';
import SidebarToggle from './sidebar-toggle';

export default () => {
  return (
    <Main.Layout>
      <SidebarComponent />
      <SidebarToggle />
      <Main.Content>
        <Main.TopWrapper>
          <TopBar />
        </Main.TopWrapper>
        <Main.MainWrapper>
          <MainRouter />
        </Main.MainWrapper>
        <Main.BottomWrapper>
          <BottomBar />
        </Main.BottomWrapper>
      </Main.Content>
    </Main.Layout>
  );
};

const Main = {
  Layout: Styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.colors.core};
  `,
  Content: Styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
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
