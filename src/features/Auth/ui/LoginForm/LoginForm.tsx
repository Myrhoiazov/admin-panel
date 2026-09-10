import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonTheme } from '@/shared/ui/Button/Button';
import { useSelector } from 'react-redux';
import { memo } from 'react';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig';
import { Text } from '@/shared/ui/Text/Text';
import {
    DynamicModuleLoader,
    ReducersList,
} from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { getLoginEmail } from '../../model/selectors/getLoginEmail/getLoginEmail';
import { getLoginPassword } from '../../model/selectors/getLoginPassword/getLoginPassword';
import { getLoginIsLoading } from '../../model/selectors/getLoginIsLoading/getLoginIsLoading';
import { getLoginError } from '../../model/selectors/getLoginError/getLoginError';
import { loginByUsername } from '../../model/services/loginByUsername/loginByUsername';
import { loginActions, loginReducer } from '../../model/slice/authSlice';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Input } from '@/shared/ui/Input/Input';
import { Icon } from '@/shared/ui/Icon/Icon';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import EyeIcon from '@/shared/assets/icons/eye-20-20.svg';
import cls from './LoginForm.module.scss';
import { VStack } from '@/shared/ui/Stack';
import { AppImage } from '@/shared/ui/AppImage';
import Logo from '@/shared/assets/images/dr-rusakova.png';
import { Card } from '@/shared/ui/Card/Card';

export interface LoginFormProps {
    className?: string;
    onSuccess?: () => void;
}

const initialReducers: ReducersList = {
    loginForm: loginReducer,
};

const LoginForm = memo(({ className, onSuccess }: LoginFormProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const email = useSelector(getLoginEmail);
    const password = useSelector(getLoginPassword);
    const dispatch = useAppDispatch();
    const isLoading = useSelector(getLoginIsLoading);
    const error = useSelector(getLoginError);

    const [showPassword, setShowPassword] = useState(false);

    const onChangeEmail = useCallback(
        (value: string) => {
            dispatch(loginActions.cleanError());
            dispatch(loginActions.setUseremail(value));
        },
        [dispatch]
    );

    const onChangePassword = useCallback(
        (value: string) => {
            dispatch(loginActions.cleanError());
            dispatch(loginActions.setPassword(value));
        },
        [dispatch]
    );

    const onLoginClick = useCallback(async () => {
        const result = await dispatch(loginByUsername({ email, password }));
        if (result.meta.requestStatus === 'fulfilled') {
            onSuccess?.();
        }
    }, [onSuccess, dispatch, password, email]);

    const onKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                onLoginClick();
            }
        },
        [onLoginClick]
    );

    return (
        <DynamicModuleLoader reducers={initialReducers}>
            <Card
                className={classNames(cls.LoginForm, {}, [className])}
                shadow="shadowAccent"
                padding="32"
            >
                <VStack align="center">
                    <AppImage src={Logo} alt="Dr Rusakova clinic" width={200} />
                    <VStack gap="4" align="center" className={cls.header}>
                        <Text size="m" title={t('Добро пожаловать!')} bold />
                        <Text size="s" text={t('Пожалуйста авторизируйтесь!')} />
                    </VStack>
                </VStack>

                <Input
                    fullWidth
                    label="Email"
                    autofocus
                    type="email"
                    autoComplete="email"
                    autoCapitalize="off"
                    spellCheck={false}
                    className={cls.input}
                    placeholder="Email"
                    onChange={onChangeEmail}
                    value={email}
                    onKeyDown={onKeyDown}
                />

                <Input
                    fullWidth
                    label="Пароль"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={cls.input}
                    placeholder={t('Пароль')}
                    onChange={onChangePassword}
                    value={password}
                    onKeyDown={onKeyDown}
                    addonRight={
                        <Icon
                            Svg={EyeIcon}
                            clickable
                            onClick={() => setShowPassword((prev) => !prev)}
                            width={18}
                            height={18}
                            className={showPassword ? cls.eyeActive : cls.eyeInactive}
                        />
                    }
                />

                {error && (
                    <Text
                        text={error.message || t('Неверный email или пароль')}
                        variant="error"
                    />
                )}

                <VStack gap="16" align="center">
                    <Button
                        theme={ButtonTheme.BACKGROUND_INVERTED}
                        className={cls.loginBtn}
                        onClick={onLoginClick}
                        disabled={isLoading}
                        fullWidth
                    >
                        {isLoading ? t('Входим...') : t('Войти')}
                    </Button>
                    <Button
                        theme={ButtonTheme.CLEAR}
                        className={cls.forgot}
                        onClick={() => navigate(RoutePath.forgot_password)}
                    >
                        {t('Забыли пароль?')}
                    </Button>
                </VStack>
            </Card>
        </DynamicModuleLoader>
    );
});

export default LoginForm;
