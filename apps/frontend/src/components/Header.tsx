import React, { useState } from 'react';

const HeaderPage: React.FC = () => {
    const [title] = useState('常用工具后台管理');
    const style = {
        fontSize: '2em'
    };

    return (
        <div>
            <h1 style={style}>{title}</h1>
        </div>
    );
}

export default HeaderPage;