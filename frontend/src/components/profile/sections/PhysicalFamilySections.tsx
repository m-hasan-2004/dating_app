'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import ProfileSection from '@/components/profile/ProfileSection';
import DisplayRow from '@/components/profile/DisplayRow';
import FormField, { useFormState, SelectOption } from '@/components/profile/FormField';
import { toArray, formatMultiValue } from '@/components/profile/profileUtils';
import type {
  PhysicalInformation,
  FamilyInformation,
  EngagementOrWeddingStatus,
  SkinColorEnum,
  EyesColorEnum,
  BloodTypeEnum,
  CharacterAndTemperamentEnum,
  BodyAndFaceEnum,
  AverageFamilyEducationEnum,
  AverageFamilyFinanceEnum,
  EngagementStatusEnum,
} from '@/services/profileService';
import {
  createPhysicalInformation,
  updatePhysicalInformation,
  createFamilyInformation,
  updateFamilyInformation,
  createEngagementOrWeddingStatus,
  updateEngagementOrWeddingStatus,
} from '@/services/profileService';

/* ─── Options ─────────────────────────────────────────────────────────── */

const SKIN_COLOR_OPTIONS: SelectOption[] = [
  'Very Bright', 'Bor', 'Fair', 'White', 'Wheat', 'Greenish', 'Olive',
  'Darken', 'Black', 'Bright Brown', 'Darken Brown', 'Bright', 'Yellow',
  'Whitish White', 'Red & White', 'Bright Greenish', 'Other',
].map((v) => ({ value: v, label: v }));

const EYES_COLOR_OPTIONS: SelectOption[] = [
  'Green', 'Light Blue', 'Hazel', 'Darken Blue', 'Grey', 'Honey', 'Purple',
  'Light Brown', 'Deep Brown', 'Black',
].map((v) => ({ value: v, label: v }));

const BLOOD_TYPE_OPTIONS: SelectOption[] = [
  'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-',
].map((v) => ({ value: v, label: v }));

const TEMPERAMENT_OPTIONS: SelectOption[] = [
  { value: 'Safravi', label: 'Safravi (Hot & Dry)' },
  { value: 'Damvi', label: 'Damvi (Hot & Wet)' },
  { value: 'Sodavi', label: 'Sodavi (Cold & Dry)' },
  { value: 'Balghami', label: 'Balghami (Cold & Wet)' },
];

const BODY_FACE_OPTIONS: SelectOption[] = [
  'Excellent', 'Good', 'Average', 'Suitable', 'Nice Face', 'Nice Body',
  'Looks Older', 'Looks Younger', 'Satisfied', 'None',
].map((v) => ({ value: v, label: v }));

const FAMILY_EDU_OPTIONS: SelectOption[] = [
  'Under Diploma', 'Diploma', 'Associate Degree', "Bachelor's", "Master's", 'Ph.D.', 'Hoze',
].map((v) => ({ value: v, label: v }));

const FAMILY_FIN_OPTIONS: SelectOption[] = [
  'Perfect', 'Good', 'Average', 'Weak',
].map((v) => ({ value: v, label: v }));

const ENGAGEMENT_OPTIONS: SelectOption[] = [
  { value: 'Engagement', label: 'Engagement' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Wedding', label: 'Wedding' },
  { value: 'None', label: 'None' },
];

/* ─── PhysicalInformationSection ───────────────────────────────────────── */

function defaultPhysicalForm(data: PhysicalInformation | null) {
  return {
    height: data?.height ?? '',
    weight: data?.weight ?? '',
    skin_color: data?.skin_color ?? ('' as SkinColorEnum),
    eyes_color: data?.eyes_color ?? ('' as EyesColorEnum),
    blood_type: data?.blood_type ?? ('' as BloodTypeEnum),
    character_and_temperament: data?.character_and_temperament ?? ('' as CharacterAndTemperamentEnum),
    glasses: data?.glasses ?? false,
    glasses_size: data?.glasses_size ?? '',
    body_and_face: toArray(data?.body_and_face) as BodyAndFaceEnum[],
    disease_or_surgery_history: data?.disease_or_surgery_history ?? false,
    medication_surgery_disease_type: data?.medication_surgery_disease_type ?? '',
  };
}

export function PhysicalInformationSection({
  data,
  onReload,
  isCollapsed,
  onToggleCollapse,
}: {
  data: PhysicalInformation | null;
  onReload: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset } = useFormState(defaultPhysicalForm(data));

  const openModal = () => {
    reset(defaultPhysicalForm(data));
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...state,
        height: state.height ? Number(state.height) : null,
        weight: state.weight ? Number(state.weight) : null,
        skin_color: state.skin_color || null,
        eyes_color: state.eyes_color || null,
        blood_type: state.blood_type || null,
        character_and_temperament: state.character_and_temperament || null,
        glasses_size: state.glasses ? state.glasses_size : null,
        medication_surgery_disease_type: state.disease_or_surgery_history ? state.medication_surgery_disease_type : null,
      };
      if (data?.id) {
        await updatePhysicalInformation(data.id, payload as any);
      } else {
        await createPhysicalInformation(payload as any);
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
      <ProfileSection title="Physical Information" onEdit={openModal} isEmpty={!data} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <DisplayRow label="Height" value={data?.height ? `${data.height} cm` : null} />
        <DisplayRow label="Weight" value={data?.weight ? `${data.weight} kg` : null} />
        <DisplayRow label="Skin Color" value={data?.skin_color} />
        <DisplayRow label="Eyes Color" value={data?.eyes_color} />
        <DisplayRow label="Blood Type" value={data?.blood_type} />
        <DisplayRow label="Temperament" value={data?.character_and_temperament} />
        <DisplayRow label="Glasses" value={data?.glasses ? `Yes (${data.glasses_size || 'No size specified'})` : 'No'} />
        <DisplayRow label="Body & Face" value={formatMultiValue(data?.body_and_face, BODY_FACE_OPTIONS)} />
        <DisplayRow
          label="Disease / Surgery History"
          value={data?.disease_or_surgery_history ? `Yes (${data.medication_surgery_disease_type || '—'})` : 'No'}
        />
      </ProfileSection>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl w-full">
        <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {data ? 'Edit' : 'Add'} Physical Information
          </h2>
          <div className="space-y-4">
            <FormField label="Height (cm)" name="height" type="number" value={state.height} onChange={handleChange} />
            <FormField label="Weight (kg)" name="weight" type="number" value={state.weight} onChange={handleChange} />
            <FormField label="Skin Color" name="skin_color" type="select" value={state.skin_color} onChange={handleChange} options={SKIN_COLOR_OPTIONS} />
            <FormField label="Eyes Color" name="eyes_color" type="select" value={state.eyes_color} onChange={handleChange} options={EYES_COLOR_OPTIONS} />
            <FormField label="Blood Type" name="blood_type" type="select" value={state.blood_type} onChange={handleChange} options={BLOOD_TYPE_OPTIONS} />
            <FormField label="Temperament" name="character_and_temperament" type="select" value={state.character_and_temperament} onChange={handleChange} options={TEMPERAMENT_OPTIONS} />
            <FormField label="Glasses" name="glasses" type="boolean" value={state.glasses} onChange={handleChange} />
            {state.glasses && (
              <FormField label="Glasses Size / Number" name="glasses_size" type="text" value={state.glasses_size} onChange={handleChange} />
            )}
            <FormField label="Body and Face Characteristics" name="body_and_face" type="multiselect" value={state.body_and_face} onChange={handleChange} options={BODY_FACE_OPTIONS} />
            <FormField label="Disease / Surgery History" name="disease_or_surgery_history" type="boolean" value={state.disease_or_surgery_history} onChange={handleChange} />
            {state.disease_or_surgery_history && (
              <FormField label="Disease / Surgery Details" name="medication_surgery_disease_type" type="textarea" value={state.medication_surgery_disease_type} onChange={handleChange} />
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

/* ─── FamilyInformationSection ─────────────────────────────────────────── */

function defaultFamilyForm(data: FamilyInformation | null) {
  return {
    average_family_education: data?.average_family_education ?? ('' as AverageFamilyEducationEnum),
    average_family_finance: data?.average_family_finance ?? ('' as AverageFamilyFinanceEnum),
    family_divorce_history: data?.family_divorce_history ?? false,
    family_divorce_reason: data?.family_divorce_reason ?? '',
    contact_with_family: data?.contact_with_family ?? '',
    contact_with_relatives: data?.contact_with_relatives ?? '',
    number_of_sisters: data?.number_of_sisters ?? '',
    number_of_brothers: data?.number_of_brothers ?? '',
  };
}

export function FamilyInformationSection({
  data,
  onReload,
  isCollapsed,
  onToggleCollapse,
}: {
  data: FamilyInformation | null;
  onReload: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset } = useFormState(defaultFamilyForm(data));

  const openModal = () => {
    reset(defaultFamilyForm(data));
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...state,
        number_of_sisters: state.number_of_sisters ? Number(state.number_of_sisters) : null,
        number_of_brothers: state.number_of_brothers ? Number(state.number_of_brothers) : null,
        family_divorce_reason: state.family_divorce_history ? state.family_divorce_reason : null,
      };
      if (data?.id) {
        await updateFamilyInformation(data.id, payload as any);
      } else {
        await createFamilyInformation(payload as any);
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
      <ProfileSection title="Families Information" onEdit={openModal} isEmpty={!data} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <DisplayRow label="Average Family Education" value={data?.average_family_education} />
        <DisplayRow label="Average Family Finance" value={data?.average_family_finance} />
        <DisplayRow
          label="Family Divorce History"
          value={data?.family_divorce_history ? `Yes (${data.family_divorce_reason || '—'})` : 'No'}
        />
        <DisplayRow label="Contact with Family" value={data?.contact_with_family} />
        <DisplayRow label="Contact with Relatives" value={data?.contact_with_relatives} />
        <DisplayRow label="Number of Sisters" value={data?.number_of_sisters} />
        <DisplayRow label="Number of Brothers" value={data?.number_of_brothers} />
      </ProfileSection>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl w-full">
        <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {data ? 'Edit' : 'Add'} Families Information
          </h2>
          <div className="space-y-4">
            <FormField label="Average Family Education" name="average_family_education" type="select" value={state.average_family_education} onChange={handleChange} options={FAMILY_EDU_OPTIONS} required />
            <FormField label="Average Family Finance" name="average_family_finance" type="select" value={state.average_family_finance} onChange={handleChange} options={FAMILY_FIN_OPTIONS} required />
            <FormField label="Family Divorce History" name="family_divorce_history" type="boolean" value={state.family_divorce_history} onChange={handleChange} />
            {state.family_divorce_history && (
              <FormField label="Divorce Reason" name="family_divorce_reason" type="textarea" value={state.family_divorce_reason} onChange={handleChange} />
            )}
            <FormField label="Contact with Family" name="contact_with_family" type="text" value={state.contact_with_family} onChange={handleChange} required />
            <FormField label="Contact with Relatives" name="contact_with_relatives" type="text" value={state.contact_with_relatives} onChange={handleChange} required />
            <FormField label="Number of Sisters" name="number_of_sisters" type="number" value={state.number_of_sisters} onChange={handleChange} />
            <FormField label="Number of Brothers" name="number_of_brothers" type="number" value={state.number_of_brothers} onChange={handleChange} />
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

/* ─── EngagementStatusSection ───────────────────────────────────────────── */

function defaultEngagementForm(data: EngagementOrWeddingStatus | null) {
  return {
    status: data?.status ?? ('' as EngagementStatusEnum),
    contract_length: data?.contract_length ?? '',
    living_length: data?.living_length ?? '',
    death_date: data?.death_date ?? '',
    divorce_date: data?.divorce_date ?? '',
    reason_for_divorce_or_death: data?.reason_for_divorce_or_death ?? '',
  };
}

export function EngagementStatusSection({
  data,
  onReload,
  isCollapsed,
  onToggleCollapse,
}: {
  data: EngagementOrWeddingStatus | null;
  onReload: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset } = useFormState(defaultEngagementForm(data));

  const openModal = () => {
    reset(defaultEngagementForm(data));
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...state,
        death_date: state.death_date || null,
        divorce_date: state.divorce_date || null,
      };
      if (data?.id) {
        await updateEngagementOrWeddingStatus(data.id, payload as any);
      } else {
        await createEngagementOrWeddingStatus(payload as any);
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
      <ProfileSection title="Engagements or Weddings Statuses" onEdit={openModal} isEmpty={!data} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <DisplayRow label="Status" value={data?.status} />
        <DisplayRow label="Contract Length" value={data?.contract_length} />
        <DisplayRow label="Living Length" value={data?.living_length} />
        <DisplayRow label="Death Date" value={data?.death_date} />
        <DisplayRow label="Divorce Date" value={data?.divorce_date} />
        <DisplayRow label="Reason for Divorce or Death" value={data?.reason_for_divorce_or_death} />
      </ProfileSection>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl w-full">
        <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {data ? 'Edit' : 'Add'} Engagements or Weddings Status
          </h2>
          <div className="space-y-4">
            <FormField label="Status" name="status" type="select" value={state.status} onChange={handleChange} options={ENGAGEMENT_OPTIONS} required />
            <FormField label="Contract Length" name="contract_length" type="text" value={state.contract_length} onChange={handleChange} />
            <FormField label="Living Length" name="living_length" type="text" value={state.living_length} onChange={handleChange} />
            <FormField label="Death Date" name="death_date" type="date" value={state.death_date} onChange={handleChange} />
            <FormField label="Divorce Date" name="divorce_date" type="date" value={state.divorce_date} onChange={handleChange} />
            <FormField label="Reason for Divorce or Death" name="reason_for_divorce_or_death" type="textarea" value={state.reason_for_divorce_or_death} onChange={handleChange} />
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