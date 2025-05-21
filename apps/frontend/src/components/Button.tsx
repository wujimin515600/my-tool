import React from 'react';
import { Button } from 'antd';
import { usePreviewStore, type PreviewStore } from '../stores'

const ButtonPage: React.FC = () => {
    const clearImg = usePreviewStore((state: unknown) => {
        const typedState = state as PreviewStore;
        return typedState.setPreviewImage;
    });
    return (
        <Button type="primary" onClick={() => clearImg('')}>
            清除图片
        </Button>
    );
};

export default ButtonPage;