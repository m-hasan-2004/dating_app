'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import ProfileSection from '@/components/profile/ProfileSection';
import DisplayRow from '@/components/profile/DisplayRow';
import FormField, { useFormState, SelectOption } from '@/components/profile/FormField';
import type { Mother, Father, EducationEnum, OriginalityEnum } from '@/services/profileService';
import { createMother, updateMother, createFather, updateFather } from '@/services/profileService';

const EDUCATION_OPTIONS: SelectOption[] = [
  'Unlettered', 'Under Diploma', 'Diploma', 'Associate Degree', "Bachelor's Degree",
  "Master's Degree", 'Ph.D.', 'Hoze (Islamic Seminary) LVL 1', 'Hoze (Islamic Seminary) LVL 2',
  'Hoze (Islamic Seminary) LVL 3', 'Hoze (Islamic Seminary) LVL 4', 'School & Quranic',
].map((v) => ({ value: v, label: v }));

const ORIGINALITY_OPTIONS: SelectOption[] = [
  'Alborzz', 'Ardabil', 'Bushehr', 'Chaharmahal and Bakhtiari', 'East Azerbaijan',
  'Esfahan', 'Fars', 'Gilan', 'Golestan', 'Hamadan', 'Hormozgan', 'Ilam', 'Kerman',
  'Kermanshah', 'Khuzestan', 'Kohgiluyeh and Boyer-Ahmad', 'Kurdistan', 'Lorestan',
  'Markazi', 'Mazandaran', 'North Khorasan', 'Qazvin', 'Qom', 'Razavi Khorasan',
  'Semnan', 'Sistan and Baluchestan', 'South Khorasan', 'Tehran', 'West Azerbaijan',
  'Yazd', 'Zanjan', 'doesnt_matter',
].map((v) => ({ value: v, label: v === 'doesnt_matter' ? "Doesn't Matter" : v }));

function defaultParentForm(data: Mother | Father | null) {
  return {
    language: data?.language ?? '',
    birth_date: data?.birth_date ?? '',
    job: data?.job ?? '',
    originality: data?.originality ?? ('doesnt_matter' as OriginalityEnum),
    education: data?.education ?? ('' as EducationEnum),
    alive: data?.alive ?? true,
    death_date: data?.death_date ?? '',
  };
}

export function MotherSection({
  data,
  onReload,
  isCollapsed,
  onToggleCollapse,
}: {
  data: Mother | null;
  onReload: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset } = useFormState(defaultParentForm(data));

  const openModal = () => {
    reset(defaultParentForm(data));
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...state,
        death_date: !state.alive && state.death_date ? state.death_date : null,
      };
      if (data?.id) {
        await updateMother(data.id, payload as any);
      } else {
        await createMother(payload as any);
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
      <ProfileSection title="Mothers" onEdit={openModal} isEmpty={!data} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <DisplayRow label="Language" value={data?.language} />
        <DisplayRow label="Birth Date" value={data?.birth_date} />
        <DisplayRow label="Job" value={data?.job} />
        <DisplayRow label="Originality / Province" value={data?.originality} />
        <DisplayRow label="Education" value={data?.education} />
        <DisplayRow label="Alive" value={data?.alive ? 'Yes' : 'No'} />
        {!data?.alive && <DisplayRow label="Death Date" value={data?.death_date} />}
      </ProfileSection>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-lg w-full">
        <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {data ? 'Edit' : 'Add'} Mother Information
          </h2>
          <div className="space-y-4">
            <FormField label="Language" name="language" type="text" value={state.language} onChange={handleChange} required />
            <FormField label="Birth Date" name="birth_date" type="date" value={state.birth_date} onChange={handleChange} required />
            <FormField label="Job" name="job" type="text" value={state.job} onChange={handleChange} required />
            <FormField label="Originality" name="originality" type="select" value={state.originality} onChange={handleChange} options={ORIGINALITY_OPTIONS} required />
            <FormField label="Education" name="education" type="select" value={state.education} onChange={handleChange} options={EDUCATION_OPTIONS} required />
            <FormField label="Alive" name="alive" type="boolean" value={state.alive} onChange={handleChange} />
            {!state.alive && (
              <FormField label="Death Date" name="death_date" type="date" value={state.death_date} onChange={handleChange} />
            )}
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

export function FatherSection({
  data,
  onReload,
  isCollapsed,
  onToggleCollapse,
}: {
  data: Father | null;
  onReload: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset } = useFormState(defaultParentForm(data));

  const openModal = () => {
    reset(defaultParentForm(data));
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...state,
        death_date: !state.alive && state.death_date ? state.death_date : null,
      };
      if (data?.id) {
        await updateFather(data.id, payload as any);
      } else {
        await createFather(payload as any);
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
      <ProfileSection title="Fathers" onEdit={openModal} isEmpty={!data} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <DisplayRow label="Language" value={data?.language} />
        <DisplayRow label="Birth Date" value={data?.birth_date} />
        <DisplayRow label="Job" value={data?.job} />
        <DisplayRow label="Originality / Province" value={data?.originality} />
        <DisplayRow label="Education" value={data?.education} />
        <DisplayRow label="Alive" value={data?.alive ? 'Yes' : 'No'} />
        {!data?.alive && <DisplayRow label="Death Date" value={data?.death_date} />}
      </ProfileSection>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-lg w-full">
        <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {data ? 'Edit' : 'Add'} Father Information
          </h2>
          <div className="space-y-4">
            <FormField label="Language" name="language" type="text" value={state.language} onChange={handleChange} required />
            <FormField label="Birth Date" name="birth_date" type="date" value={state.birth_date} onChange={handleChange} required />
            <FormField label="Job" name="job" type="text" value={state.job} onChange={handleChange} required />
            <FormField label="Originality" name="originality" type="select" value={state.originality} onChange={handleChange} options={ORIGINALITY_OPTIONS} required />
            <FormField label="Education" name="education" type="select" value={state.education} onChange={handleChange} options={EDUCATION_OPTIONS} required />
            <FormField label="Alive" name="alive" type="boolean" value={state.alive} onChange={handleChange} />
            {!state.alive && (
              <FormField label="Death Date" name="death_date" type="date" value={state.death_date} onChange={handleChange} />
            )}
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