import React from 'react';
import { Flex, Input } from 'antd';


const { TextArea } = Input;

type Props = {
    text: string;
}

const TextAreaPage: React.FC<Props> = (props: Props) => {

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log('Change:', e.target.value);
      };
    return (
        <Flex vertical gap={32}>
          <TextArea
            defaultValue={props.text}
            showCount
            minLength={100}
            onChange={onChange}
            placeholder="disable resize"
            autoSize={{ minRows: 4, maxRows: 26 }}
            style={{ height: 120, resize: 'none' }}
          />
        </Flex>
      )
};

export default TextAreaPage;