import React, { useEffect, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload, Image } from 'antd';
import { usePreviewStore, type PreviewStore, setLoading, setText } from '../stores'
import {OCRSDK} from '@myorg/free_image_ocr';


const { Dragger } = Upload;



const UploadPage: React.FC = () => {
    const [previewImage, setPreviewImage] = useState('');
    const { previewImage: previeStore } = usePreviewStore() as PreviewStore;
    const setSotrePreview = usePreviewStore((state: unknown) => {
        const typedState = state as PreviewStore;
        return typedState.setPreviewImage;
    });
    // const { setLoading, setText } = useTextStore(
    //     (state: TextStore) => ({ 
    //     setLoading: state.setLoading, 
    //     setText: state.setText }),
    //     shallow
    // );
    // useEffect(() => {
    //     const unsubscribe = useTextStore.subscribe(
    //       state => ({ setLoading: state.setLoading, setText: state.setText }),
    //       (newState, prevState) => {
    //         // 手动比较或使用 shallow
    //         if (newState.setLoading !== prevState.setLoading || newState.setText !== prevState.setText) {
    //           // 处理更新
    //         }
    //       },
    //       { equalityFn: shallow } // ✅ 添加比较函数
    //     );
    //     return unsubscribe;
    //   }, []);

    const OCR = async (file: string) => {
        setLoading(true);
        const res = await OCRSDK(file);
        console.log(res);
        setLoading(false);
        setText(res);
    }

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
        if (!previeStore) {
            setPreviewImage('');
        }
    }, [previeStore]);
    // 阻止自动上传
    const beforeUpload = () => false;
    const props: UploadProps = {
        name: 'file',
        multiple: true,
        beforeUpload: beforeUpload,
        disabled: !!previewImage,
        async onChange(info) {
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
            setSotrePreview(previewUrl);
            await OCR(previewUrl);
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