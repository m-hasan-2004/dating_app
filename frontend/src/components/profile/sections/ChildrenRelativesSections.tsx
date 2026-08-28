'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import MultiRecordSection from '@/components/profile/MultiRecordSection';
import DisplayRow from '@/components/profile/DisplayRow';
import FormField, { useFormState, SelectOption } from '@/components/profile/FormField';
import type {
  ExHusbandChildStatus,
  Sister,
  Brother,
  Groom,
  BrideOrWife,
  ExHusbandChildGenderEnum,
  CustodyEnum,
  GroomOrEnum,
  BrideOrEnum,
} from '@/services/profileMultiService';
import type { EducationEnum } from '@/services/profileService';
import {
  createExHusbandChildStatus,
  updateExHusbandChildStatus,
  deleteExHusbandChildStatus,
  createSister,
  updateSister,
  deleteSister,
  createBrother,
  updateBrother,
  deleteBrother,
  createGroom,
  updateGroom,
  deleteGroom,
  createBrideOrWife,
  updateBrideOrWife,
  deleteBrideOrWife,
} from '@/services/profileMultiService';

const EDUCATION_OPTIONS: SelectOption[] = [
  'Unlettered', 'Under Diploma', 'Diploma', 'Associate Degree', "Bachelor's Degree",
  "Master's Degree", 'Ph.D.', 'Hoze (Islamic Seminary) LVL 1', 'Hoze (Islamic Seminary) LVL 2',
  'Hoze (Islamic Seminary) LVL 3', 'Hoze (Islamic Seminary) LVL 4', 'School & Quranic',
].map((v) => ({ value: v, label: v }));

/* ─── 1. ExHusbandChildStatusSection ───────────────────────────────────── */

const GENDER_OPTIONS: SelectOption[] = [
  { value: 'boy', label: 'Boy' },
  { value: 'girl', label: 'Girl' },
];

const CUSTODY_OPTIONS: SelectOption[] = [
  { value: 'Father', label: 'Father' },
  { value: 'Mother', label: 'Mother' },
  { value: 'Independant', label: 'Independent' },
  { value: 'Other', label: 'Other' },
];

function defaultExChildForm(item?: ExHusbandChildStatus | null) {
  return {
    gender: item?.gender ?? ('boy' as ExHusbandChildGenderEnum),
    status: item?.status ?? false,
    birth_date: item?.birth_date ?? '',
    custody: item?.custody ?? ('Father' as CustodyEnum),
    living_location: item?.living_location ?? '',
  };
}

export function ExHusbandChildStatusSection({
  records,
  onReload,
  isCollapsed,
  onToggleCollapse,
}: {
  records: ExHusbandChildStatus[];
  onReload: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExHusbandChildStatus | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset } = useFormState(defaultExChildForm(null));

  const handleAdd = () => {
    setEditingItem(null);
    reset(defaultExChildForm(null));
    setError('');
    setOpen(true);
  };

  const handleEdit = (item: ExHusbandChildStatus) => {
    setEditingItem(item);
    reset(defaultExChildForm(item));
    setError('');
    setOpen(true);
  };

  const handleDelete = async (item: ExHusbandChildStatus) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await deleteExHusbandChildStatus(item.id);
      onReload();
    } catch (e: any) {
      alert(e?.message ?? 'Failed to delete');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...state,
        birth_date: state.birth_date || null,
        living_location: state.living_location || null,
      };
      if (editingItem?.id) {
        await updateExHusbandChildStatus(editingItem.id, payload as any);
      } else {
        await createExHusbandChildStatus(payload as any);
      }
      setOpen(false);
      onReload();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <MultiRecordSection
        title="Ex-Husbands Child Status"
        records={records}
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        renderRecord={(item) => (
          <div className="space-y-1">
            <DisplayRow label="Gender" value={item.gender === 'boy' ? 'Boy' : 'Girl'} />
            <DisplayRow label="Has Child Status" value={item.status ? 'Yes' : 'No'} />
            <DisplayRow label="Birth Date" value={item.birth_date} />
            <DisplayRow label="Custody" value={item.custody} />
            <DisplayRow label="Living Location" value={item.living_location} />
          </div>
        )}
      />

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-lg w-full">
        <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {editingItem ? 'Edit' : 'Add'} Ex-Husband Child Record
          </h2>
          <div className="space-y-4">
            <FormField label="Gender" name="gender" type="select" value={state.gender} onChange={handleChange} options={GENDER_OPTIONS} required />
            <FormField label="Status" name="status" type="boolean" value={state.status} onChange={handleChange} hint="Has child from ex-husband?" />
            <FormField label="Birth Date" name="birth_date" type="date" value={state.birth_date} onChange={handleChange} />
            <FormField label="Custody" name="custody" type="select" value={state.custody} onChange={handleChange} options={CUSTODY_OPTIONS} required />
            <FormField label="Living Location" name="living_location" type="text" value={state.living_location} onChange={handleChange} />
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ─── 2. SistersSection ────────────────────────────────────────────────── */

function defaultRelativeForm(item?: { status?: boolean; education?: string; job?: string } | null) {
  return {
    status: item?.status ?? true,
    education: item?.education ?? ('' as EducationEnum),
    job: item?.job ?? '',
  };
}

export function SistersSection({
  records,
  onReload,
  isCollapsed,
  onToggleCollapse,
}: {
  records: Sister[];
  onReload: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Sister | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset } = useFormState(defaultRelativeForm(null));

  const handleAdd = () => {
    setEditingItem(null);
    reset(defaultRelativeForm(null));
    setError('');
    setOpen(true);
  };

  const handleEdit = (item: Sister) => {
    setEditingItem(item);
    reset(defaultRelativeForm(item));
    setError('');
    setOpen(true);
  };

  const handleDelete = async (item: Sister) => {
    if (!confirm('Are you sure you want to delete this sister record?')) return;
    try {
      await deleteSister(item.id);
      onReload();
    } catch (e: any) {
      alert(e?.message ?? 'Failed to delete');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      if (editingItem?.id) {
        await updateSister(editingItem.id, state as any);
      } else {
        await createSister(state as any);
      }
      setOpen(false);
      onReload();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <MultiRecordSection
        title="Sisters" isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}
        records={records}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        renderRecord={(item) => (
          <div className="space-y-1">
            <DisplayRow label="Alive" value={item.status ? 'Yes' : 'No'} />
            <DisplayRow label="Education" value={item.education} />
            <DisplayRow label="Job" value={item.job} />
          </div>
        )}
      />

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-lg w-full">
        <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {editingItem ? 'Edit' : 'Add'} Sister
          </h2>
          <div className="space-y-4">
            <FormField label="Alive" name="status" type="boolean" value={state.status} onChange={handleChange} hint="Is she alive?" />
            <FormField label="Education" name="education" type="select" value={state.education} onChange={handleChange} options={EDUCATION_OPTIONS} required />
            <FormField label="Job" name="job" type="text" value={state.job} onChange={handleChange} required />
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ─── 3. BrothersSection ───────────────────────────────────────────────── */

export function BrothersSection({
  records,
  onReload,
  isCollapsed,
  onToggleCollapse,
}: {
  records: Brother[];
  onReload: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Brother | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset } = useFormState(defaultRelativeForm(null));

  const handleAdd = () => {
    setEditingItem(null);
    reset(defaultRelativeForm(null));
    setError('');
    setOpen(true);
  };

  const handleEdit = (item: Brother) => {
    setEditingItem(item);
    reset(defaultRelativeForm(item));
    setError('');
    setOpen(true);
  };

  const handleDelete = async (item: Brother) => {
    if (!confirm('Are you sure you want to delete this brother record?')) return;
    try {
      await deleteBrother(item.id);
      onReload();
    } catch (e: any) {
      alert(e?.message ?? 'Failed to delete');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      if (editingItem?.id) {
        await updateBrother(editingItem.id, state as any);
      } else {
        await createBrother(state as any);
      }
      setOpen(false);
      onReload();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <MultiRecordSection
        title="Brothers" isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}
        records={records}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        renderRecord={(item) => (
          <div className="space-y-1">
            <DisplayRow label="Alive" value={item.status ? 'Yes' : 'No'} />
            <DisplayRow label="Education" value={item.education} />
            <DisplayRow label="Job" value={item.job} />
          </div>
        )}
      />

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-lg w-full">
        <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {editingItem ? 'Edit' : 'Add'} Brother
          </h2>
          <div className="space-y-4">
            <FormField label="Alive" name="status" type="boolean" value={state.status} onChange={handleChange} hint="Is he alive?" />
            <FormField label="Education" name="education" type="select" value={state.education} onChange={handleChange} options={EDUCATION_OPTIONS} required />
            <FormField label="Job" name="job" type="text" value={state.job} onChange={handleChange} required />
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ─── 4. GroomsSection ─────────────────────────────────────────────────── */

const GROOM_OR_OPTIONS: SelectOption[] = [
  { value: 'groom', label: 'Groom' },
  { value: 'zan_dadash', label: 'Zan Dadash' },
];

function defaultGroomForm(item?: Groom | null) {
  return {
    status: item?.status ?? true,
    education: item?.education ?? ('' as EducationEnum),
    job: item?.job ?? '',
    groom_or: item?.groom_or ?? ('groom' as GroomOrEnum),
  };
}

export function GroomsSection({
  records,
  onReload,
  isCollapsed,
  onToggleCollapse,
}: {
  records: Groom[];
  onReload: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Groom | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset } = useFormState(defaultGroomForm(null));

  const handleAdd = () => {
    setEditingItem(null);
    reset(defaultGroomForm(null));
    setError('');
    setOpen(true);
  };

  const handleEdit = (item: Groom) => {
    setEditingItem(item);
    reset(defaultGroomForm(item));
    setError('');
    setOpen(true);
  };

  const handleDelete = async (item: Groom) => {
    if (!confirm('Are you sure you want to delete this groom record?')) return;
    try {
      await deleteGroom(item.id);
      onReload();
    } catch (e: any) {
      alert(e?.message ?? 'Failed to delete');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      if (editingItem?.id) {
        await updateGroom(editingItem.id, state as any);
      } else {
        await createGroom(state as any);
      }
      setOpen(false);
      onReload();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <MultiRecordSection
        title="Grooms" isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}
        records={records}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        renderRecord={(item) => (
          <div className="space-y-1">
            <DisplayRow label="Role" value={item.groom_or === 'groom' ? 'Groom' : 'Zan Dadash'} />
            <DisplayRow label="Alive" value={item.status ? 'Yes' : 'No'} />
            <DisplayRow label="Education" value={item.education} />
            <DisplayRow label="Job" value={item.job} />
          </div>
        )}
      />

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-lg w-full">
        <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {editingItem ? 'Edit' : 'Add'} Groom
          </h2>
          <div className="space-y-4">
            <FormField label="Role" name="groom_or" type="select" value={state.groom_or} onChange={handleChange} options={GROOM_OR_OPTIONS} required />
            <FormField label="Alive" name="status" type="boolean" value={state.status} onChange={handleChange} />
            <FormField label="Education" name="education" type="select" value={state.education} onChange={handleChange} options={EDUCATION_OPTIONS} required />
            <FormField label="Job" name="job" type="text" value={state.job} onChange={handleChange} required />
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ─── 5. BridesWivesSection ────────────────────────────────────────────── */

const BRIDE_OR_OPTIONS: SelectOption[] = [
  { value: 'bride', label: 'Bride or Wife' },
  { value: 'shohar_khahar', label: 'Shohar Khahar (Brother-in-Law)' },
];

function defaultBrideForm(item?: BrideOrWife | null) {
  return {
    status: item?.status ?? true,
    education: item?.education ?? ('' as EducationEnum),
    job: item?.job ?? '',
    bride_or: item?.bride_or ?? ('bride' as BrideOrEnum),
  };
}

export function BridesWivesSection({
  records,
  onReload,
  isCollapsed,
  onToggleCollapse,
}: {
  records: BrideOrWife[];
  onReload: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BrideOrWife | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset } = useFormState(defaultBrideForm(null));

  const handleAdd = () => {
    setEditingItem(null);
    reset(defaultBrideForm(null));
    setError('');
    setOpen(true);
  };

  const handleEdit = (item: BrideOrWife) => {
    setEditingItem(item);
    reset(defaultBrideForm(item));
    setError('');
    setOpen(true);
  };

  const handleDelete = async (item: BrideOrWife) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await deleteBrideOrWife(item.id);
      onReload();
    } catch (e: any) {
      alert(e?.message ?? 'Failed to delete');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      if (editingItem?.id) {
        await updateBrideOrWife(editingItem.id, state as any);
      } else {
        await createBrideOrWife(state as any);
      }
      setOpen(false);
      onReload();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <MultiRecordSection
        title="Brides or Wives" isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}
        records={records}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        renderRecord={(item) => (
          <div className="space-y-1">
            <DisplayRow label="Role" value={item.bride_or === 'bride' ? 'Bride or Wife' : 'Shohar Khahar'} />
            <DisplayRow label="Alive" value={item.status ? 'Yes' : 'No'} />
            <DisplayRow label="Education" value={item.education} />
            <DisplayRow label="Job" value={item.job} />
          </div>
        )}
      />

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-lg w-full">
        <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {editingItem ? 'Edit' : 'Add'} Bride or Wife
          </h2>
          <div className="space-y-4">
            <FormField label="Role" name="bride_or" type="select" value={state.bride_or} onChange={handleChange} options={BRIDE_OR_OPTIONS} required />
            <FormField label="Alive" name="status" type="boolean" value={state.status} onChange={handleChange} />
            <FormField label="Education" name="education" type="select" value={state.education} onChange={handleChange} options={EDUCATION_OPTIONS} required />
            <FormField label="Job" name="job" type="text" value={state.job} onChange={handleChange} required />
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}