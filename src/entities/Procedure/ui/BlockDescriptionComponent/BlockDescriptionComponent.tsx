import React, { memo } from 'react';
import { Input } from '@/shared/ui/Input/Input';
import Textarea from '@/shared/ui/Textarea/Textarea';

interface BlockDescriptionComponentProps {
    title?: string;
    description?: string;
    onChangeTitle?: (value: string) => void;
    onChangeDescription?: (value: string) => void;
}

const BlockDescriptionComponent = (props: BlockDescriptionComponentProps) => {
    const { title, description, onChangeTitle, onChangeDescription } = props;

    return (
        <>
            <Input
                fullWidth
                label="Название процедуры"
                autofocus
                type="text"
                placeholder="Название процедуры"
                onChange={onChangeTitle}
                value={title}
            />
            <Textarea
                fullWidth
                label="Описание процедуры"
                placeholder="Описание процедуры"
                onChange={onChangeDescription}
                value={description}
            />
        </>
    );
};

export default memo(BlockDescriptionComponent);
