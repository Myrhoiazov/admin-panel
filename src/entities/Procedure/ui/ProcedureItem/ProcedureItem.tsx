import React, { memo } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import s from './ProcedureItem.module.scss';
import { Procedure } from '../../model/types/procedure';
import { Card } from 'shared/ui/Card/Card';
import { AppImage } from 'shared/ui/AppImage';
import { Link } from 'react-router-dom';
import { RoutePath } from 'shared/config/routeConfig/routeConfig';
import { VStack } from 'shared/ui/Stack';
import { Text } from 'shared/ui/Text/Text';

interface ProcedureItemProps {
    className?: string;
    procedure: Procedure;
}

const ProcedureItem = ({ className, procedure }: ProcedureItemProps) => {
    return (
        <Card
            className={classNames(s.ProcedureItem, {}, [className])}
            shadow="shadowAccent"
            padding="0"
        >
            <Link to={`${RoutePath.procedures_details}${procedure.id}`} className={s.link}>
                <VStack gap="8" align="stretch" justify="start" className={s.content}>
                    <span className={s.imageWrapper}>
                        <AppImage
                            className={s.image}
                            src={procedure.image as string}
                            alt={procedure.name}
                        />
                    </span>
                    <Text size="l" text={procedure.name} className={s.title} bold />
                </VStack>
            </Link>
        </Card>
    );
};

export default memo(ProcedureItem);
