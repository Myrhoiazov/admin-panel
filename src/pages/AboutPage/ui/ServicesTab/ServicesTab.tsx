import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { $apiPrivate } from '@/shared/api/api';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import ProceduresIcon from '@/shared/assets/icons/procedures.svg';
import { getUserAuthData } from '@/entities/User';

interface ServiceItemType {
    id: number;
    name: string;
    price: number;
    isActive: boolean;
    deactivatedAt: string | null;
}

interface ServiceCategoryType {
    id: number;
    name: string;
    procedure?: { id: number; name: string } | null;
    items: ServiceItemType[];
    isActive: boolean;
    deactivatedAt: string | null;
}

interface ProcedureOption {
    id: number;
    name: string;
}

const formatPrice = (price: number): string =>
    price.toLocaleString('ru-RU').replace(/\s/g, ' ') + ' ₴';

const formatDate = (value: string): string => new Date(value).toLocaleDateString('ru-RU');

/* ── Styles ── */
const s = {
    container: { padding: '24px 0' } as React.CSSProperties,

    addCatBtn: {
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '8px 18px', background: '#6c47ff', color: '#fff',
        border: 'none', borderRadius: '8px', cursor: 'pointer',
        fontWeight: 600, fontSize: '14px', marginBottom: '24px',
    } as React.CSSProperties,

    addCatForm: {
        display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center',
        marginBottom: '24px', padding: '16px',
        background: '#f5f3ff', borderRadius: '10px', border: '1px solid #d9d2fb',
    } as React.CSSProperties,

    input: {
        padding: '7px 12px', borderRadius: '7px', border: '1px solid #ccc',
        fontSize: '14px', minWidth: '180px', outline: 'none',
    } as React.CSSProperties,

    inputSm: {
        padding: '7px 12px', borderRadius: '7px', border: '1px solid #ccc',
        fontSize: '14px', minWidth: '120px', outline: 'none',
    } as React.CSSProperties,

    select: {
        padding: '7px 12px', borderRadius: '7px', border: '1px solid #ccc',
        fontSize: '14px', minWidth: '200px', outline: 'none', background: '#fff',
    } as React.CSSProperties,

    card: {
        background: '#fff', borderRadius: '12px', border: '1px solid #e5e5e5',
        marginBottom: '20px', overflow: 'hidden',
    } as React.CSSProperties,

    cardInactive: {
        background: '#fafafa', borderRadius: '12px', border: '1px solid #e5e5e5',
        marginBottom: '20px', overflow: 'hidden', opacity: 0.7,
    } as React.CSSProperties,

    cardHeader: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', background: '#fafafa', borderBottom: '1px solid #e5e5e5',
        flexWrap: 'wrap', gap: '8px',
    } as React.CSSProperties,

    catName: { fontWeight: 700, fontSize: '16px', color: '#222' } as React.CSSProperties,

    catNameInactive: { fontWeight: 700, fontSize: '16px', color: '#999', textDecoration: 'line-through' } as React.CSSProperties,

    badge: {
        display: 'inline-block', padding: '2px 10px', background: '#ede9fe',
        color: '#6c47ff', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
    } as React.CSSProperties,

    badgeInactive: {
        display: 'inline-block', padding: '2px 10px', background: '#f0f0f0',
        color: '#888', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
    } as React.CSSProperties,

    btnOutlinePurple: {
        padding: '5px 12px', background: 'transparent', color: '#6c47ff',
        border: '1px solid #6c47ff', borderRadius: '7px', cursor: 'pointer',
        fontSize: '13px', fontWeight: 500,
    } as React.CSSProperties,

    btnOutlineRed: {
        padding: '5px 12px', background: 'transparent', color: '#e53e3e',
        border: '1px solid #e53e3e', borderRadius: '7px', cursor: 'pointer',
        fontSize: '13px', fontWeight: 500,
    } as React.CSSProperties,

    btnOutlineGreen: {
        padding: '5px 12px', background: 'transparent', color: '#2a8a6e',
        border: '1px solid #2a8a6e', borderRadius: '7px', cursor: 'pointer',
        fontSize: '13px', fontWeight: 500,
    } as React.CSSProperties,

    btnSolid: {
        padding: '6px 14px', background: '#6c47ff', color: '#fff',
        border: 'none', borderRadius: '7px', cursor: 'pointer',
        fontSize: '13px', fontWeight: 600,
    } as React.CSSProperties,

    btnGhost: {
        padding: '6px 14px', background: 'transparent', color: '#888',
        border: '1px solid #ccc', borderRadius: '7px', cursor: 'pointer',
        fontSize: '13px',
    } as React.CSSProperties,

    itemsList: { padding: '0 20px' } as React.CSSProperties,

    itemRow: {
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 0', borderBottom: '1px solid #f0f0f0', flexWrap: 'wrap',
    } as React.CSSProperties,

    itemEditRow: {
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '8px 0', borderBottom: '1px solid #f0f0f0', flexWrap: 'wrap',
    } as React.CSSProperties,

    itemName: { fontSize: '14px', color: '#333', flex: '1 1 auto', minWidth: 0 } as React.CSSProperties,

    itemNameInactive: { fontSize: '14px', color: '#999', textDecoration: 'line-through', flex: '1 1 auto', minWidth: 0 } as React.CSSProperties,

    itemPrice: { fontWeight: 600, fontSize: '14px', color: '#222', marginLeft: 'auto', flexShrink: 0 } as React.CSSProperties,

    iconBtn: {
        background: 'transparent', border: 'none', cursor: 'pointer',
        fontSize: '15px', lineHeight: 1, padding: '2px 5px', color: '#aaa', borderRadius: '5px',
    } as React.CSSProperties,

    editIconBtn: {
        background: 'transparent', border: 'none', cursor: 'pointer',
        fontSize: '14px', lineHeight: 1, padding: '2px 6px', color: '#6c47ff',
        borderRadius: '5px',
    } as React.CSSProperties,

    addItemArea: { padding: '12px 20px' } as React.CSSProperties,

    inlineForm: { display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' } as React.CSSProperties,

    catActions: { display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 } as React.CSSProperties,

    deactivatedNote: { fontSize: '12px', color: '#999' } as React.CSSProperties,
};

export const ServicesTab = () => {
    const authData = useSelector(getUserAuthData);
    const isAdmin = Boolean(authData?.isAdmin);

    const [categories, setCategories] = useState<ServiceCategoryType[]>([]);
    const [procedures, setProcedures] = useState<ProcedureOption[]>([]);
    const [loading, setLoading] = useState(false);

    /* Add category */
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [newCatProcedureId, setNewCatProcedureId] = useState('');
    const [addCatLoading, setAddCatLoading] = useState(false);

    /* Edit category: catId → { name } | null */
    const [editCatForms, setEditCatForms] = useState<Record<number, { name: string } | null>>({});

    /* Add item: catId → { name, price } | null */
    const [addItemForms, setAddItemForms] = useState<Record<number, { name: string; price: string } | null>>({});

    /* Edit item: itemId → { name, price } | null */
    const [editItemForms, setEditItemForms] = useState<Record<number, { name: string; price: string } | null>>({});

    const [confirmDeleteCatId, setConfirmDeleteCatId] = useState<number | null>(null);

    const loadCategories = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await $apiPrivate.get<ServiceCategoryType[]>(
                isAdmin ? '/services?includeInactive=true' : '/services',
            );
            setCategories(data ?? []);
        } finally {
            setLoading(false);
        }
    }, [isAdmin]);

    const loadProcedures = useCallback(async () => {
        try {
            const { data } = await $apiPrivate.get<ProcedureOption[]>('/procedures');
            setProcedures(data ?? []);
        } catch {
            /* non-critical */
        }
    }, []);

    useEffect(() => {
        loadCategories();
        loadProcedures();
    }, [loadCategories, loadProcedures]);

    /* ── Category actions (admin-only — server also enforces this) ── */
    const handleAddCategory = async () => {
        if (!newCatName.trim()) return;
        try {
            setAddCatLoading(true);
            await $apiPrivate.post('/services/categories', {
                name: newCatName.trim(),
                procedureId: newCatProcedureId ? Number(newCatProcedureId) : undefined,
            });
            setNewCatName('');
            setNewCatProcedureId('');
            setShowAddCategory(false);
            await loadCategories();
        } finally {
            setAddCatLoading(false);
        }
    };

    const openEditCat = (cat: ServiceCategoryType) =>
        setEditCatForms((prev) => ({ ...prev, [cat.id]: { name: cat.name } }));

    const closeEditCat = (catId: number) =>
        setEditCatForms((prev) => ({ ...prev, [catId]: null }));

    const handleSaveCat = async (catId: number) => {
        const form = editCatForms[catId];
        if (!form || !form.name.trim()) return;
        await $apiPrivate.patch(`/services/categories/${catId}`, { name: form.name.trim() });
        closeEditCat(catId);
        await loadCategories();
    };

    const handleDeactivateCategory = async (id: number) => {
        await $apiPrivate.delete(`/services/categories/${id}`);
        await loadCategories();
    };

    const handleRestoreCategory = async (id: number) => {
        await $apiPrivate.post(`/services/categories/${id}/restore`);
        await loadCategories();
    };

    /* ── Item actions (admin-only — server also enforces this) ── */
    const openAddItemForm = (categoryId: number) =>
        setAddItemForms((prev) => ({ ...prev, [categoryId]: { name: '', price: '' } }));

    const closeAddItemForm = (categoryId: number) =>
        setAddItemForms((prev) => ({ ...prev, [categoryId]: null }));

    const handleAddItem = async (categoryId: number) => {
        const form = addItemForms[categoryId];
        if (!form || !form.name.trim() || !form.price) return;
        await $apiPrivate.post('/services/items', {
            categoryId,
            name: form.name.trim(),
            price: Number(form.price),
        });
        closeAddItemForm(categoryId);
        await loadCategories();
    };

    const openEditItem = (item: ServiceItemType) =>
        setEditItemForms((prev) => ({ ...prev, [item.id]: { name: item.name, price: String(item.price) } }));

    const closeEditItem = (itemId: number) =>
        setEditItemForms((prev) => ({ ...prev, [itemId]: null }));

    const handleSaveItem = async (itemId: number) => {
        const form = editItemForms[itemId];
        if (!form || !form.name.trim()) return;
        await $apiPrivate.patch(`/services/items/${itemId}`, {
            name: form.name.trim(),
            price: Number(form.price),
        });
        closeEditItem(itemId);
        await loadCategories();
    };

    const handleDeactivateItem = async (itemId: number) => {
        await $apiPrivate.delete(`/services/items/${itemId}`);
        await loadCategories();
    };

    const handleRestoreItem = async (itemId: number) => {
        await $apiPrivate.post(`/services/items/${itemId}/restore`);
        await loadCategories();
    };

    if (loading) {
        return <div style={{ padding: '32px', color: '#888' }}>Загрузка услуг...</div>;
    }

    return (
        <div style={s.container}>
            {/* ── Add category (admin only) ── */}
            {isAdmin && (!showAddCategory ? (
                <button style={s.addCatBtn} onClick={() => setShowAddCategory(true)}>
                    + Добавить категорию
                </button>
            ) : (
                <div style={s.addCatForm}>
                    <input
                        style={s.input}
                        placeholder="Название категории"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                    <select
                        style={s.select}
                        value={newCatProcedureId}
                        onChange={(e) => setNewCatProcedureId(e.target.value)}
                    >
                        <option value="">Без процедуры</option>
                        {procedures.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <button style={s.btnSolid} onClick={handleAddCategory} disabled={addCatLoading}>
                        {addCatLoading ? 'Добавление...' : 'Добавить'}
                    </button>
                    <button style={s.btnGhost} onClick={() => { setShowAddCategory(false); setNewCatName(''); setNewCatProcedureId(''); }}>
                        Отмена
                    </button>
                </div>
            ))}

            {/* ── Categories ── */}
            {categories.map((cat) => {
                const itemForm = addItemForms[cat.id];
                const editCat = editCatForms[cat.id];

                return (
                    <div key={cat.id} style={cat.isActive ? s.card : s.cardInactive}>
                        {/* Category header */}
                        <div style={s.cardHeader}>
                            {editCat ? (
                                /* ─ Edit category name ─ */
                                <div style={s.inlineForm}>
                                    <input
                                        style={s.input}
                                        value={editCat.name}
                                        onChange={(e) =>
                                            setEditCatForms((prev) => ({ ...prev, [cat.id]: { name: e.target.value } }))
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSaveCat(cat.id);
                                            if (e.key === 'Escape') closeEditCat(cat.id);
                                        }}
                                        autoFocus
                                    />
                                    <button style={s.btnSolid} onClick={() => handleSaveCat(cat.id)}>Сохранить</button>
                                    <button style={s.btnGhost} onClick={() => closeEditCat(cat.id)}>Отмена</button>
                                </div>
                            ) : (
                                /* ─ View mode ─ */
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                    <span style={cat.isActive ? s.catName : s.catNameInactive}>{cat.name}</span>
                                    {cat.procedure && <span style={cat.isActive ? s.badge : s.badgeInactive}>{cat.procedure.name}</span>}
                                    {!cat.isActive && cat.deactivatedAt && (
                                        <span style={s.deactivatedNote}>Деактивирована {formatDate(cat.deactivatedAt)}</span>
                                    )}
                                </div>
                            )}

                            {isAdmin && (
                                <div style={s.catActions}>
                                    {!cat.isActive ? (
                                        <button style={s.btnOutlineGreen} onClick={() => handleRestoreCategory(cat.id)}>
                                            Восстановить
                                        </button>
                                    ) : (
                                        <>
                                            {!editCat && (
                                                <button style={s.btnOutlinePurple} onClick={() => openEditCat(cat)} title="Редактировать категорию">
                                                    ✎ Изменить
                                                </button>
                                            )}
                                            <button style={s.btnOutlineRed} onClick={() => setConfirmDeleteCatId(cat.id)}>
                                                Деактивировать
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Items list */}
                        <div style={s.itemsList}>
                            {cat.items.length === 0 && (
                                <div style={{ padding: '12px 0', color: '#aaa', fontSize: '14px' }}>
                                    Услуги не добавлены
                                </div>
                            )}

                            {cat.items.map((item) => {
                                const editItem = editItemForms[item.id];

                                if (editItem) {
                                    /* ─ Edit item inline ─ */
                                    return (
                                        <div key={item.id} style={s.itemEditRow}>
                                            <input
                                                style={{ ...s.input, flex: '1 1 160px' }}
                                                value={editItem.name}
                                                placeholder="Название услуги"
                                                onChange={(e) =>
                                                    setEditItemForms((prev) => ({
                                                        ...prev,
                                                        [item.id]: { ...prev[item.id]!, name: e.target.value },
                                                    }))
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleSaveItem(item.id);
                                                    if (e.key === 'Escape') closeEditItem(item.id);
                                                }}
                                                autoFocus
                                            />
                                            <input
                                                style={s.inputSm}
                                                type="number"
                                                min="0"
                                                value={editItem.price}
                                                placeholder="Цена (₴)"
                                                onChange={(e) =>
                                                    setEditItemForms((prev) => ({
                                                        ...prev,
                                                        [item.id]: { ...prev[item.id]!, price: e.target.value },
                                                    }))
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleSaveItem(item.id);
                                                    if (e.key === 'Escape') closeEditItem(item.id);
                                                }}
                                            />
                                            <button style={s.btnSolid} onClick={() => handleSaveItem(item.id)}>Сохранить</button>
                                            <button style={s.btnGhost} onClick={() => closeEditItem(item.id)}>Отмена</button>
                                        </div>
                                    );
                                }

                                /* ─ View mode ─ */
                                return (
                                    <div key={item.id} style={s.itemRow}>
                                        <span style={item.isActive ? s.itemName : s.itemNameInactive}>{item.name}</span>
                                        {!item.isActive && item.deactivatedAt && (
                                            <span style={s.deactivatedNote}>Деактивирована {formatDate(item.deactivatedAt)}</span>
                                        )}
                                        <span style={s.itemPrice}>{formatPrice(item.price)}</span>
                                        {isAdmin && (
                                            item.isActive ? (
                                                <>
                                                    <button
                                                        style={s.editIconBtn}
                                                        onClick={() => openEditItem(item)}
                                                        title="Редактировать"
                                                    >
                                                        ✎
                                                    </button>
                                                    <button
                                                        style={s.iconBtn}
                                                        onClick={() => handleDeactivateItem(item.id)}
                                                        title="Деактивировать услугу"
                                                    >
                                                        ×
                                                    </button>
                                                </>
                                            ) : (
                                                <button style={s.btnOutlineGreen} onClick={() => handleRestoreItem(item.id)}>
                                                    Восстановить
                                                </button>
                                            )
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Add item (admin only, active categories only) */}
                        {isAdmin && cat.isActive && (
                            <div style={s.addItemArea}>
                                {!itemForm ? (
                                    <button style={s.btnOutlinePurple} onClick={() => openAddItemForm(cat.id)}>
                                        + Добавить услугу
                                    </button>
                                ) : (
                                    <div style={s.inlineForm}>
                                        <input
                                            style={s.input}
                                            placeholder="Название услуги"
                                            value={itemForm.name}
                                            onChange={(e) =>
                                                setAddItemForms((prev) => ({
                                                    ...prev,
                                                    [cat.id]: { ...prev[cat.id]!, name: e.target.value },
                                                }))
                                            }
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddItem(cat.id)}
                                            autoFocus
                                        />
                                        <input
                                            style={s.inputSm}
                                            placeholder="Цена (₴)"
                                            type="number"
                                            min="0"
                                            value={itemForm.price}
                                            onChange={(e) =>
                                                setAddItemForms((prev) => ({
                                                    ...prev,
                                                    [cat.id]: { ...prev[cat.id]!, price: e.target.value },
                                                }))
                                            }
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddItem(cat.id)}
                                        />
                                        <button style={s.btnSolid} onClick={() => handleAddItem(cat.id)}>Добавить</button>
                                        <button style={s.btnGhost} onClick={() => closeAddItemForm(cat.id)}>Отмена</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}

            {categories.length === 0 && !loading && (
                <EmptyState
                    icon={ProceduresIcon}
                    title="Категории услуг не добавлены"
                    description="Добавьте первую категорию, чтобы начать заполнять прайс-лист"
                />
            )}
            <ConfirmModal
                isOpen={confirmDeleteCatId !== null}
                message="Деактивировать категорию и все услуги в ней? Действие можно отменить кнопкой «Восстановить»."
                onConfirm={() => {
                    if (confirmDeleteCatId !== null) handleDeactivateCategory(confirmDeleteCatId);
                    setConfirmDeleteCatId(null);
                }}
                onCancel={() => setConfirmDeleteCatId(null)}
            />
        </div>
    );
};
