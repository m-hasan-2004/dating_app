'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import ProfileSection from '@/components/profile/ProfileSection';
import DisplayRow from '@/components/profile/DisplayRow';
import FormField, { useFormState, SelectOption } from '@/components/profile/FormField';
import { toArray, formatMultiValue } from '@/components/profile/profileUtils';
import type {
  PersonalInformation,
  GenderEnum,
  EducationEnum,
  MilitaryStatusEnum,
  IncomeEnum,
  DepositEnum,
  InsuranceTypeEnum,
  LeisureTypeEnum,
  UsageCasesEnum,
} from '@/services/profileService';
import {
  createPersonalInformation,
  updatePersonalInformation,
} from '@/services/profileService';

/* ─── option arrays ──────────────────────────────────────────────────── */

const GENDER_OPTIONS: SelectOption[] = [
  { value: 'Man', label: 'Man' },
  { value: 'Woman', label: 'Woman' },
  { value: 'boy', label: 'Boy' },
  { value: 'girl', label: 'Girl' },
  { value: 'seperated', label: 'Separated' },
  { value: 'deceased', label: 'Deceased' },
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

const MILITARY_OPTIONS: SelectOption[] = [
  { value: 'Exemption', label: 'Exemption' },
  { value: 'Mother Sponsorship', label: 'Mother Sponsorship' },
  { value: 'Father Sponsorship', label: 'Father Sponsorship' },
  { value: 'Educational Exemption', label: 'Educational Exemption' },
  { value: 'Medical Exemption', label: 'Medical Exemption' },
  { value: 'End of Service', label: 'End of Service' },
  { value: 'No Service', label: 'No Service' },
  { value: 'Woman', label: 'Woman' },
];

const INCOME_OPTIONS: SelectOption[] = [
  { value: 'no_income', label: 'No Income' },
  { value: '-10', label: 'Under 10M' },
  { value: '10-20', label: 'Between 10M to 20M' },
  { value: '20-30', label: 'Between 20M to 30M' },
  { value: '30-40', label: 'Between 30M to 40M' },
  { value: '40-50', label: 'Between 40M to 50M' },
  { value: '50-100', label: 'Between 50M to 100M' },
  { value: '+100', label: 'Plus 100M' },
];

const DEPOSIT_OPTIONS: SelectOption[] = [
  { value: 'no_deposit', label: 'No Deposit' },
  { value: '-50', label: 'Under 50M' },
  { value: '50-100', label: 'Between 50M to 100M' },
  { value: '100-200', label: 'Between 100M to 200M' },
  { value: '200-500', label: 'Between 200M to 500M' },
  { value: '+500', label: 'Plus 500M' },
];

const INSURANCE_TYPE_OPTIONS: SelectOption[] = [
  { value: 'tamin', label: 'Tamin' },
  { value: 'takmili', label: 'Takmili' },
  { value: 'darmani', label: 'Darmani' },
  { value: 'niroo_mosalah', label: 'Niroo Mosalah' },
  { value: 'ommr', label: 'Ommr' },
  { value: 'iran', label: 'Iran' },
  { value: 'asia', label: 'Asia' },
  { value: 'dana', label: 'Dana' },
  { value: 'moalem', label: 'Moalem' },
  { value: 'parsian', label: 'Parsian' },
  { value: 'pasargad', label: 'Pasargad' },
  { value: 'Saman', label: 'Saman' },
  { value: 'melat', label: 'Melat' },
  { value: 'ma', label: 'Ma' },
  { value: 'alborz_insurance', label: 'Alborz' },
  { value: 'kosar', label: 'Kosar' },
  { value: 'karafarin', label: 'Karafarin' },
  { value: 'novin', label: 'Novin' },
  { value: 'day', label: 'Day' },
  { value: 'sarmad', label: 'Sarmad' },
  { value: 'Razi', label: 'Razi' },
  { value: 'taavon', label: 'Taavon' },
  { value: 'hafez', label: 'Hafez' },
  { value: 'etkayii', label: 'Etkayii Iranian' },
  { value: 'tejaratno', label: 'Tejarat No' },
  { value: 'khavermiane', label: 'Khavermiane' },
  { value: 'hekmat', label: 'Hekmat Saba' },
  { value: 'tosehe', label: 'Tosehe' },
  { value: 'other', label: 'Other' },
];

const LEISURE_OPTIONS: SelectOption[] = [
  { value: 'Park', label: 'Park' },
  { value: 'Trip', label: 'Trip' },
  { value: 'working_from_home', label: 'Working from Home' },
  { value: 'Mobile', label: 'Mobile' },
  { value: 'Reading', label: 'Reading' },
  { value: 'Shrine', label: 'Shrine' },
  { value: 'Jankaran', label: 'Jankaran' },
  { value: 'Cinema', label: 'Cinema' },
  { value: 'Family', label: 'Visiting Family (Sele arham)' },
  { value: 'sport', label: 'Sport' },
  { value: 'Poem', label: 'Poem' },
  { value: 'Garden', label: 'Garden' },
];

const USAGE_CASES_OPTIONS: SelectOption[] = [
  { value: 'Alcoholic Drinks', label: 'Alcoholic Drinks' },
  { value: 'Drugs', label: 'Drugs' },
  { value: 'Cigarettes', label: 'Cigarettes' },
  { value: 'Hookah', label: 'Hookah' },
  { value: 'none', label: 'None' },
];

/* ─── default form values ────────────────────────────────────────────── */

function defaultPersonalForm(data: PersonalInformation | null) {
  return {
    gender: data?.gender ?? ('' as GenderEnum),
    sadat: data?.sadat ?? false,
    birth_date: data?.birth_date ?? '',
    birth_location: data?.birth_location ?? '',
    education: data?.education ?? ('' as EducationEnum),
    degree: data?.degree ?? '',
    military_status: data?.military_status ?? ('' as MilitaryStatusEnum),
    military_status_explanation: data?.military_status_explanation ?? '',
    income: data?.income ?? ('' as IncomeEnum),
    deposit: data?.deposit ?? ('' as DepositEnum),
    have_insurance: data?.have_insurance ?? false,
    insurance_type: toArray(data?.insurance_type) as InsuranceTypeEnum[],
    insurance_years: data?.insurance_years ?? null,
    leisure_type: toArray(data?.leisure_type) as LeisureTypeEnum[],
    usage_cases: toArray(data?.usage_cases) as UsageCasesEnum[],
    usage_case_description: data?.usage_case_description ?? '',
    tatto: data?.tatto ?? false,
    tatto_description: data?.tatto_description ?? '',
    conviction_or_arrest_history: data?.conviction_or_arrest_history ?? false,
    conviction_reason: data?.conviction_reason ?? '',
  };
}

/* ─── PersonalsInformationSection ───────────────────────────────────── */

interface PersonalsInformationSectionProps {
  data: PersonalInformation | null;
  onReload: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function PersonalsInformationSection({ data, onReload, isCollapsed, onToggleCollapse }: PersonalsInformationSectionProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset } = useFormState(defaultPersonalForm(data));

  const openModal = () => {
    reset(defaultPersonalForm(data));
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...state,
        insurance_years: state.insurance_years ? Number(state.insurance_years) : null,
      };
      if (data?.id) {
        await updatePersonalInformation(data.id, payload);
      } else {
        await createPersonalInformation(payload);
      }
      setOpen(false);
      onReload();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const labelFor = (opts: SelectOption[], val: string) =>
    opts.find((o) => o.value === val)?.label ?? val;

  return (
    <>
      <ProfileSection
        title="Personals Information"
        onEdit={openModal}
        isEmpty={!data}
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
      >
        <DisplayRow label="Gender" value={labelFor(GENDER_OPTIONS, data?.gender ?? '')} />
        <DisplayRow label="Sadat" value={data?.sadat ? 'Yes' : 'No'} />
        <DisplayRow label="Birth Date" value={data?.birth_date} />
        <DisplayRow label="Birth Location" value={data?.birth_location} />
        <DisplayRow label="Education" value={labelFor(EDUCATION_OPTIONS, data?.education ?? '')} />
        <DisplayRow label="Degree" value={data?.degree} />
        <DisplayRow label="Military Status" value={labelFor(MILITARY_OPTIONS, data?.military_status ?? '')} />
        <DisplayRow label="Military Status Explanation" value={data?.military_status_explanation} />
        <DisplayRow label="Income" value={labelFor(INCOME_OPTIONS, data?.income ?? '')} />
        <DisplayRow label="Deposit" value={labelFor(DEPOSIT_OPTIONS, data?.deposit ?? '')} />
        <DisplayRow label="Have Insurance" value={data?.have_insurance ? 'Yes' : 'No'} />
        <DisplayRow
          label="Insurance Type"
          value={formatMultiValue(data?.insurance_type, INSURANCE_TYPE_OPTIONS)}
        />
        <DisplayRow label="Insurance Years" value={data?.insurance_years} />
        <DisplayRow
          label="Leisure Type"
          value={formatMultiValue(data?.leisure_type, LEISURE_OPTIONS)}
        />
        <DisplayRow
          label="Usage Cases"
          value={formatMultiValue(data?.usage_cases, USAGE_CASES_OPTIONS)}
        />
        <DisplayRow label="Usage Case Description" value={data?.usage_case_description} />
        <DisplayRow label="Tattoo" value={data?.tatto ? 'Yes' : 'No'} />
        <DisplayRow label="Tattoo Description" value={data?.tatto_description} />
        <DisplayRow label="Conviction / Arrest History" value={data?.conviction_or_arrest_history ? 'Yes' : 'No'} />
        <DisplayRow label="Conviction Reason" value={data?.conviction_reason} />
      </ProfileSection>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl w-full">
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {data ? 'Edit' : 'Add'} Personals Information
          </h2>
          <div className="space-y-4">
            <FormField label="Gender" name="gender" type="select" value={state.gender} onChange={handleChange} options={GENDER_OPTIONS} required />
            <FormField label="Sadat" name="sadat" type="boolean" value={state.sadat} onChange={handleChange} hint="Is the user a Sadat?" />
            <FormField label="Birth Date" name="birth_date" type="date" value={state.birth_date} onChange={handleChange} required />
            <FormField label="Birth Location" name="birth_location" type="text" value={state.birth_location} onChange={handleChange} />
            <FormField label="Education" name="education" type="select" value={state.education} onChange={handleChange} options={EDUCATION_OPTIONS} required />
            <FormField label="Degree" name="degree" type="text" value={state.degree} onChange={handleChange} hint="Select the degree of the user." />
            <FormField label="Military Status" name="military_status" type="select" value={state.military_status} onChange={handleChange} options={MILITARY_OPTIONS} />
            <FormField label="Military Status Explanation" name="military_status_explanation" type="textarea" value={state.military_status_explanation} onChange={handleChange} />
            <FormField label="Income" name="income" type="select" value={state.income} onChange={handleChange} options={INCOME_OPTIONS} required />
            <FormField label="Deposit" name="deposit" type="select" value={state.deposit} onChange={handleChange} options={DEPOSIT_OPTIONS} required />
            <FormField label="Have Insurance" name="have_insurance" type="boolean" value={state.have_insurance} onChange={handleChange} />
            {state.have_insurance && (
              <>
                <FormField label="Insurance Type" name="insurance_type" type="multiselect" value={state.insurance_type} onChange={handleChange} options={INSURANCE_TYPE_OPTIONS} />
                <FormField label="Insurance Years" name="insurance_years" type="number" value={state.insurance_years} onChange={handleChange} />
              </>
            )}
            <FormField label="Leisure Type" name="leisure_type" type="multiselect" value={state.leisure_type} onChange={handleChange} options={LEISURE_OPTIONS} />
            <FormField label="Usage Cases" name="usage_cases" type="multiselect" value={state.usage_cases} onChange={handleChange} options={USAGE_CASES_OPTIONS} />
            <FormField label="Usage Case Description" name="usage_case_description" type="textarea" value={state.usage_case_description} onChange={handleChange} hint="Like how many cigars or hookah a day." />
            <FormField label="Tattoo" name="tatto" type="boolean" value={state.tatto} onChange={handleChange} />
            {state.tatto && (
              <FormField label="Tattoo Description" name="tatto_description" type="textarea" value={state.tatto_description} onChange={handleChange} hint="Like where on the body." />
            )}
            <FormField label="Conviction or Arrest History" name="conviction_or_arrest_history" type="boolean" value={state.conviction_or_arrest_history} onChange={handleChange} />
            {state.conviction_or_arrest_history && (
              <FormField label="Conviction Reason" name="conviction_reason" type="textarea" value={state.conviction_reason} onChange={handleChange} />
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
