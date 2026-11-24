
import React from 'react';

import { Stack, Text } from '@fluentui/react';



const HomePage = () => {

  return (

    <Stack

      tokens={{ childrenGap: 20 }}

      styles={{

        root: {

          padding: 20,

          background: '#f5f5f5',

          minHeight: '100vh'

        }

      }}

    >

      <Text variant="xxLarge">

        Cedarwood Sales Dashboard

      </Text>



      <Stack horizontal tokens={{ childrenGap: 20 }}>

        <Stack styles={{ root: { background: '#fff', padding: 20, width: 250 } }}>

          <Text variant="large">Today's Sales</Text>

          <Text variant="xxLarge">$0.00</Text>

        </Stack>



        <Stack styles={{ root: { background: '#fff', padding: 20, width: 250 } }}>

          <Text variant="large">Tickets Today</Text>

          <Text variant="xxLarge">0</Text>

        </Stack>



        <Stack styles={{ root: { background: '#fff', padding: 20, width: 250 } }}>

          <Text variant="large">Average Ticket</Text>

          <Text variant="xxLarge">$0.00</Text>

        </Stack>

      </Stack>



      <Stack styles={{ root: { background: '#fff', padding: 20 } }}>

        <Text variant="xLarge">Recent Transactions</Text>

        <Text>POS data will appear here.</Text>

      </Stack>

    </Stack>

  );

};



export default HomePage;
