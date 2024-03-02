import Styled from 'styled-components';

import Logo from './../../assets/images/logo_white.png';
import SidebarMenuNavigationButton from '../buttons/sidebar-menu-navigation-button';
import NetworkSelectionDropdown from '../dropdowns/network-selection-dropdown';
import { useSidebarContext } from '../../contexts';

export default (): JSX.Element => {
  const { isOpen } = useSidebarContext();
  return (
    <Sidebar.Layout isOpen={isOpen}>
      <Sidebar.Top>
        <Sidebar.Logo src={Logo} />
      </Sidebar.Top>
      <Sidebar.Menu>
        <NetworkSelectionDropdown />
        <SidebarMenuNavigationButton text="Wallet" href="/wallet" exact={true} />
        <SidebarMenuNavigationButton text="Chat" href="/chat" exact={true} />
        <SidebarMenuNavigationButton text="Models" href="/models" exact={true} />
        <SidebarMenuNavigationButton text="Agents" href="/agents" exact={true} />
        <Sidebar.SeparatorLine />
        <SidebarMenuNavigationButton text="Provider Hub" href="/provider" exact={true} />
        <SidebarMenuNavigationButton text="Sessions" href="/session" exact={true} />
        <Sidebar.SeparatorLine />
      </Sidebar.Menu>
      <Sidebar.Bottom>MorpheusAI.org</Sidebar.Bottom>
    </Sidebar.Layout>
  );
};

type SidebarLayoutProps = {
  isOpen: boolean;
};

const Sidebar = {
  Layout: Styled.div<SidebarLayoutProps>`
      width: ${(props) => (props.isOpen ? '250px' : '0px')};
      height: 100%;
      background: black;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      transition: 0.2s;
    `,
  Top: Styled.div`
    height: 50px;
    display: flex;
    justify-content: center;
    flex-shrink: 0;
    `,
  Logo: Styled.img`
      height: 50px;
      width: 50px;
    `,
  Menu: Styled.div`
    flex-grow: 1;
    overflow-y: auto;
    `,
  MenuItem: Styled.div`
    display: flex;
    align-items: center;
    `,

  Bottom: Styled.div`
    height: 50px;
    flex-shrink: 0;
    color: ${(props) => props.theme.colors.balance};
    font-family: ${(props) => props.theme.fonts.family.primary.regular};
    font-size: ${(props) => props.theme.fonts.size.small};
    display: flex;
    align-items: center;
    justify-content: center;
    `,
  SeparatorLine: Styled.div`
    height: 1px;
    background:  ${(props) => props.theme.colors.gray};
    `,
};
