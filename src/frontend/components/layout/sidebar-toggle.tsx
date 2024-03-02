// libs
import React from 'react';
import Styled from 'styled-components';
import { useSidebarContext } from '../../contexts';

export default () => {
  const { isOpen, setIsOpen } = useSidebarContext();
  return (
    <SidebarToggle.Layout>
      <SidebarToggle.Carat
        onClick={() => {
          setIsOpen((isOpen) => !isOpen);
        }}
        isOpen={isOpen}
      />
    </SidebarToggle.Layout>
  );
};

type SidebarToggleCarat = {
  isOpen: boolean;
};

const SidebarToggle = {
  Layout: Styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 100%;
    background: ${(props) => props.theme.colors.core};
    padding-left: 8px;
  `,
  Carat: Styled.div<SidebarToggleCarat>`
    display: inline-block;
    width: 20px; 
    height: 20px;
    border-top: 2px solid ${(props) => props.theme.colors.emerald};
    border-left: 2px solid ${(props) => props.theme.colors.emerald};
    transform: rotate(${(props) => (props.isOpen ? '-45deg' : '135deg')});
    &:hover {
        cursor: pointer;
        opacity: 0.8;
    }
  `,
};
