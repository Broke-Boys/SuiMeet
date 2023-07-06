import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import router from './router';
import {RouterProvider} from 'react-router-dom';
import { WalletKitProvider } from '@mysten/wallet-kit';
import { Provider } from 'react-redux';
import {store} from './store';
import {ConfigProvider} from 'antd';
import { getRegistryAddress } from './client/getRegistryAddress';
import { rankPost } from './client/rankPosts';

getRegistryAddress().then(e => {
    localStorage.setItem('registryAddr', e);
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ConfigProvider theme={{
        token: {
            colorBgBase: '#242038',
            colorPrimary: '#FE754D',
            colorPrimaryText: 'white'
        }
    }}>
        <Provider store={store}>
            <WalletKitProvider>
                <RouterProvider router={router} />
            </WalletKitProvider>
        </Provider>
    </ConfigProvider>
  </React.StrictMode>
);
