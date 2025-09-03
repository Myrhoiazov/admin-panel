import React, { memo } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import s from './LoginPage.module.scss';
import { LoginForm } from 'features/Auth';
import { Page } from 'widgets/Page/Page';

interface LoginPageProps {
    className?: string;
}

const LoginPage = ({ className }: LoginPageProps) => {
    return (
        <Page className={classNames(s.LoginPage, {}, [className])}>
            <LoginForm />
        </Page>
    );
};

export default memo(LoginPage);
