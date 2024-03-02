import Styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

interface ButtonProps {
  active: 'active' | '';
}

interface MainNavButtonProps {
  text: string;
  href: string;
  exact: boolean;
}

const SidebarMenuNavigationButton = ({ text, href, exact }: MainNavButtonProps) => {
  const path = useLocation();
  const active = exact ? path.pathname === href : path.pathname.includes(href);

  return (
    <MenuNavItem.Wrapper to={href} active={active ? 'active' : ''}>
      <MenuNavItem.ButtonText>{text}</MenuNavItem.ButtonText>
    </MenuNavItem.Wrapper>
  );
};

const MenuNavItem = {
  Wrapper: Styled(Link)<ButtonProps>`
        display: flex;
        flex-direction: column;
        padding: 24px 0 24px 12px;
        color: ${(props) => (props.active === 'active' ? props.theme.colors.black : props.theme.colors.balance)};
        text-decoration: none;
        background-color: ${(props) => props.active && props.theme.colors.balance};
        &:hover span {
          color: ${(props) => !props.active && props.theme.colors.gray};
        }
      `,
  Icon: Styled.img`
        display: flex;
        width: 30px;
        height: 30px;
      `,
  ButtonText: Styled.span`
        font-family: ${(props) => props.theme.fonts.family.primary.regular};
        font-size: ${(props) => props.theme.fonts.size.medium};
      `,
};

export default SidebarMenuNavigationButton;
