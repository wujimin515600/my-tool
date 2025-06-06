import React from 'react';
import { Col, Row } from 'antd';
import {ButtonPage, SelectPage} from './index';

const RowPage: React.FC = () => (
    <Row>
      <Col span={8}><ButtonPage /></Col>
      <Col span={8}><SelectPage /></Col>
      <Col span={8}>col-8</Col>
    </Row>
);

export default RowPage;