import React, { FormEvent, useState } from 'react';
import Styled from 'styled-components';
import RoundButton from '../components/buttons/round-button';

interface Address {
  name: string;
  address: string;
}

const AddressesView = (): JSX.Element => {
  const [addresses, setAccounts] = useState<Address[]>([]);
  const [nameValue, setNameValue] = useState('');
  const [addressValue, setAddressValue] = useState('');

  const handleNameInputChange = (e: FormEvent<HTMLInputElement>) => {
    setNameValue(e.currentTarget.value);
  };

  const handleAddressInputChange = (e: FormEvent<HTMLInputElement>) => {
    setAddressValue(e.currentTarget.value);
  };

  const handleAddAccount = () => {
    const newAddress = { name: nameValue.trim(), address: addressValue.trim() };
    setAccounts([...addresses, newAddress]);

    setNameValue('');
    setAddressValue('');
  };

  const handleRemoveAccount = (indexToRemove: number) => {
    setAccounts(addresses.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Addresses.Layout>
      <Addresses.Main>
        {addresses.map((address, index) => (
          <Addresses.Row key={index}>
            <Addresses.Label>{address.name}</Addresses.Label>
            <Addresses.Value>{address.address}</Addresses.Value>
            <Addresses.Remove onClick={() => handleRemoveAccount(index)}> - </Addresses.Remove>
          </Addresses.Row>
        ))}
      </Addresses.Main>
      <Addresses.Bottom>
        <Addresses.InputWrapper>
          <Addresses.NameInputWrapper>
            <Addresses.Input
              placeholder={'Name'}
              value={nameValue}
              onChange={handleNameInputChange}
            />
          </Addresses.NameInputWrapper>
          <Addresses.Input
            placeholder={'Address'}
            value={addressValue}
            onChange={handleAddressInputChange}
          />

          <RoundButton value={'add'} inProgress={false} onClick={handleAddAccount} />
        </Addresses.InputWrapper>
      </Addresses.Bottom>
    </Addresses.Layout>
  );
};

const Addresses = {
  Layout: Styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.colors.core};
  `,
  Title: Styled.h2`
    display: flex;
    font-family: ${(props) => props.theme.fonts.family.primary.bold};
    font-size: ${(props) => props.theme.fonts.size.medium};
    color: ${(props) => props.theme.colors.notice};
  `,
  Row: Styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  Label: Styled.label`
    display: flex;
    font-family: ${(props) => props.theme.fonts.family.primary.regular};
    font-size: ${(props) => props.theme.fonts.size.small};
    color: ${(props) => props.theme.colors.balance};
  `,
  Value: Styled.span`
    display: flex;
    padding: 10px;
    font-family: ${(props) => props.theme.fonts.family.secondary.bold};
    font-size: ${(props) => props.theme.fonts.size.small};
    color: ${(props) => props.theme.colors.notice};
  `,
  NameInputWrapper: Styled.div`
  display: flex;
  width: 60%;
  height: 40px;
  position: relative;
  align-items: center;
  `,
  InputWrapper: Styled.div`
  display: flex;
  width: 90%;
  height: 40px;
  position: relative;
  align-items: center;
  `,
  Input: Styled.input`
  display: flex;
  width: 100%;
  height: 40px;
  border-radius: 30px;
  padding: 0 40px 0 25px;
  background: ${(props) => props.theme.colors.core};
  border: 2px solid ${(props) => props.theme.colors.hunter};
  color: ${(props) => props.theme.colors.notice};
  font-family: ${(props) => props.theme.fonts.family.primary.regular};
  font-size: ${(props) => props.theme.fonts.size.small};
  `,
  Main: Styled.div`
  display: flex;
  width: 100%;
  height: 80%;
  flex-direction: column;
  padding: 20px;
  margin-bottom: 20px;
  overflow: scroll;
`,
  Bottom: Styled.div`
  display: flex;
  width: 100%;
  height: 20%;
  background: ${(props) => props.theme.colors.core};
  justify-content: center;
`,
  Remove: Styled.button`
  display: flex;
  position: relative;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 30px;
  margin: 0;
  background: ${(props) => props.theme.colors.core};
  cursor: pointer;
  transition: all 0.5s;
  border: 2px solid ${(props) => props.theme.colors.hunter};
  z-index: 1;
  padding: 0 10px;
  font-family: ${(props) => props.theme.fonts.family.primary.regular};
  font-size: ${(props) => props.theme.fonts.size.medium};
  color: ${(props) => props.theme.colors.notice};

  &:hover {
    border: 2px solid ${(props) => props.theme.colors.emerald};
  }
  `,
};

export default AddressesView;
