import React, { useEffect, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload, Image } from 'antd';
import {usePreviewStore, type PreviewStore}from '../stores'

const { Dragger } = Upload;



const UploadPage: React.FC = () => {
    const [previewImage, setPreviewImage] = useState('');
// 为了解决类型不兼容问题，将 state 类型暂时设置为 unknown，并在使用前进行类型断言
const previeStore = usePreviewStore((state: unknown) => {
    const typedState = state as PreviewStore;
    return typedState.previewImage;
});

    // 生成文件预览 URL
    const getFilePreviewUrl = (file: Blob | MediaSource) => {
        return URL.createObjectURL(file);
        // base64 的数据
        // return new Promise((resolve) => {
        //   const reader = new FileReader();
        //   reader.onloadend = () => resolve(reader.result);
        //   reader.readAsDataURL(file);
        // });
    };
    useEffect(() => {
        console.log('previewImage', previeStore)
        setPreviewImage('');
    }, [previeStore]);
    // 阻止自动上传
    const beforeUpload = () => false;
    const props: UploadProps = {
        name: 'file',
        multiple: true,
        beforeUpload: beforeUpload,
        disabled: !!previewImage,
        onChange(info) {
            console.log('Upload changed:', info.fileList);
            const filteredImages = info.fileList
                // .filter(file => file.status === 'done' || file.status === 'ready')
                .map(file => {
                    // 处理预览 URL
                    if (file.response) {
                        // 服务器返回的 URL
                        return { ...file, url: file.response.url };
                    }
                    // 本地文件的预览 URL
                    return { ...file, url: file.url ?? file.thumbUrl };
                });


            const previewUrl = getFilePreviewUrl(filteredImages[0].originFileObj as Blob | MediaSource);
            setPreviewImage(previewUrl ?? '');
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    // 组件卸载时释放Blob URL
    React.useEffect(() => {
        return () => {
            // 释放所有Blob URL以避免内存泄漏
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    const preView = (previewImage: string) => {
        return (
            <Image
                width='100%'
                src={previewImage}
            />
        )
    }

    const uploadView = () => {
        return (
            <>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                    banned files.
                </p>
            </>
        )
    }

    return (
        <Dragger {...props}>
            {!previewImage ? uploadView() : preView(previewImage)}
        </Dragger>
    )
}

export default UploadPage;