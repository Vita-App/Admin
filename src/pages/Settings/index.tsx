import React from 'react';
import { useSearchParams } from 'react-router-dom';

import Container from 'components/Container';
import Stack from '@mui/material/Stack';
import BannerSettings from 'pages/Settings/Banner';
import Waitlist from './Waitlist';
import RefreshToken from './RefreshToken';
import { Divider, useMediaQuery } from '@mui/material';

const SettingsPage = () => {
  const mq = useMediaQuery('(min-width:600px)');

  return (
    <Container>
      <Stack
        direction={mq ? 'row' : 'column'}
        spacing={2}
        justifyContent="space-around"
        divider={
          <Divider orientation={mq ? 'vertical' : 'horizontal'} flexItem />
        }>
        <BannerSettings />
        <Waitlist />
        <RefreshToken />
      </Stack>
    </Container>
  );
};

export default SettingsPage;
