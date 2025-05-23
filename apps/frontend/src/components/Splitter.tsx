import React, {useEffect, useState} from 'react';
import { Splitter, Spin } from 'antd';
import UploadPage from './Upload';
import CodePage from './Code';
import TextAreaPage from './TextArea';
import  {useTextStore} from '../stores';


const SplitterPage: React.FC = () => {

  const text = useTextStore(state => state.text);
  const loading = useTextStore(state => state.loading);
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [textState, setTextState] = useState<string>('');

  useEffect(() => {
    setLoadingState(loading);
    setTextState(text);

  }, [text, loading]);

  const loadView = (loading: boolean) => {
    if (loading) {
      return <Spin />
    } else {
      return <TextAreaPage text={textState} />
    }
  }
  return (
    <Splitter style={{ height: '400px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
  
      <Splitter.Panel collapsible>
      <UploadPage />
      </Splitter.Panel>
      <Splitter.Panel collapsible={{ start: true }}>
        {loadView(loadingState)}
      </Splitter.Panel>
      <Splitter.Panel>
        {/* <Desc text={3} /> */}
        <CodePage />
      </Splitter.Panel>
    </Splitter>
  )
};

export default SplitterPage;