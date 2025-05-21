import React from 'react';
import { Select, Space } from 'antd';

const SelectPage: React.FC = () => {

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
      };
    return (
        <Space wrap>
          <Select
            defaultValue="Mongoodb"
            style={{ width: 120 }}
            onChange={handleChange}
            options={[
              { value: 'Mongoodb', label: 'Mongoodb' },
              { value: 'Mongoodb1', label: 'Mongoodb1' },
            ]}
          />
        </Space>
      )
};

export default SelectPage;