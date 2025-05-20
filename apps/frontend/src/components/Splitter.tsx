import React from 'react';
import { Flex, Splitter, Typography } from 'antd';
import UploadPage from './Upload';

const Desc: React.FC<Readonly<{ text?: string | number }>> = (props) => (
  <Flex justify="center" align="center" style={{ height: '100%' }}>
    <Typography.Title type="secondary" level={5} style={{ whiteSpace: 'nowrap' }}>
      {props.text}
    </Typography.Title>
  </Flex>
);

const SplitterPage: React.FC = () => (
  <Splitter style={{ height: '400px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>

    <Splitter.Panel collapsible>
    <UploadPage />
    </Splitter.Panel>
    <Splitter.Panel collapsible={{ start: true }}>
      <Desc text={2} />
    </Splitter.Panel>
    <Splitter.Panel>
      <Desc text={3} />
    </Splitter.Panel>
  </Splitter>
);

export default SplitterPage;