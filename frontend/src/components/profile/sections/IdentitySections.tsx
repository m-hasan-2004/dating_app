'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/modal';
import { useTranslation } from '@/context/LanguageContext';
import Button from '@/components/ui/button/Button';
import ProfileSection from '@/components/profile/ProfileSection';
import DisplayRow from '@/components/profile/DisplayRow';
import FormField, { useFormState, SelectOption } from '@/components/profile/FormField';
import { toArray, formatMultiValue } from '@/components/profile/profileUtils';
import { formatDate, formatHeight, formatWeight } from '@/utils/formatters';
import { formatApiError, bottomErrorMessage } from '@/utils/errorFormatter';
import type {
  IdentityInformation,
  BirthCertificateInformation,
  MarriageExperienceEnum,
  MarriageStatusEnum,
  ChildrenEnum,
  ChildrenCustodyEnum,
} from '@/services/profileService';
import {
  createIdentityInformation,
  updateIdentityInformation,
  createBirthCertificateInformation,
  updateBirthCertificateInformation,
} from '@/services/profileService';

/* ─── options ─────────────────────────────────────────────────────────── */

const MARRIAGE_EXPERIENCE_OPTIONS: SelectOption[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'engagement_only', label: 'Engagement Only' },
];

const MARRIAGE_STATUS_OPTIONS: SelectOption[] = [
  { value: 'husband', label: 'Husband' },
  { value: 'blank_birth_certificate', label: 'Blank Birth Certificate' },
];

const CHILDREN_OPTIONS: SelectOption[] = [
  { value: 'none', label: 'None' },
  { value: 'one_boy', label: 'One Boy' },
  { value: 'two_boys', label: 'Two Boys' },
  { value: 'three_boys', label: 'Three Boys' },
  { value: 'one_girl', label: 'One Girl' },
  { value: 'two_girls', label: 'Two Girls' },
  { value: 'three_girls', label: 'Three Girls' },
];

const CHILDREN_CUSTODY_OPTIONS: SelectOption[] = [
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
];

const EDUCATION_OPTIONS: SelectOption[] = [
  { value: 'Unlettered', label: 'Unlettered' },
  { value: 'Under Diploma', label: 'Under Diploma' },
  { value: 'Diploma', label: 'Diploma' },
  { value: 'Associate Degree', label: 'Associate Degree' },
  { value: "Bachelor's Degree", label: "Bachelor's Degree" },
  { value: "Master's Degree", label: "Master's Degree" },
  { value: 'Ph.D.', label: 'Ph.D.' },
  { value: 'Hoze (Islamic Seminary) LVL 1', label: 'Hoze LVL 1' },
  { value: 'Hoze (Islamic Seminary) LVL 2', label: 'Hoze LVL 2' },
  { value: 'Hoze (Islamic Seminary) LVL 3', label: 'Hoze LVL 3' },
  { value: 'Hoze (Islamic Seminary) LVL 4', label: 'Hoze LVL 4' },
  { value: 'School & Quranic', label: 'School & Quranic' },
];

const CAPITAL_OPTIONS: SelectOption[] = [
  { value: 'house', label: 'House' },
  { value: 'shop', label: 'Shop' },
  { value: 'land', label: 'Land' },
  { value: 'garden', label: 'Garden' },
  { value: 'factory', label: 'Factory' },
  { value: 'company', label: 'Company' },
  { value: 'motorcycle', label: 'Motorcycle' },
  { value: 'car', label: 'Car' },
  { value: 'gold', label: 'Gold' },
  { value: 'other', label: 'Other' },
  { value: 'none', label: "I don't have any" },
];

const PAYMENT_TYPE_OPTIONS: SelectOption[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'online', label: 'Online' },
];

/* ─── IdentityInformationSection ─────────────────────────────────────── */

interface IdentitySectionProps {
  data: IdentityInformation | null;
  onReload: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

function defaultIdentityForm(data: IdentityInformation | null) {
  return {
    first_name: data?.first_name ?? '',
    last_name: data?.last_name ?? '',
    father_name: data?.father_name ?? '',
    eitta_number: data?.eitta_number ?? '',
    landline_phone: data?.landline_phone ?? '',
    mother_phone: data?.mother_phone ?? '',
    father_phone: data?.father_phone ?? '',
    home_address: data?.home_address ?? '',
    work_address: data?.work_address ?? '',
    originality: data?.originality ?? '',
    education: data?.education ?? '',
    job: data?.job ?? '',
    insurance: data?.insurance ?? '',
    income: data?.income ?? '',
    assets: toArray(data?.assets),
    weight: data?.weight ?? '',
    height: data?.height ?? '',
    prefered_meeting_time: data?.prefered_meeting_time ?? '',
    type_of_payment: data?.type_of_payment ?? '',
  };
}

export function IdentityInformationSection({
  data,
  onReload,
  isCollapsed,
  onToggleCollapse,
}: IdentitySectionProps) {
  const { t, isRTL } = useTranslation();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset, fieldErrors, setFieldErrors } = useFormState(defaultIdentityForm(data));

  const openModal = () => {
    reset(defaultIdentityForm(data));
    setError('');
    setFieldErrors({});
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setFieldErrors({});
    try {
      const payload = {
        ...state,
        weight: state.weight ? Number(state.weight) : null,
        height: state.height ? Number(state.height) : null,
      };
      if (data?.id) {
        await updateIdentityInformation(data.id, payload as any);
      } else {
        await createIdentityInformation(payload as any);
      }
      setOpen(false);
      onReload();
    } catch (e: any) {
      const formatted = formatApiError(e, t, isRTL);
      setFieldErrors(formatted.fieldErrors);
      setError(bottomErrorMessage(formatted, t));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ProfileSection
        title="Identity Information"
        onEdit={openModal}
        isEmpty={!data}
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
      >
        <DisplayRow label="First Name" value={data?.first_name} />
        <DisplayRow label="Last Name" value={data?.last_name} />
        <DisplayRow label="Father Name" value={data?.father_name} />
        <DisplayRow label="Eitta Number" value={data?.eitta_number} />
        <DisplayRow label="Landline Phone" value={data?.landline_phone} />
        <DisplayRow label="Mother's Phone" value={data?.mother_phone} />
        <DisplayRow label="Father's Phone" value={data?.father_phone} />
        <DisplayRow label="Home Address" value={data?.home_address} />
        <DisplayRow label="Work Address" value={data?.work_address} />
        <DisplayRow label="Originality" value={data?.originality} />
        <DisplayRow label="Education" value={data?.education} />
        <DisplayRow label="Job" value={data?.job} />
        <DisplayRow label="Insurance" value={data?.insurance} />
        <DisplayRow label="Income" value={data?.income} />
        <DisplayRow label="Assets / Capital" value={formatMultiValue(data?.assets, CAPITAL_OPTIONS, t)} />
        <DisplayRow label="Height" value={data?.height ? formatHeight(data.height, isRTL) : null} />
        <DisplayRow label="Weight" value={data?.weight ? formatWeight(data.weight, isRTL) : null} />
        <DisplayRow label="Preferred Meeting Time" value={data?.prefered_meeting_time} />
        <DisplayRow label="Type of Payment" value={data?.type_of_payment} />
      </ProfileSection>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl w-full">
        <div className="p-6 max-h-[85vh] overflow-y-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {data ? t('Edit') : t('Add')} {t('Identity Information')}
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="First Name" name="first_name" type="text" value={state.first_name} onChange={handleChange} required error={fieldErrors.first_name} />
              <FormField label="Last Name" name="last_name" type="text" value={state.last_name} onChange={handleChange} required error={fieldErrors.last_name} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Father's Name" name="father_name" type="text" value={state.father_name} onChange={handleChange} error={fieldErrors.father_name} />
              <FormField label="Eitta Number" name="eitta_number" type="text" value={state.eitta_number} onChange={handleChange} error={fieldErrors.eitta_number} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Landline Phone" name="landline_phone" type="text" value={state.landline_phone} onChange={handleChange} error={fieldErrors.landline_phone} />
              <FormField label="Mother's Phone" name="mother_phone" type="text" value={state.mother_phone} onChange={handleChange} error={fieldErrors.mother_phone} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Father's Phone" name="father_phone" type="text" value={state.father_phone} onChange={handleChange} error={fieldErrors.father_phone} />
              <FormField label="Originality" name="originality" type="text" value={state.originality} onChange={handleChange} error={fieldErrors.originality} />
            </div>
            <FormField label="Home Address" name="home_address" type="textarea" value={state.home_address} onChange={handleChange} error={fieldErrors.home_address} />
            <FormField label="Work Address" name="work_address" type="textarea" value={state.work_address} onChange={handleChange} error={fieldErrors.work_address} />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Education" name="education" type="select" value={state.education} onChange={handleChange} options={EDUCATION_OPTIONS} error={fieldErrors.education} />
              <FormField label="Job / Profession" name="job" type="text" value={state.job} onChange={handleChange} error={fieldErrors.job} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Insurance" name="insurance" type="text" value={state.insurance} onChange={handleChange} error={fieldErrors.insurance} />
              <FormField label="Income" name="income" type="text" value={state.income} onChange={handleChange} error={fieldErrors.income} />
            </div>
            <FormField label="Assets / Capital" name="assets" type="multiselect" value={state.assets} onChange={handleChange} options={CAPITAL_OPTIONS} error={fieldErrors.assets} />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Height (cm)" name="height" type="number" value={state.height} onChange={handleChange} error={fieldErrors.height} />
              <FormField label="Weight (kg)" name="weight" type="number" value={state.weight} onChange={handleChange} error={fieldErrors.weight} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Preferred Meeting Time" name="prefered_meeting_time" type="text" value={state.prefered_meeting_time} onChange={handleChange} error={fieldErrors.prefered_meeting_time} />
              <FormField label="Payment Type" name="type_of_payment" type="select" value={state.type_of_payment} onChange={handleChange} options={PAYMENT_TYPE_OPTIONS} error={fieldErrors.type_of_payment} />
            </div>
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>{t('Cancel')}</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? t('Saving...') : t('Save')}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ─── BirthCertificateSection ────────────────────────────────────────── */

interface BirthCertSectionProps {
  data: BirthCertificateInformation | null;
  onReload: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

function defaultBirthCertForm(data: BirthCertificateInformation | null) {
  return {
    national_code: data?.national_code ?? '',
    birth_certificate_serial: data?.birth_certificate_serial ?? '',
    birth_certificate_location: data?.birth_certificate_location ?? '',
    marriage_experince: data?.marriage_experince ?? ('no' as MarriageExperienceEnum),
    contract_date: data?.contract_date ?? '',
    marriage_status: data?.marriage_status ?? ('blank_birth_certificate' as MarriageStatusEnum),
    marriage_date: data?.marriage_date ?? '',
    divorce_date: data?.divorce_date ?? '',
    husband_death_date: data?.husband_death_date ?? '',
    birth_date: data?.birth_date ?? '',
    children: ((Array.isArray(data?.children) ? data?.children[0] : data?.children) ?? 'none') as ChildrenEnum,
    children_custody: data?.children_custody ?? ('' as ChildrenCustodyEnum),
  };
}

export function BirthCertificateSection({
  data,
  onReload,
  isCollapsed,
  onToggleCollapse,
}: BirthCertSectionProps) {
  const { t, isRTL } = useTranslation();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset, fieldErrors, setFieldErrors } = useFormState(defaultBirthCertForm(data));

  /* ─── conditional visibility ─────────────────────────────────────────── */
  /* Marriage-specific fields only apply when the user has any marriage
     experience ("yes" and "engagement_only" both show everything); "no"
     keeps them (and the children fields) out of the modal and payload. */
  const showMarriageFields = state.marriage_experince !== 'no';
  // `children` may be a STRING (e.g. "none") or an ARRAY (multi-select) — handle both.
  const rawChildren: unknown = state.children;
  const childrenIsEmpty = Array.isArray(rawChildren)
    ? rawChildren.length === 0 || (rawChildren.length === 1 && rawChildren[0] === 'none')
    : !rawChildren || rawChildren === 'none';
  const showCustody = showMarriageFields && !childrenIsEmpty;

  /* Display-side conditions (server-stored data). */
  const dataShowMarriageFields = data?.marriage_experince !== 'no';
  const dataChildren: unknown = data?.children;
  const dataChildrenEmpty = Array.isArray(dataChildren)
    ? dataChildren.length === 0 || (dataChildren.length === 1 && dataChildren[0] === 'none')
    : !dataChildren || dataChildren === 'none';

  const openModal = () => {
    reset(defaultBirthCertForm(data));
    setError('');
    setFieldErrors({});
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setFieldErrors({});
    try {
      const payload = {
        ...state,
        // Hidden fields are neutralized so stale user input never reaches the API.
        contract_date: showMarriageFields ? state.contract_date || null : null,
        marriage_date: showMarriageFields ? state.marriage_date || null : null,
        divorce_date: showMarriageFields ? state.divorce_date || null : null,
        husband_death_date: showMarriageFields ? state.husband_death_date || null : null,
        // `children` is a required MultiSelectSerializerField that rejects an
        // empty list, so the neutral value is 'none' (validated server-side into ["none"]).
        children: showMarriageFields && !childrenIsEmpty ? (state.children as ChildrenEnum) : 'none',
        // ChoiceField (null/blank allowed) → null is the neutral hidden value.
        children_custody: showCustody ? (state.children_custody as ChildrenCustodyEnum) || null : null,
      };
      if (data?.id) {
        await updateBirthCertificateInformation(data.id, payload as any);
      } else {
        await createBirthCertificateInformation(payload as any);
      }
      setOpen(false);
      onReload();
    } catch (e: any) {
      const formatted = formatApiError(e, t, isRTL);
      setFieldErrors(formatted.fieldErrors);
      setError(bottomErrorMessage(formatted, t));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ProfileSection
        title="Birth Certificate Information"
        onEdit={openModal}
        isEmpty={!data}
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
      >
        <DisplayRow label="National Code" value={data?.national_code} />
        <DisplayRow label="Birth Certificate Serial" value={data?.birth_certificate_serial} />
        <DisplayRow label="Birth Certificate Location" value={data?.birth_certificate_location} />
        <DisplayRow label="Birth Date" value={data?.birth_date ? formatDate(data.birth_date, isRTL) : null} />
        <DisplayRow label="Marriage Experience" value={data?.marriage_experince} />
        <DisplayRow label="Marriage Status" value={data?.marriage_status} />
        {dataShowMarriageFields && (
          <>
            <DisplayRow label="Contract Date" value={data?.contract_date ? formatDate(data.contract_date, isRTL) : null} />
            <DisplayRow label="Marriage Date" value={data?.marriage_date ? formatDate(data.marriage_date, isRTL) : null} />
            <DisplayRow label="Divorce Date" value={data?.divorce_date ? formatDate(data.divorce_date, isRTL) : null} />
            <DisplayRow label="Husband Death Date" value={data?.husband_death_date ? formatDate(data.husband_death_date, isRTL) : null} />
            <DisplayRow label="Children" value={Array.isArray(data?.children) ? data?.children.join(", ") : data?.children} />
            {!dataChildrenEmpty && <DisplayRow label="Children Custody" value={data?.children_custody} />}
          </>
        )}
      </ProfileSection>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl w-full">
        <div className="p-6 max-h-[85vh] overflow-y-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {data ? t('Edit') : t('Add')} {t('Birth Certificate Information')}
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="National Code" name="national_code" type="text" value={state.national_code} onChange={handleChange} required error={fieldErrors.national_code} />
              <FormField label="Birth Certificate Serial" name="birth_certificate_serial" type="text" value={state.birth_certificate_serial} onChange={handleChange} required error={fieldErrors.birth_certificate_serial} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Birth Certificate Location" name="birth_certificate_location" type="text" value={state.birth_certificate_location} onChange={handleChange} required error={fieldErrors.birth_certificate_location} />
              <FormField label="Birth Date" name="birth_date" type="date" value={state.birth_date} onChange={handleChange} required error={fieldErrors.birth_date} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Marriage Experience" name="marriage_experince" type="select" value={state.marriage_experince} onChange={handleChange} options={MARRIAGE_EXPERIENCE_OPTIONS} error={fieldErrors.marriage_experince} />
              <FormField label="Marriage Status" name="marriage_status" type="select" value={state.marriage_status} onChange={handleChange} options={MARRIAGE_STATUS_OPTIONS} error={fieldErrors.marriage_status} />
            </div>
            {showMarriageFields && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Contract Date" name="contract_date" type="date" value={state.contract_date} onChange={handleChange} error={fieldErrors.contract_date} />
                  <FormField label="Marriage Date" name="marriage_date" type="date" value={state.marriage_date} onChange={handleChange} error={fieldErrors.marriage_date} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Divorce Date" name="divorce_date" type="date" value={state.divorce_date} onChange={handleChange} error={fieldErrors.divorce_date} />
                  <FormField label="Husband Death Date" name="husband_death_date" type="date" value={state.husband_death_date} onChange={handleChange} error={fieldErrors.husband_death_date} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Children" name="children" type="select" value={state.children} onChange={handleChange} options={CHILDREN_OPTIONS} error={fieldErrors.children} />
                  {showCustody && (
                    <FormField label="Children Custody" name="children_custody" type="select" value={state.children_custody} onChange={handleChange} options={CHILDREN_CUSTODY_OPTIONS} error={fieldErrors.children_custody} />
                  )}
                </div>
              </>
            )}
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>{t('Cancel')}</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? t('Saving...') : t('Save')}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}